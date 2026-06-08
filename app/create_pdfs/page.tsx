'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { useSearchParams } from 'next/navigation';

// 1. Il componente con la logica interna che consuma i parametri URL
function CanvaEmulatorContent() {
    const [url, setUrl] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const posterRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    // Uso dell'hook nativo di Next.js per i parametri di ricerca
    const searchParams = useSearchParams();

    useEffect(() => {
        const sptdParam = searchParams.get('sptd');
        
        if (sptdParam) {
            const autoUrl = `https://quizmedici.vercel.app/?sptd=${sptdParam}`;
            setUrl(autoUrl);
            
            QRCode.toDataURL(autoUrl, { margin: 1 })
                .then(data => setQrDataUrl(data))
                .catch(err => console.error("Errore generazione QR automatico:", err));
        }
    }, [searchParams]);

    const generatePdfInstance = async (index: number) => {
        const element = posterRefs.current[index];
        if (!element) return null;

        setLoading(true);
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        setLoading(false);
        return pdf;
    };

    const generateAndDownload = async (index: number) => {
        const pdf = await generatePdfInstance(index);
        if (pdf) pdf.save(`poster_${index + 1}.pdf`);
    };

    const generateAndPrint = async (index: number) => {
        const pdf = await generatePdfInstance(index);
        if (pdf) {
            const blobUrl = pdf.output('bloburl');
            const printWindow = window.open(blobUrl, '_blank');
            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.print();
                };
            }
        }
    };

    const createQr = async () => {
        if (!url) return alert("Metti un URL");
        const data = await QRCode.toDataURL(url, { margin: 1 });
        setQrDataUrl(data);
    };

    const contents = [
        {
            title: "lo spazzolino ti tradisce?💔",
            sub: "Forse è per come lo tratti e lo fai sentire. Scopri se la vostra è una relazione tossica.",
        },
        {
            title: "🥱Ehi, ti stai annoiando??",
            sub: "Smetti di scrollare il telefono o fissare il muro. Scopri gli errori comuni e i falsi miti sulla cura dei denti.",
        },
        {
            title: "⛔Stop al filo interdentale!",
            sub: "Sarebbe lo slogan dei batteri della bocca se organizzassero un corteo di protesta. Scopri perché è il tuo miglior alleato!",
        }
    ];

    return (
        <div className="p-8 bg-gray-200 min-h-screen font-sans">
            <style dangerouslySetInnerHTML={{ __html: `@import url('https://googleapis.com');` }} />

            <div className="max-w-xl mx-auto mb-10 bg-white p-6 rounded shadow">
                <input
                    type="url" className="border p-2 w-full mb-4 text-gray-900" placeholder="URL del Quiz..."
                    value={url} onChange={(e) => setUrl(e.target.value)}
                />
                <button onClick={createQr} className="bg-blue-600 text-white px-4 py-2 w-full font-bold">
                    CARICA DATI
                </button>
            </div>

            <div className="flex flex-col gap-20 items-center">
                {contents.map((c, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div
                            ref={(el) => { posterRefs.current[i] = el; }}
                            className="bg-white shadow-2xl overflow-hidden"
                            style={{
                                width: '210mm',
                                height: '297mm',
                                padding: '20mm',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'left'
                            }}
                        >
                            <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '70pt', fontWeight: 'bold', color: '#333', lineHeight: '1.1', marginBottom: '10mm' }}>
                                {c.title}
                            </h1>
                            <p style={{ fontFamily: 'Anton, sans-serif', fontSize: '18pt', color: '#333', marginBottom: '30mm' }}>
                                {c.sub}
                            </p>

                            <div style={{ marginTop: 'auto', textAlign: 'center', marginBottom: '20mm' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '14pt', marginBottom: '5mm', color: '#333' }}>INQUADRA IL QR CODE E RISPONDI.</p>
                                {qrDataUrl && <img src={qrDataUrl} style={{ width: '80mm', margin: '0 auto' }} alt="qr" />}
                            </div>

                            <div style={{ textAlign: 'center', fontSize: '20pt', fontWeight: 'bold', color: '#666' }}>
                                QUIZMEDICI
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => generateAndDownload(i)}
                                disabled={loading}
                                className="bg-black text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                SCARICA PDF {i + 1}
                            </button>
                            
                            <button
                                onClick={() => generateAndPrint(i)}
                                disabled={loading}
                                className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                STAMPA PDF {i + 1}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 2. L'esportazione principale protetta da Suspense (Richiesto obbligatoriamente da Next.js durante il build delle pagine statiche)
export default function CanvaEmulator() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Caricamento configuratore...</div>}>
            <CanvaEmulatorContent />
        </Suspense>
    );
}