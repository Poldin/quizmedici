import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
    try {
        // 1. Controllo Orario e Giorno (Fuso Orario Italiano)
        const oraItaliana = new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" });
        const dataStato = new Date(oraItaliana);

        const giornoDellaSettimana = dataStato.getDay(); // 0 = Domenica, 1 = Lunedì...
        const ora = dataStato.getHours();

        // Blocca se è Domenica (0) o fuori dal range 7:00 - 19:59
        if (giornoDellaSettimana === 0 || ora < 7 || ora >= 20) {
            return NextResponse.json({
                status: 'skipped',
                message: 'Fuori dall orario consentito (7-20) o è Domenica.'
            });
        }

        // 2. Inizializzazione ISOLATA del client Admin (solo per questa API)
        // Usiamo le variabili d'ambiente direttamente qui dentro
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
        const { data: prospect, error: fetchError } = await supabaseAdmin
            .from('quizmedici_cliniche')
            .select('*')
            .eq('first_mail_sent', false)
            .neq('email', null) 
            .limit(1)
            .maybeSingle(); 

        if (fetchError || !prospect) {
            return NextResponse.json({ status: 'no-op', message: 'Nessun prospect rimasto da elaborare.' });
        }

        const { email, slug } = prospect;

        // 4. Struttura HTML della Mail con firma ottimizzata
        const emailHtml = `
      <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
        <p>Oltre l'83% dei pazienti amerebbe scoprire qualcosa di utile mentre aspetta in sala d'attesa.</p>
        <p>Ecco perché abbiamo creato <strong>QUIZMEDICI</strong>: per intrattenere ed educare i pazienti in sala d'attesa.</p>
        
        <p>Provate il quiz qui voi stessi:<br />
        <a href="https://quizmedici.vercel.app/?sptd=${slug}" style="color: #0070f3; text-decoration: underline;">https://quizmedici.vercel.app/?sptd=${slug}</a></p>
        
        <h3 style="margin-top: 24px; color: #111;">PERCHÉ USARE QUIZMEDICI PER I PAZIENTI?</h3>
        <ul>
          <li>Intrattiene, educa e cura l'esperienza del paziente (anche quando voi tardate).</li>
          <li>Se poi i pazienti lo condividono con gli amici... è pubblicità gratis per voi!</li>
        </ul>

        <h3 style="margin-top: 24px; color: #111;">COME SI INIZIA? QUANTO COSTA?</h3>
        <p>È <strong>GRATIS</strong></p>
        <ol>
          <li>Accedete a questo link: <a href="https://quizmedici.vercel.app/create_pdfs?sptd=${slug}" style="color: #0070f3; text-decoration: underline;">https://quizmedici.vercel.app/create_pdfs?sptd=${slug}</a></li>
          <li>Stampate il PDF che vi piace di più.</li>
          <li>Rendetelo visibile in sala d'attesa.</li>
          <li>Comunicateci a che mail vi mandiamo le statistiche a fine mese (se vi interessano).</li>
        </ol>
        <p>Fine.</p>

        <p style="font-size: 0.9em; color: #666; margin-top: 20px;">
          Alla fine di ogni mese vi mandiamo i dati di utilizzo.<br />
          Ogni mese esce un nuovo quiz: ma voi non dovete fare nulla, il QrCode non cambia.
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px; margin-bottom: 20px;" />
        <div style="font-family: sans-serif;">
          <div style="font-size: 18px; font-weight: bold; color: #111;">Giuliana Silla</div>
          <div style="font-size: 13px; color: #555; margin-bottom: 10px;">
            VP @ <a href="https://visitae.vercel.app/" target="_blank" rel="noopener" style="color: #0070f3; text-decoration: none;">visitae</a>
          </div>
          <div>
            <img src="https://toyuzchjvhhecidpljja.supabase.co/storage/v1/object/public/pub/giuliana%20silla%20firma.png" alt="Firma Giuliana Silla" style="max-width: 250px; height: auto; display: block;" />
          </div>
        </div>
      </div>
    `;

        // 5. Invio della mail con Resend
        const { data: resendData, error: resendError } = await resend.emails.send({
            from: 'Giuliana <giuliana@vetrinae.xyz>',
            to: [email],
            subject: "Quanto si annoiano i pazienti in sala d'attesa?",
            html: emailHtml,
        });

        if (resendError) {
            throw new Error(`Errore Resend: ${resendError.message}`);
        }

        // 6. Aggiornamento record e metadati
        const vecchioMeta = typeof prospect.meta === 'object' && prospect.meta !== null ? prospect.meta : {};
        const nuovoMeta = {
            ...vecchioMeta,
            first_email_sent_at: new Date().toISOString(),
            resend_message_id: resendData?.id,
            delivery_timezone: "Europe/Rome"
        };

        const { error: updateError } = await supabaseAdmin
            .from('quizmedici_cliniche')
            .update({
                first_mail_sent: true,
                meta: nuovoMeta
            })
            .eq('id', prospect.id);

        if (updateError) {
            throw new Error(`Errore DB Update: ${updateError.message}`);
        }

        return NextResponse.json({
            status: 'success',
            message: `Email inviata a ${email} per la clinica con slug: ${slug}`
        });

    } catch (error: any) {
        return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
    }
}