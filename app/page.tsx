"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, RotateCcw, ShieldCheck, Check, X } from "lucide-react";
import { quizData, QuizStep, QuizOption } from "./lib/quiz_mvp";
import SponsorBadge from "./components/SponsorBadge";
import { supabase } from "./lib/supabaseClient";

type Message = {
  id: string;
  type: "question" | "answer" | "feedback" | "curiosity";
  content: string;
  options?: QuizOption[];
  correct?: boolean;
};

type SponsorData = {
  name: string | null;
  logo_url: string | null;
  ext_link_url: string | null;
};

export default function QuizPage() {
  const searchParams = useSearchParams();
  const sptdSlug = searchParams.get("sptd");

  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [sponsor, setSponsor] = useState<SponsorData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Inizializza il primo messaggio
  useEffect(() => {
    if (messages.length === 0) {
      addQuestion(0);
    }
  }, []);

  // Recupero dati dello Sponsor da Supabase
  useEffect(() => {
    if (!sptdSlug) return;

    const fetchSponsor = async () => {
      try {
        const { data, error } = await supabase
          .from('quizmedici_cliniche')
          .select('name, logo_url, ext_link_url')
          .eq('slug', sptdSlug)
          .maybeSingle();

        if (error) {
          console.error("Errore nella query Supabase:", error.message);
          return;
        }

        if (data) {
          setSponsor(data);
        }
      } catch (err) {
        console.error("Errore imprevisto nel recupero dello sponsor:", err);
      }
    };

    fetchSponsor();
  }, [sptdSlug]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addQuestion = (stepIndex: number) => {
    const quiz = quizData[stepIndex];
    setMessages((prev) => [
      ...prev,
      {
        id: `q-${quiz.id}`,
        type: "question",
        content: quiz.domanda,
        options: quiz.opzioni,
      },
    ]);
  };

  const handleAnswer = (option: QuizOption) => {
    if (selectedOptionId) return;

    setSelectedOptionId(option.id);
    const currentQuiz = quizData[currentStep];
    if (option.corretta) setScore(prev => prev + 1);

    // 1. Messaggio risposta utente
    setMessages((prev) => [
      ...prev,
      { id: `a-${Date.now()}`, type: "answer", content: option.testo }
    ]);

    // 2. Feedback tecnico dopo breve delay
    setTimeout(() => {
      let feedbackContent = currentQuiz.responso_dettagliato[option.id];

      // Se ha sbagliato, aggiungiamo la spiegazione della corretta
      if (!option.corretta) {
        const correctOption = currentQuiz.opzioni.find(opt => opt.corretta);
        if (correctOption) {
          const correctExplanation = currentQuiz.responso_dettagliato[correctOption.id];
          feedbackContent += `\n\n✅ **La risposta corretta era: ${correctOption.testo}**\n${correctExplanation}`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `f-${Date.now()}`,
          type: "feedback",
          content: feedbackContent,
          correct: option.corretta,
        }
      ]);

      // 3. Curiosità dopo feedback
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `c-${Date.now()}`,
            type: "curiosity",
            content: `${currentQuiz.curiosita.titolo}\n\n${currentQuiz.curiosita.testo}`,
          }
        ]);
      }, 1000);
    }, 600);
  };

  const nextStep = () => {
    setSelectedOptionId(null);
    if (currentStep < quizData.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      addQuestion(next);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 max-w-md mx-auto border-x border-zinc-200 dark:border-zinc-800 font-sans overflow-x-hidden">

      {/* Header */}
      <header className="w-full max-w-md px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 fixed top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 flex justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-black text-lg tracking-tighter uppercase italic leading-none">QuizMedici</h1>


        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Contatore dei passi */}
          <div className="text-xs font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
            {currentStep + 1}/{quizData.length}
          </div>

          {/* Tasto Condividi */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'quizMedici',
                  text: 'Guarda questo quiz!',
                  url: window.location.href,
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copiato negli appunti!');
              }
            }}
            className="text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-2 py-1 rounded border border-zinc-900 dark:border-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-200 flex items-center gap-1 cursor-pointer"
          >
            <span>condividi</span>
          </button>
        </div>
      </header>

      {/* Componente Sponsor*/}
      {sponsor && (
        <div className="mt-8 w-full">
          <SponsorBadge
            name={sponsor.name}
            logoUrl={sponsor.logo_url}
            extLinkUrl={sponsor.ext_link_url}
          />
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-32">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.type === "answer" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[90%] p-4 rounded-xl shadow-sm ${msg.type === "question" ? "bg-zinc-100 dark:bg-zinc-900 rounded-tl-none text-zinc-800 dark:text-zinc-200 font-medium border border-zinc-200 dark:border-zinc-800" :
                msg.type === "answer" ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-tr-none font-semibold" :
                  msg.type === "feedback" ? `border-2 ${msg.correct ? "border-green-500 bg-green-50 dark:bg-green-500/5 text-green-900 dark:text-green-100" : "border-red-500 bg-red-50 dark:bg-red-500/5 text-red-900 dark:text-red-100"} text-sm` :
                    "bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm italic text-zinc-600 dark:text-zinc-400"
                }`}>

                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                ))}

                {/* Opzioni */}
                {msg.type === "question" && !isFinished && (
                  <div className="mt-5 space-y-2">
                    {msg.options?.map((opt) => {
                      const isSelected = selectedOptionId === opt.id;
                      const isCorrect = opt.corretta;
                      const hasAnswered = selectedOptionId !== null;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleAnswer(opt)}
                          disabled={hasAnswered}
                          className={`w-full text-left p-3 rounded-xl border transition-all text-sm flex justify-between items-center ${!hasAnswered
                            ? "border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 active:scale-[0.97]"
                            : isCorrect
                              ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 ring-1 ring-green-500"
                              : isSelected
                                ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"
                                : "border-zinc-200 dark:border-zinc-800 opacity-40"
                            }`}
                        >
                          <span className="flex-1">{opt.testo}</span>
                          {hasAnswered && isCorrect && <Check size={16} className="ml-2 flex-shrink-0" />}
                          {hasAnswered && isSelected && !isCorrect && <X size={16} className="ml-2 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pulsante Next */}
        {messages[messages.length - 1]?.type === "curiosity" && !isFinished && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center pt-6">
            <button
              onClick={nextStep}
              className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-8 py-4 rounded-full font-bold shadow-2xl active:scale-95 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              Continua <ChevronRight size={20} />
            </button>
          </motion.div>
        )}



        {/* Schermata Finale */}
        {isFinished && (



          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 px-4 space-y-6">
            
            <div className="relative inline-block">
              <ShieldCheck size={80} className="mx-auto text-green-500" />
              <div className="absolute -top-2 -right-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold px-2 py-1 rounded-full border-2 border-white dark:border-zinc-950">
                {score}/{quizData.length}
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter">OBIETTIVO RAGGIUNTO</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Hai dimostrato di tenere alla tua salute orale. Ora hai le armi per un sorriso perfetto!
              </p>
            </div>
            
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-xs font-bold uppercase text-zinc-400 mb-1">Cosa fare ora?</p>
              <p className="text-sm font-medium italic">"condividi questo quiz con i tuoi amici per metterli alla prova!"</p>
            </div>
            {/* Componente Sponsor*/}
            {sponsor && (
              <div className="mt-8 w-full">
                <SponsorBadge
                  name={sponsor.name}
                  logoUrl={sponsor.logo_url}
                  extLinkUrl={sponsor.ext_link_url}
                />
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 mx-auto text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
            >
              <RotateCcw size={14} /> Ricomincia il test
            </button>
          </motion.div>
        )}
        <div ref={scrollRef} className="h-10" />
      </div>
    </main>
  );
}