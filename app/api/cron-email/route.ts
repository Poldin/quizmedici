import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
    console.log("=== CRON: INIZIO FLUSSO ===");
    try {
        // 1. Controllo Orario e Giorno in UTC (Infallibile su server Vercel/Supabase)
        const oraCorrente = new Date();

        const giornoDellaSettimanaUTC = oraCorrente.getUTCDay(); // 0 = Domenica, 1 = Lunedì...
        const oraUTC = oraCorrente.getUTCHours();

        console.log(`[CRON LOG 1] Giorno UTC: ${giornoDellaSettimanaUTC}, Ora UTC: ${oraUTC}`);

        /**
         * L'orario italiano (ora legale estiva a Giugno) è UTC+2.
         * Di conseguenza la tua finestra Italiana (07:00 - 19:59) 
         * si traduce esattamente nella finestra UTC (05:00 - 17:59).
         * * Blocca se è Domenica (0 in UTC) o fuori dal range UTC 5 - 17.
         */
        if (giornoDellaSettimanaUTC === 0 || oraUTC < 4 || oraUTC >= 20) {
            console.log("[CRON LOG 1.1] Condizione ORARIO attivata: SKIPPED");
            return NextResponse.json({
                status: 'skipped',
                message: `Fuori dall orario consentito. Orario UTC attuale: ${oraUTC}:00, Giorno UTC: ${giornoDellaSettimanaUTC} (0=Domenica).`
            });
        }

        // 2. Inizializzazione ISOLATA del client Admin (solo per questa API)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        console.log(`[CRON LOG 2] Controllo ENV - URL: ${!!supabaseUrl}, ServiceKey: ${!!supabaseServiceKey}, ResendKey: ${!!process.env.RESEND_API_KEY}`);

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error("Mancano le variabili d'ambiente necessarie (NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY)");
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });

        // 3. Recupera il primo prospect da elaborare
        console.log("[CRON LOG 3] Eseguo query di selezione su quizmedici_cliniche...");
        const { data: prospect, error: fetchError } = await supabaseAdmin
            .from('quizmedici_cliniche')
            .select('*')
            .or('first_mail_sent.is.null,first_mail_sent.eq.false')
            .neq('email', null)
            .limit(1)
            .maybeSingle();

        if (fetchError) {
            console.error("[CRON LOG 3.ERR] Errore fetch dal database:", fetchError);
        }

        if (fetchError || !prospect) {
            console.log(`[CRON LOG 3.1] Nessun prospect trovato o errore. Prospect: ${!!prospect}`);
            return NextResponse.json({ status: 'no-op', message: 'Nessun prospect rimasto da elaborare.' });
        }

        const { email, slug } = prospect;
        console.log(`[CRON LOG 3.2] Prospect agganciato con successo. ID: ${prospect.id}, Email: ${email}, Slug: ${slug}`);

        // === CONTROLLO E GESTIONE DUPLICATI ===
        console.log(`[CRON LOG 3.3] Controllo se esistono altri record già inviati per l'email: ${email}`);
        const { data: duplicatoInviato, error: duplicateError } = await supabaseAdmin
            .from('quizmedici_cliniche')
            .select('id')
            .eq('email', email)
            .eq('first_mail_sent', true)
            .limit(1)
            .maybeSingle();

        if (duplicateError) {
            console.error("[CRON LOG 3.4.ERR] Errore controllo duplicati:", duplicateError);
        }

        // Se esiste un altro record con la stessa mail che ha già "first_mail_sent: true"
        if (duplicatoInviato) {
            console.log(`[CRON LOG 3.5] Rilevato duplicato già inviato (ID già inviato: ${duplicatoInviato.id}). Disinnesco il record attuale.`);
            
            const vecchioMeta = typeof prospect.meta === 'object' && prospect.meta !== null ? prospect.meta : {};
            const nuovoMetaDuplicato = {
                ...vecchioMeta,
                skipped_reason: "Duplicato di un'email già inviata in precedenza",
                skipped_at: new Date().toISOString(),
                duplicate_of_id: duplicatoInviato.id
            };

            // Marchiamo il record corrente come TRUE per toglierlo dalla coda permanente
            const { error: updateDuplicateError } = await supabaseAdmin
                .from('quizmedici_cliniche')
                .update({
                    first_mail_sent: true,
                    meta: nuovoMetaDuplicato
                })
                .eq('id', prospect.id);

            if (updateDuplicateError) {
                console.error("[CRON LOG 3.6.ERR] Errore durante l'annullamento del duplicato:", updateDuplicateError);
            }

            // Chiudiamo l'esecuzione. Al prossimo giro di CRON questo record non esisterà più per la query iniziale.
            return NextResponse.json({ 
                status: 'skipped-duplicate', 
                message: `Record ${prospect.id} saltato e marcato come inviato perché l'email ${email} era già presente nel record ${duplicatoInviato.id}.` 
            });
        }
        // ======================================

        // 4. Struttura HTML della Mail con firma ottimizzata
        const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.8; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <p>Buongiorno,</p>

    <p>Le scrivo perché abbiamo sviluppato <strong>QuizMedici</strong>, un servizio digitale (gratuito) pensato per migliorare l'esperienza dei pazienti in sala d'attesa.</p>

    <p>Oltre l'83% dei pazienti preferirebbe trovare contenuti utili e interattivi piuttosto che semplici riviste. QuizMedici permette loro di accedere a quiz educativi sulla salute dentale inquadrando un semplice QR Code.</p>

    <div style="background-color: #f9f9f9; border-left: 4px solid #0070f3; padding: 15px; margin: 25px 0;">
        <p style="margin: 0;"><strong>Perché introdurlo in sala d'attesa?</strong></p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
            <li><strong>Migliora la percezione dell'attesa:</strong> riduce lo stress e il "peso" dei tempi morti.</li>
            <li><strong>Educazione e prevenzione:</strong> il paziente arriva in poltrona più consapevole dell'importanza dei trattamenti.</li>
            <li><strong>Visibilità:</strong> i pazienti possono condividere il risultato, portando pubblicità gratuita allo studio.</li>
        </ul>
    </div>

    <p><strong>Come attivarlo (in 60 secondi):</strong></p>
    <ol style="margin-bottom: 25px;">
        <li style="margin-bottom: 10px;">Visualizzi l'anteprima del quiz qui: <a href="https://quizmedici.vercel.app/?sptd=${slug}" style="color: #0070f3; font-weight: bold;">prova il Quiz</a></li>
        <li style="margin-bottom: 10px;">Scarichi il PDF personalizzato per il Suo studio: <a href="https://quizmedici.vercel.app/create_pdfs?sptd=${slug}" style="color: #0070f3; font-weight: bold;">stampa PDF</a></li>
        <li style="margin-bottom: 10px;">Lo stampi e lo esponga in sala d'attesa.</li>
    </ol>

    <p>Il servizio è <strong>totalmente gratuito</strong>. Ogni mese il quiz si aggiorna automaticamente con nuovi contenuti: una volta esposto il QR Code, non dovrà più fare nulla.</p>

    <p style="margin-bottom: 30px;">A fine mese Le invieremo (se lo desidera) il report con i dati di utilizzo e il gradimento dei Suoi pazienti.</p>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />

    <div style="margin-top: 20px;">
        <div style="font-size: 18px; font-weight: bold; color: #111;">Giuliana Silla</div>
        <div style="font-size: 13px; color: #555; margin-bottom: 10px;">
            VP @ <a href="https://quizmedici.vercel.app/" target="_blank" rel="noopener" style="color: #0070f3; text-decoration: none;">quizmedici</a>
        </div>
        <img src="https://toyuzchjvhhecidpljja.supabase.co/storage/v1/object/public/pub/giuliana%20silla%20firma.png" alt="Firma Giuliana Silla" style="max-width: 200px; height: auto; display: block;" />
    </div>
