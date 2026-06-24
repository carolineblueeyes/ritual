import React, { useState, useEffect, useRef } from "react";
import { X, Mic, Send, Sparkles, Check, Play } from "lucide-react";
import { RITUALS_DATA } from "../data";

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchRitual: (id: string, group: string) => void;
  userShineScore?: number;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose, onLaunchRitual }) => {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [recommendedRitual, setRecommendedRitual] = useState<{ id: string; title: string; duration: string; group: "Исток" | "Тишина" | "Энергия" | "Ясность"; whyText: string; } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) { setIsRecording(false); setResponseMessage(null); setRecommendedRitual(null); return; }
  }, [isOpen]);

  useEffect(() => {
    if (!isRecording) { if (animationRef.current) cancelAnimationFrame(animationRef.current); return; }
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let phase = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1.5;
      const colors = ["rgba(201,169,110,0.2)", "rgba(136,153,170,0.25)", "rgba(212,135,94,0.15)"];
      const freqs = [1.2, 0.8, 1.6];
      for (let w = 0; w < 3; w++) {
        ctx.strokeStyle = colors[w]; ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const amp = Math.sin(phase + x * 0.03 * freqs[w]) * 12 * Math.sin((x / canvas.width) * Math.PI);
          const y = canvas.height / 2 + amp;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      phase += 0.12;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      setSeconds(0);
      timerRef.current = setInterval(() => { setSeconds(p => { if (p >= 9) { handleEndRecording(true); return 10; } return p + 1; }); }, 1000);
    } else { if (timerRef.current) clearInterval(timerRef.current); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const handleStartRecording = () => { setResponseMessage(null); setRecommendedRitual(null); setIsRecording(true); };

  const handleEndRecording = async (shouldProcess: boolean) => {
    setIsRecording(false);
    if (!shouldProcess) return;
    setIsThinking(true);
    const voiceSamples = [
      "я очень сильно зажат, стресс после работы и мысли не дают уснуть",
      "чувствую сильную панику и тревогу прямо сейчас, сердце колотится",
      "нет энергии, чувствую утомление, апатия, не могу работать",
      "нужно спланировать дела, хаос в задачах и затуманенный ум",
    ];
    await getRecommendation(voiceSamples[Math.floor(Math.random() * voiceSamples.length)]);
  };

  const handleSubmitText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText; setInputText(""); setIsThinking(true); setResponseMessage(null); setRecommendedRitual(null);
    await getRecommendation(text);
  };

  const getRecommendation = async (text: string) => {
    try {
      const res = await fetch("/api/recommend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: text }) });
      if (!res.ok) throw new Error("Fallback");
      const data = await res.json();
      setResponseMessage(data.response); setRecommendedRitual(data.ritual);
    } catch (e) {
      setTimeout(() => {
        const q = text.toLowerCase();
        let message = "Я выслушал твой запрос. Твоему организму требуется ";
        let ritual: any = null;
        if (q.includes("уснуть") || q.includes("ноч") || q.includes("вечер") || q.includes("спи") || q.includes("сон")) {
          message += "глубокое переключение. Давай завершим дневные циклы тревоги.";
          ritual = { id: "night_journal", title: "Ночной дневник", duration: "7:30", group: "Тишина", whyText: "Дневник разгружает мозг, закрывает гештальты дня." };
        } else if (q.includes("паник") || q.includes("тревог") || q.includes("сердце") || q.includes("страх")) {
          message += "экстренный сброс паники. Перенаправим фокус на внешние рецепторы.";
          ritual = { id: "5-4-3-2-1", title: "5-4-3-2-1: Нейро-сброс", duration: "5:30", group: "Исток", whyText: "Билатеральная стимуляция гасит выброс адреналина." };
        } else if (q.includes("сил") || q.includes("устал") || q.includes("апат") || q.includes("холод") || q.includes("сонны")) {
          message += "активация внутреннего тепла. Разожжём огонёк энергии.";
          ritual = { id: "internal_sun", title: "Внутренний жар", duration: "9:20", group: "Энергия", whyText: "Тибетская практика Туммо стимулирует бурый жир." };
        } else {
          message += "кристаллизация приоритетов. Структурируем твой день.";
          ritual = { id: "priorities", title: "Расстановка приоритетов", duration: "5:00", group: "Ясность", whyText: "Разгружает рабочую память, настраивает на фокус." };
        }
        setResponseMessage(message); setRecommendedRitual(ritual); setIsThinking(false);
      }, 1500);
    } finally { setIsThinking(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07070A]/60 backdrop-blur-2xl flex items-end justify-center pointer-events-auto">
      <div className="w-full max-w-lg bg-black/20 backdrop-blur-2xl rounded-t-[32px] p-6 pb-12 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C9A96E]/50 animate-pulse" />
            <span className="font-display text-base font-light text-white/70 text-aura">ИИ Навигатор</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center my-4 min-h-[200px]">
          {!isRecording && !isThinking && !responseMessage && (
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#C9A96E]/5 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-[#C9A96E]/50 text-xl" />
              </div>
              <h3 className="text-white/70 font-light text-base mb-2 text-aura">Как твоё состояние?</h3>
              <p className="text-xs text-white/25 px-6">Нажми микрофон и расскажи о чувствах. ИИ подберёт ритуал.</p>
            </div>
          )}

          {isRecording && (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="text-[#C9A96E]/50 font-mono text-xs tracking-widest mb-4">ЗАПИСЬ: 00:0{seconds}</div>
              <canvas ref={canvasRef} width={280} height={80} className="w-full h-20 max-w-[320px]" />
              <p className="text-[10px] text-white/20 mt-3 animate-pulse">ИИ слушает...</p>
            </div>
          )}

          {isThinking && (
            <div className="text-center">
              <div className="relative w-12 h-12 rounded-full border-t border-[#C9A96E]/30 animate-spin mx-auto mb-4" />
              <p className="text-xs text-white/30">Кристаллизую рекомендации...</p>
            </div>
          )}

          {responseMessage && (
            <div className="w-full text-left space-y-4">
              <div className="bg-white/[0.02] p-4 rounded-xl">
                <p className="text-xs text-white/50 leading-relaxed italic text-aura-light">"{responseMessage}"</p>
              </div>
              {recommendedRitual && (
                <div className="space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-wider">Рекомендация • {recommendedRitual.group}</span>
                    <span className="text-[10px] text-white/20">{recommendedRitual.duration}</span>
                  </div>
                  <h4 className="text-white/70 font-light text-base text-aura">{recommendedRitual.title}</h4>
                  <p className="text-[10px] text-white/30 leading-normal">{recommendedRitual.whyText}</p>
                  <button onClick={() => { onLaunchRitual(recommendedRitual.id, recommendedRitual.group); onClose(); }}
                    className="w-full mt-2 h-11 bg-white/[0.03] hover:bg-white/[0.06] text-white/60 rounded-full text-xs tracking-wider transition-all active:scale-[0.98] border border-white/[0.03]">
                    Начать практику
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            {isRecording ? (
              <button onClick={() => handleEndRecording(true)}
                className="flex-1 h-12 bg-white/[0.03] hover:bg-white/[0.06] text-white/60 rounded-full text-xs tracking-wider transition-all active:scale-[0.98] border border-white/[0.03]">
                <Check size={14} className="inline mr-1" /> Анализировать
              </button>
            ) : (
              <button onClick={handleStartRecording}
                className="flex-1 h-12 bg-white/[0.02] hover:bg-white/[0.04] text-white/40 rounded-full text-xs tracking-wider transition-all">
                <Mic size={14} className="inline mr-1 text-[#C9A96E]/50" /> Запись голоса
              </button>
            )}
          </div>
          <form onSubmit={handleSubmitText} className="flex gap-2">
            <input type="text" placeholder="Или впиши текстом своё состояние..." value={inputText} onChange={(e) => setInputText(e.target.value)}
              disabled={isRecording || isThinking}
              className="flex-1 h-11 bg-white/[0.02] border border-white/[0.05] focus:border-white/10 rounded-full px-4 text-xs text-white/60 placeholder:text-white/10 outline-none transition-all" />
            <button type="submit" disabled={isRecording || isThinking || !inputText.trim()}
              className="w-11 h-11 bg-white/[0.03] hover:bg-white/[0.06] text-white/40 rounded-full flex items-center justify-center disabled:opacity-20 transition-all">
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};