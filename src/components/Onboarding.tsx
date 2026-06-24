import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Mic, BookOpen, Diamond } from "lucide-react";

interface OnboardingProps {
  onComplete: (responses: { message: string; answer: string }[]) => void;
}

const cards = [
  { icon: Sparkles, title: "Сияние", desc: "Ritual считывает состояние твоего тела, чтобы предложить практику, которая нужна именно сейчас." },
  { icon: Mic, title: "Голос", desc: "Расскажи, что ты чувствуешь, — и Ritual подберет практику под твой запрос." },
  { icon: BookOpen, title: "Практики", desc: "Дыхание, движение, фокус, тишина. От 2 до 20 минут. В основе — нейробиология." },
  { icon: Diamond, title: "Кристалл", desc: "Твой прогресс обретает форму. Кристалл отражает твой путь – он становится чище от практик и ярче от твоего состояния." },
];

const AnimatedBackground: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#07070A]">
    {/* deep space gradient base */}
    <div className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #0B1120 0%, #07070A 60%)" }} />

    {/* aurora bands */}
    <div className="absolute -top-[10%] left-0 w-[200%] h-[45%] animate-aurora-drift"
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(107,33,168,0.12) 20%, rgba(201,169,110,0.08) 40%, rgba(107,33,168,0.1) 60%, transparent 80%)", filter: "blur(60px)" }} />
    <div className="absolute top-[15%] -left-[20%] w-[180%] h-[35%] animate-aurora-wave"
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.06) 15%, rgba(201,169,110,0.1) 40%, rgba(139,92,246,0.08) 65%, transparent 85%)", filter: "blur(70px)", animationDelay: "-4s" }} />
    <div className="absolute top-[40%] -left-[10%] w-[160%] h-[30%] animate-aurora-drift animate-aurora-fade-slow"
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.06) 25%, rgba(168,85,247,0.08) 50%, rgba(59,130,246,0.05) 75%, transparent 100%)", filter: "blur(80px)", animationDelay: "-8s", animationDuration: "25s" }} />
    <div className="absolute top-[55%] -left-[30%] w-[200%] h-[25%] animate-aurora-wave animate-aurora-fade"
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.05) 10%, rgba(201,169,110,0.07) 35%, rgba(59,130,246,0.06) 60%, transparent 85%)", filter: "blur(90px)", animationDelay: "-12s", animationDuration: "20s" }} />
    <div className="absolute -bottom-[5%] -left-[15%] w-[190%] h-[35%] animate-aurora-sway"
      style={{ background: "linear-gradient(90deg, transparent 0%, rgba(107,33,168,0.08) 30%, rgba(59,130,246,0.06) 55%, rgba(201,169,110,0.05) 75%, transparent 100%)", filter: "blur(75px)", animationDelay: "-6s", animationDuration: "28s" }} />

    {/* bright core glints */}
    <div className="absolute top-[12%] left-[30%] w-32 h-32 rounded-full animate-aurora-fade"
      style={{ background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)", filter: "blur(40px)", animationDelay: "-2s" }} />
    <div className="absolute top-[35%] right-[20%] w-40 h-40 rounded-full animate-aurora-fade-slow"
      style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", filter: "blur(50px)", animationDelay: "-10s" }} />
    <div className="absolute bottom-[25%] left-[15%] w-36 h-36 rounded-full animate-aurora-fade"
      style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", filter: "blur(45px)", animationDelay: "-6s" }} />

    {/* stars */}
    {[...Array(30)].map((_, i) => (
      <div key={i} className="absolute rounded-full animate-twinkle"
        style={{
          left: `${1 + (i * 7 + 3) % 98}%`,
          top: `${1 + (i * 13 + 7) % 98}%`,
          width: `${1 + i % 2}px`,
          height: `${1 + i % 2}px`,
          background: i % 3 === 0 ? "rgba(201,169,110,0.6)" : "rgba(255,255,255,0.4)",
          animationDelay: `${i * 0.7}s`,
          animationDuration: `${2 + i % 3}s`,
          boxShadow: i % 5 === 0 ? "0 0 4px rgba(201,169,110,0.3)" : "none",
        }} />
    ))}
  </div>
);