</div>
    `;

        // 5. Invio della mail con Resend
        console.log(`[CRON LOG 5] Chiamo Resend per inviare a: ${email}...`);
        const { data: resendData, error: resendError } = await resend.emails.send({
            from: 'Giuliana <giuliana@vetrinae.xyz>',
            to: [email],
            subject: "Materiale per la sala d’attesa",
            html: emailHtml,
        });

        if (resendError) {
            console.error("[CRON LOG 5.ERR] Errore durante l'invio con Resend:", resendError);
            throw new Error(`Errore Resend: ${resendError.message}`);
        }

        console.log(`[CRON LOG 5.1] Resend ha risposto positivamente. ID: ${resendData?.id}`);

        // 6. Aggiornamento record e metadati (sanificazione del vecchio meta se non è un oggetto)
        console.log("[CRON LOG 6] Preparazione metadati e avvio UPDATE su database...");
        const vecchioMeta = typeof prospect.meta === 'object' && prospect.meta !== null ? prospect.meta : {};
        const nuovoMeta = {
            ...vecchioMeta,
            first_email_sent_at: new Date().toISOString(),
            resend_message_id: resendData?.id,
            delivery_timezone: "UTC"
        };

        const { error: updateError } = await supabaseAdmin
            .from('quizmedici_cliniche')
            .update({
                first_mail_sent: true,
                meta: nuovoMeta
            })
            .eq('id', prospect.id);

        if (updateError) {
            console.error("[CRON LOG 6.ERR] Errore durante l'update del database:", updateError);
            throw new Error(`Errore DB Update: ${updateError.message}`);
        }

        console.log("[CRON LOG SUCCESS] Flusso terminato con successo!");
        return NextResponse.json({
            status: 'success',
            message: `Email inviata a ${email} per la clinica con slug: ${slug}`
        });

    } catch (error: any) {
        console.error("[CRON LOG CRASH] Rilevato un errore nel blocco catch globale:", error.message);
        return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
    }
}