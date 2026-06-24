import React, { useState } from "react";
import { Award, Share2, Sparkles, Check, ChevronRight, BookOpen, Lock, Plus } from "lucide-react";
import { UserProfile, RitualHealthMetrics, Article } from "../types";
import { ACHIEVEMENTS, ARTICLES } from "../data";
import { Crystal3D } from "./Crystal3D";

interface ProgressTabProps {
  profile: UserProfile;
  metrics: RitualHealthMetrics;
  completedLevels: string[];
}

export const ProgressTab: React.FC<ProgressTabProps> = ({ profile, metrics, completedLevels }) => {
  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showShareModal, setShowGoalShare] = useState<any | null>(null);
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 3, target: 5 });
  const [isCopied, setIsCopied] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const getCrystalStage = () => {
    const c = (s: string) => completedLevels.filter(l => l.includes(s)).length >= 3;
    if (c("clarity")) return 5;
    if (c("energy")) return 4;
    if (c("silence")) return 3;
    if (c("istok")) return 2;
    if (completedLevels.includes("istok_1")) return 1;
    return 0;
  };
  const currentLevel = getCrystalStage();
  const stageNames = ["Туман", "Искра", "Источник", "Тишина", "Энергия", "Ясность"];
  const stageColors = ["#ffffff20", "#C9A96E", "#8899AA", "#8AB4C8", "#D4875E", "#7BC47F"];

  const getStageDescription = (stage: number) => {
    const descs = [
      'Твой внутренний мир скрыт под шумом. Начни Путь Внимания, чтобы рассеять дымку.',
      'Первый ритуал зажег искру. Она мягко греет твое внимание в тумане.',
      'Поздравляем! Базовые грани кристалла очищены и сияют золотом Исходного Света.',
      'Тишина наполнила глубину кристалла лавандовым свечением покоя.',
      'Огненные контуры воли пробегают по граням пробужденной энергии сердца.',
      'Совершенный спектральный алмаз. Преломляет чистый радужный свет ясности разума.'
    ];
    return descs[stage] || descs[0];
  };

  return (
    <div className="space-y-10 pb-24 text-left animate-[fade-in_0.5s_ease-out]">
      {/* HEADER + Share */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-4 h-[1px] bg-white/6" />
            <span className="text-[8px] font-mono tracking-[0.25em] text-white/20 uppercase">Прогресс</span>
          </div>
          <h1 className="text-xl font-display font-light text-white/85 text-aura">Мой Кристалл</h1>
        </div>
        <button onClick={() => setShowGoalShare("crystal")} className="text-white/20 hover:text-white/40 transition-colors">
          <Share2 size={14} />
        </button>
      </div>

      {/* BLOCK 1: Crystal — floating, no card */}
      <div className="relative flex flex-col items-center justify-center py-6">
        <div className="absolute w-56 h-56 rounded-full blur-[80px] opacity-8 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${stageColors[currentLevel]} 0%, transparent 70%)` }} />
        <div className="h-[220px] w-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
          <Crystal3D progressLevel={currentLevel} shineScore={metrics.score} />
        </div>
        <div className="text-center mt-2 space-y-1">
          <span className="text-[9px] font-mono tracking-[0.25em] uppercase block text-aura"
            style={{ color: stageColors[currentLevel] }}>
            {stageNames[currentLevel]}
          </span>
          <p className="text-[8px] text-white/15 font-mono tracking-wider">Кристалл Сознания</p>
        </div>
        <p className="text-xs text-center text-white/35 leading-relaxed font-editorial italic mt-3 max-w-xs">
          {getStageDescription(currentLevel)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-display font-light text-white/50 text-aura-light">Путь в цифрах</span>
        <div className="flex-1 h-[1px] bg-white/[0.02]" />
      </div>

      {/* BLOCK 2: Путь в цифрах — floating emoji tiles */}
      <div className="flex items-center justify-center gap-0 border-t border-white/[0.02] pt-6">
        {[
          { icon: "🗓️", count: `${profile.totalRitualsCount || completedLevels.length}`, label: "дней" },
          { icon: "✨", count: `${profile.totalRitualsCount || completedLevels.length}`, label: "ритуалов" },
          { icon: "🔥", count: `${profile.streak || 0}`, label: "дней серии" },
        ].map((tile, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-base block mb-1 opacity-60">{tile.icon}</span>
            <h3 className="text-xl font-display font-light text-white/70 tracking-tighter leading-none">{tile.count}</h3>
            <p className="text-[8px] text-white/15 font-mono tracking-wide mt-1">{tile.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-display font-light text-white/50 text-aura-light">Цели</span>
        <div className="flex-1 h-[1px] bg-white/[0.02]" />
      </div>

      {/* BLOCK 3: Цели — old design */}
      <div className="border-t border-white/[0.02] pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-4 rounded-full bg-[#C9A96E]/30" />
            <div>
              <span className="text-[8px] font-mono tracking-[0.25em] text-white/20 uppercase">Твоя цель на неделю</span>
              <h4 className="text-sm font-display font-light text-white/70 mt-0.5 text-aura-light">
                {weeklyGoal.current} из {weeklyGoal.target} практик
              </h4>
            </div>
          </div>
          <button onClick={() => setShowGoalModal(true)}
            className="text-[8px] text-white/20 hover:text-white/40 font-mono tracking-wider transition-colors">Изменить</button>
        </div>
        <div className="w-full bg-white/4 h-[2px] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-[1.5s] ease-out"
            style={{ width: `${(weeklyGoal.current / weeklyGoal.target) * 100}%`, backgroundColor: "#C9A96E", opacity: 0.5 }} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-display font-light text-white/50 text-aura-light">Мои достижения</span>
        <div className="flex-1 h-[1px] bg-white/[0.02]" />
      </div>

      {/* BLOCK 4: Достижения — old design */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x py-1">
        {ACHIEVEMENTS.map((ach, i) => {
          const unlocked = i === 0 || completedLevels.length >= i * 2;
          return (
            <div key={ach.id} onClick={() => setSelectedAchievement(ach)}
              className={`min-w-[110px] max-w-[110px] snap-start cursor-pointer select-none text-center py-3 px-2 transition-all ${unlocked ? '' : 'opacity-15'}`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                style={{ background: unlocked ? "rgba(201,169,110,0.06)" : "rgba(255,255,255,0.02)" }}>
                <span className="material-symbols-outlined text-lg" style={{ color: unlocked ? "#C9A96E" : "rgba(255,255,255,0.1)" }}>{ach.icon}</span>
              </div>
              <h4 className="text-[10px] font-light text-white/60 leading-tight">{ach.title}</h4>
              <p className="text-[7px] text-white/15 mt-1 font-mono">{unlocked ? 'Получено' : 'Скрыто'}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-display font-light text-white/50 text-aura-light">Полезное чтение</span>
        <div className="flex-1 h-[1px] bg-white/[0.02]" />
      </div>

      {/* BLOCK 5: Статьи — old style */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 snap-x select-none">
        {ARTICLES.map((article) => (
          <div key={article.id} onClick={() => setActiveArticle(article)}
            className="flex-none w-[160px] cursor-pointer snap-start">
            <div className="aspect-[1.3] rounded-[24px] p-4 flex flex-col justify-between transition-all duration-300 hover:bg-white/[0.04] active:scale-[0.98]"
              style={{ background: `radial-gradient(ellipse at 50% 100%, rgba(201,169,110,0.06) 0%, transparent 70%)` }}>
              <h4 className="text-xs font-medium text-white/85 line-clamp-2 leading-tight">{article.title}</h4>
              <p className="text-[10px] text-white/55 line-clamp-2 leading-normal">{article.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BLOCK 6: Углубление — old design minimal */}
      <div className="border-t border-white/[0.02] pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-[3px] h-4 rounded-full bg-white/10" />
          <span className="text-xs font-display font-light text-white/50">Экосистема</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[8px] text-white/15 font-mono tracking-wider">Ritual Core</span>
          <span className="text-[6px] text-white/8">•</span>
          <span className="text-[8px] text-white/15 font-mono tracking-wider">Plus</span>
        </div>
      </div>

      {/* Goal modal — old design */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-[#07070A]/90 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="max-w-xs w-full text-center space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-display font-light text-white/80 text-aura">Цель на неделю</h3>
              <p className="text-[10px] text-white/20 font-editorial italic">Сколько практик?</p>
            </div>
            <div className="flex items-center justify-center gap-6 py-2">
              <button onClick={() => setWeeklyGoal(p => ({ ...p, target: Math.max(1, p.target - 1) }))}
                className="w-8 h-8 rounded-full bg-white/[0.03] hover:bg-white/[0.06] text-white/30 hover:text-white/50 transition-all text-base flex items-center justify-center">−</button>
              <span className="text-3xl font-display font-light text-white/70 text-aura">{weeklyGoal.target}</span>
              <button onClick={() => setWeeklyGoal(p => ({ ...p, target: p.target + 1 }))}
                className="w-8 h-8 rounded-full bg-white/[0.03] hover:bg-white/[0.06] text-white/30 hover:text-white/50 transition-all text-base flex items-center justify-center">+</button>
            </div>
            <button onClick={() => setShowGoalModal(false)}
              className="text-[9px] text-white/25 hover:text-white/45 font-mono tracking-wider transition-colors">Готово</button>
          </div>
        </div>
      )}

      {/* Achievement detail — old design */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 bg-[#07070A]/90 backdrop-blur-2xl flex items-center justify-center p-6 text-center">
          <div className="max-w-xs w-full space-y-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "rgba(201,169,110,0.06)" }}>
              <span className="material-symbols-outlined text-xl text-[#C9A96E]/60">{selectedAchievement.icon}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[7px] font-mono text-[#C9A96E]/40 uppercase tracking-[0.3em]">Достижение</span>
              <h3 className="text-base font-display font-light text-white/80 text-aura">{selectedAchievement.title}</h3>
              <p className="text-[10px] text-white/25 font-editorial italic leading-relaxed">{selectedAchievement.description}</p>
            </div>
            <button onClick={() => setSelectedAchievement(null)}
              className="text-[9px] text-white/25 hover:text-white/45 font-mono tracking-wider transition-colors">Принять</button>
          </div>
        </div>
      )}

      {/* Share modal — old design */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-[#07070A]/90 backdrop-blur-2xl flex items-center justify-center p-6 text-center">
          <div className="max-w-xs w-full space-y-6">
            <div className="aspect-[9/16] rounded-3xl p-6 flex flex-col justify-between text-left relative overflow-hidden"
              style={{ background: showShareModal === "crystal" ? "radial-gradient(circle at top left, rgba(201,169,110,0.04), transparent)" : "radial-gradient(circle at top left, rgba(255,255,255,0.02), transparent)" }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-8"
                style={{ background: showShareModal === "crystal" ? "#C9A96E" : "#7BC47F" }} />
              <div className="space-y-1 relative z-10">
                <span className="text-[8px] font-mono tracking-widest text-white/20 uppercase">Ritual</span>
                <p className="text-[9px] text-white/12 font-editorial italic">{new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}</p>
              </div>
              <div className="relative z-10 text-center space-y-3">
                {showShareModal === "crystal" && (
                  <><div className="w-10 h-10 rounded-full mx-auto bg-white/[0.03] flex items-center justify-center"><Sparkles className="w-4 h-4 text-[#C9A96E]/40" /></div><h2 className="text-base font-display font-light text-white/70">Мой Кристалл</h2><span className="text-[8px] font-mono text-[#C9A96E]/30 uppercase tracking-[0.3em]">{stageNames[currentLevel]}</span></>
                )}
                {showShareModal === "progress" && (
                  <><h3 className="text-2xl font-display font-light text-white/70">{profile.totalRitualsCount || completedLevels.length}</h3><span className="text-[7px] font-mono text-white/15 uppercase tracking-[0.3em]">ритуалов</span></>
                )}
              </div>
              <div className="border-t border-white/[0.02] pt-4 flex justify-between items-center relative z-10">
                <span className="text-[7px] font-mono text-[#C9A96E]/30 uppercase tracking-widest">RITUAL</span>
                <span className="text-[6px] text-white/10">верни внимание в себя</span>
              </div>
            </div>
            <button onClick={() => { setIsCopied(true); if (navigator.clipboard) navigator.clipboard.writeText("https://ritual.app/share"); }}
              className="text-[9px] text-white/25 hover:text-white/45 font-mono tracking-wider transition-colors">
              {isCopied ? "Скопировано ✦" : "Скопировать ссылку"}
            </button>
            <button onClick={() => setShowGoalShare(null)}
              className="text-[8px] text-white/12 hover:text-white/25 font-mono tracking-wider transition-colors block mx-auto">Назад</button>
          </div>
        </div>
      )}

      {/* Article Reader — old design */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-[#07070A]/95 backdrop-blur-2xl p-6 overflow-y-auto flex justify-center animate-[fade-in_0.4s_ease-out]">
          <div className="max-w-xl w-full space-y-6 pt-12 pb-24 relative text-left">
            <button onClick={() => setActiveArticle(null)}
              className="absolute right-0 top-0 w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">✕</button>
            <span className="text-[9px] font-mono text-[#C9A96E]/50 uppercase tracking-[0.25em]">Полезное чтение</span>
            <h1 className="text-2xl font-display font-light text-white/85 leading-tight text-aura">{activeArticle.title}</h1>
            <h3 className="text-sm font-sans text-[#C9A96E]/60 italic text-aura-light">{activeArticle.subtitle}</h3>
            <div className="border-t border-white/[0.02] pt-6 text-[15px] text-white/50 leading-relaxed font-sans space-y-4 whitespace-pre-line text-aura-light">
              {activeArticle.content}
            </div>
            <button onClick={() => setActiveArticle(null)}
              className="w-full py-3 text-[10px] font-mono text-white/20 hover:text-white/40 tracking-wider uppercase transition-colors">
              Закончить чтение
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProgressTab;