const Screen0: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 1000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07070A]">
      <AnimatedBackground />
      <div className="animate-logo-reveal text-center">
        <h1 className="font-display text-4xl font-light tracking-[0.3em] text-white/80">RITUAL</h1>
        <p className="text-[8px] font-mono tracking-[0.5em] text-white/15 mt-4 uppercase">Система восстановления внимания</p>
      </div>
    </div>
  );
};

const Screen1: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07070A]">
      <AnimatedBackground />
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <div className={`text-center space-y-6 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 className="font-editorial text-3xl font-light text-white/70 leading-snug">Все начинается<br />с тебя</h2>
          <p className="text-xs text-white/25 font-light tracking-wider">Войти в пространство</p>
        </div>
      </div>
      <div className={`w-full px-8 pb-16 relative z-10 space-y-3 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <button onClick={onDone} className="w-full py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.07] text-white/60 hover:text-white/80 text-xs tracking-wider transition-all border border-white/[0.04] flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="currentColor" opacity="0.1"/><path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          через Apple
        </button>
        <button onClick={onDone} className="w-full py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.07] text-white/60 hover:text-white/80 text-xs tracking-wider transition-all border border-white/[0.04] flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="currentColor" opacity="0.6"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" opacity="0.4"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" opacity="0.3"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" opacity="0.8"/></svg>
          через Google
        </button>
      </div>
    </div>
  );
};

const Screen2: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 150); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07070A]">
      <AnimatedBackground />
      <div className="flex-1 flex flex-col justify-center px-6 relative z-10 overflow-y-auto">
        <div className={`max-w-sm mx-auto w-full space-y-6 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm text-white/30 font-light leading-relaxed">
            Мир перегружен уведомлениями, суетой и чужими целями. Ritual создан для того, чтобы вернуть тебе контроль над вниманием.
          </p>
          <div className="space-y-3">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.015] border border-white/[0.03] transition-all duration-500 hover:bg-white/[0.025]"
                  style={{ animationDelay: `${i * 0.1 + 0.3}s` }}>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={14} className="text-white/40" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-semibold text-white/60 tracking-wider uppercase mb-0.5">{card.title}</h4>
                    <p className="text-[10px] text-white/25 font-light leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[7px] font-mono tracking-[0.2em] text-white/10 uppercase">Основано на научных исследованиях</span>
            <div className="flex-1 h-px bg-white/[0.03]" />
          </div>
        </div>
      </div>
      <div className={`w-full px-8 pb-12 relative z-10 transition-all duration-1000 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="max-w-sm mx-auto w-full">
          <button onClick={onDone} className="w-full py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.07] text-white/50 hover:text-white/70 text-xs tracking-wider transition-all border border-white/[0.04]">
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

const Screen3: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07070A]">
      <AnimatedBackground />
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <div className={`text-center max-w-sm space-y-6 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="space-y-1">
            <span className="text-[8px] font-mono tracking-[0.4em] text-white/15 uppercase">Путь внимания</span>
            <h2 className="font-editorial text-3xl font-light text-white/70">Глава 1: Исток</h2>
          </div>
          <p className="text-sm text-white/30 font-light leading-relaxed">
            Это трансформирующее путешествие, которая сменит фокус с внешнего на внутренний рост, усовершенствовав ценности и восприятие. Основа для будущих практик.
          </p>
        </div>
      </div>
      <div className={`w-full px-8 pb-16 relative z-10 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="max-w-sm mx-auto w-full">
          <button onClick={onDone}
            className="w-full py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.07] text-white/60 hover:text-white/80 text-xs tracking-wider transition-all border border-white/[0.04]">
            Начать путь
          </button>
        </div>
      </div>
    </div>
  );
};

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [screen, setScreen] = useState(0);

  if (screen === 0) return <Screen0 onDone={() => setScreen(1)} />;
  if (screen === 1) return <Screen1 onDone={() => setScreen(2)} />;
  if (screen === 2) return <Screen2 onDone={() => setScreen(3)} />;
  if (screen === 3) return <Screen3 onDone={() => { onComplete([]); }} />;
  return null;
};
