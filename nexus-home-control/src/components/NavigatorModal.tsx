import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, MessageSquare, ArrowRight, Play, Compass, Loader2, Check } from 'lucide-react';
import { NavigatorRecomendation } from '../types';

interface NavigatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendation: (rec: any) => void;
}

export default function NavigatorModal({
  isOpen,
  onClose,
  onApplyRecommendation
}: NavigatorModalProps) {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<NavigatorRecomendation | null>(null);

  // Simulated recording timer clamp
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTimer(prev => {
          if (prev >= 10) {
            // auto-stop at 10s as described in spec
            setIsRecording(false);
            handleSubmitSimulatedVoice();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setRecordTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecommendation(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    handleSubmitSimulatedVoice();
  };

  const handleSubmitSimulatedVoice = () => {
    // Generate a default transcription phrase based on duration or random
    const sampleMoods = [
      "Я перегружен кучей сообщений из чата, постоянно гудит голова весной",
      "Чувствую сильную усталость и тяжесть, тяжело проснуться утром",
      "Присутствует фоновое напряжение, нужно срочно сосредоточиться на рабочей задаче",
      "Внутри спокойная гармония, просто хочу подышать перед сном"
    ];
    const chosen = sampleMoods[Math.floor(Math.random() * sampleMoods.length)];
    setTextInput(chosen);
    triggerAINavigation(chosen);
  };

  const triggerAINavigation = async (promptText: string) => {
    if (!promptText || promptText.trim() === "") return;
    setLoading(true);
    setRecommendation(null);

    try {
      const response = await fetch('/api/ai-navigator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: promptText })
      });

      if (!response.ok) {
        throw new Error("API Navigator failed");
      }

      const data = await response.json();
      setRecommendation(data);
    } catch (e) {
      console.error(e);
      // Fallback fallback if backend isn't up yet
      setRecommendation({
        state: 'Tension',
        phrase: 'Локальное Напряжение',
        reason: 'Таймер ума перегружен уведомлениями. Требуется мягкий фокус на дыхании.',
        ritualName: 'Квадратное дыхание',
        ritualGroup: 'Исток',
        duration: '05:15',
        instructions: 'Дыши в ритме четыре счёта на каждую фазу для быстрого снятия хаоса.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (recommendation) {
      onApplyRecommendation(recommendation);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop exit */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="w-full max-w-md bg-[#0e101cf6] border-t border-white/10 rounded-t-[32px] p-6 pb-12 z-50 flex flex-col space-y-5"
          >
            {/* Header section */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-[#E6B85C] animate-spin-slow" />
                <div className="flex flex-col">
                  <h3 className="text-md font-medium text-white/95">ИИ ассистент внимания</h3>
                  <span className="text-[10px] text-white/40 tracking-wider font-mono uppercase">Голосовой Локатор</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 active:scale-90 flex items-center justify-center text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Recording Audio Wave block */}
            <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isRecording ? (
                  <motion.div 
                    key="recording"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    {/* Pulsing wave bars representation */}
                    <div className="flex items-end justify-center space-x-1.5 h-10 w-48">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((bar) => (
                        <motion.div 
                          key={bar}
                          animate={{ 
                            height: [10, Math.floor(Math.random() * 32) + 12, 10]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 0.6 + bar * 0.05, 
                            ease: "easeInOut" 
                          }}
                          className="w-[3px] bg-gradient-to-t from-purple-400 to-[#E6B85C] rounded-full"
                        />
                      ))}
                    </div>

                    <span className="text-xs text-white/60 font-mono animate-pulse">Запись... {recordTimer}/10 сек</span>
                    <button 
                      onClick={handleStopRecording}
                      className="px-5 py-1.5 rounded-full bg-rose-500 text-white text-xs font-semibold active:scale-95 transition"
                    >
                      Прервать & Отправить
                    </button>
                  </motion.div>
                ) : loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center space-y-3"
                  >
                    <Loader2 className="w-8 h-8 text-amber-300 animate-spin" />
                    <span className="text-xs text-white/50 font-sans">ИИ анализирует ритм твоего голоса...</span>
                  </motion.div>
                ) : recommendation ? (
                  <motion.div 
                    key="recommendation"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col space-y-4 w-full"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Анализ состояния</span>
                        <span className="text-sm font-semibold text-white/90">{recommendation.phrase}</span>
                      </div>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-amber-300 font-mono">
                        {recommendation.state}
                      </span>
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed font-sans">{recommendation.reason}</p>

                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 font-mono tracking-wider">РИТУАЛ ДНЯ</span>
                        <span className="text-xs font-semibold text-white/95">{recommendation.ritualName}</span>
                        <span className="text-[9px] text-[#E6B85C] font-mono mt-0.5">{recommendation.ritualGroup} • {recommendation.duration}</span>
                      </div>
                      <button 
                        onClick={handleApply}
                        className="p-2.5 rounded-full bg-amber-400 text-black active:scale-95 transition"
                        title="Добавить на главный экран"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>

                    <p className="text-[9px] text-white/35 font-mono italic">
                      {recommendation.instructions}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center space-y-3"
                  >
                    <button 
                      onClick={startVoiceRecording}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-[#E6B85C] flex items-center justify-center text-black active:scale-95 transition shadow-lg shadow-amber-500/25 pointer-events-auto"
                      title="Пуск записи голоса"
                    >
                      <Mic className="w-7 h-7" />
                    </button>
                    <span className="text-xs text-white/60 font-sans tracking-wide">
                      Нажми кнопку и расскажи о своем настроении
                    </span>
                    <span className="text-[10px] text-white/35 max-w-[240px] leading-relaxed">
                      Например: &quot;Я очень напряжен, не могу спать и чувствую сильную тревогу на душе&quot;
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Manual Text input support */}
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Или введи свой запрос сообщением..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    triggerAINavigation(textInput);
                  }
                }}
                disabled={isRecording || loading}
                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/10"
              />
              <button 
                onClick={() => triggerAINavigation(textInput)}
                disabled={isRecording || loading || !textInput.trim()}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition flex items-center justify-center text-white cursor-pointer disabled:opacity-45 disabled:pointer-events-none"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
