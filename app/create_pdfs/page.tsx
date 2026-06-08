'use client';
import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

export default function CanvaEmulator() {
    const [url, setUrl] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const posterRefs = useRef<(HTMLDivElement | null)[]>([]);

    const generateAndDownload = async (index: number) => {
        const element = posterRefs.current[index];
        if (!element) return;

        setLoading(true);
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        pdf.save(`poster_${index + 1}.pdf`);
        setLoading(false);
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
            {/* Import Anton Font */}
            <style dangerouslySetInnerHTML={{ __html: `@import url('https://googleapis.com');` }} />

            <div className="max-w-xl mx-auto mb-10 bg-white p-6 rounded shadow">
                <input
                    type="url" className="border p-2 w-full mb-4" placeholder="URL del Quiz..."
                    value={url} onChange={(e) => setUrl(e.target.value)}
                />
                <button onClick={createQr} className="bg-blue-600 text-white px-4 py-2 w-full font-bold">
                    CARICA DATI
                </button>
            </div>

            <div className="flex flex-col gap-20 items-center">
                {contents.map((c, i) => (
                    <div key={i} className="flex flex-col items-center">
                        {/* AREA POSTER (Simula A4) */}
                        <div
                            ref={(el) => { posterRefs.current[i] = el; }} // Aggiunte le graffe {} per evitare il return
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

                        <button
                            onClick={() => generateAndDownload(i)}
                            className="mt-4 bg-black text-white px-10 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                        >
                            SCARICA PDF {i + 1}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
