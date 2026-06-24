import React, { useState, useMemo } from "react";
import { Edit3, ChevronRight } from "lucide-react";
import { UserProfile, RitualHealthMetrics, DayScheduleSlot } from "../types";
import { RITUALS_DATA, MOCK_PRACTICE_IMPACTS } from "../data";
import { MoodWheel } from "./MoodWheel";

interface TodayTabProps {
  profile: UserProfile;
  metrics: RitualHealthMetrics;
  schedule: DayScheduleSlot[];
  onUpdateBg: (bg: "water" | "sky" | "aurora" | "mystic") => void;
  onLaunchRitual: (id: string, group: string) => void;
  onToggleScheduleSlot: (id: string) => void;
  onOpenMetricsDetails: () => void;
  onEditSchedule: () => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  profile, metrics, schedule, onUpdateBg, onLaunchRitual, onToggleScheduleSlot, onOpenMetricsDetails, onEditSchedule,
}) => {
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [daySlots, setDaySlots] = useState(schedule);

  const getRecommendation = () => {
    if (metrics.status === "сияешь") return RITUALS_DATA["Энергия"][2];
    else if (metrics.status === "баланс") return RITUALS_DATA["Ясность"][1];
    else if (metrics.status === "напряжение") return RITUALS_DATA["Исток"][2];
    else return RITUALS_DATA["Тишина"][8];
  };
  const recommendedRitual = getRecommendation();

  const statusColors: Record<string, string> = {
    "сияешь": "#C9A96E", "баланс": "#7BC47F", "напряжение": "#D4875E", "перегруз": "#FF6B6B"
  };
  const statusGlow = statusColors[metrics.status] || "#C9A96E";

  const getHealthLabel = (status: string) => {
    switch (status) {
      case "сияешь": return "Сияешь";
      case "баланс": return "Баланс";
      case "напряжение": return "Напряжение";
      case "перегруз": return "Перегруз";
      default: return "Регенерация";
    }
  };

  const handleSaveSlot = (id: string) => {
    setDaySlots(daySlots.map(slot => {
      if (slot.id === id) return { ...slot, title: editTitle, time: editTime };
      return slot;
    }));
    setEditingSlotId(null);
  };

  const addNewSlot = () => {
    if (daySlots.length >= 5) return;
    const newId = `s${Date.now()}`;
    setDaySlots([...daySlots, { id: newId, time: '18:00', title: 'Новый ритуал', ritualId: 'resisted-breath', completed: false, color: '#C9A96E' }]);
  };

  const deleteSlot = (id: string) => {
    if (daySlots.length <= 3) return;
    setDaySlots(daySlots.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-12 pb-24 animate-[fade-in_0.6s_ease-out]">

      {/* HEADER ROW */}
      <div className="flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
            <span className="text-xs font-semibold uppercase text-white/80">{profile.name.slice(0, 2)}</span>
          </div>
          <h1 className="text-sm tracking-[0.3em] uppercase font-mono text-white/30 select-none">R I T U A L</h1>
        </div>
        <div className="relative">
          <button onClick={() => setShowBgPicker(!showBgPicker)}
            className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.08] flex items-center justify-center text-white/60 transition-all">
            <span className="material-symbols-outlined text-lg">palette</span>
          </button>
          {showBgPicker && (
            <div className="absolute right-0 mt-2 w-44 bg-black/40 backdrop-blur-xl rounded-2xl p-2 space-y-1 shadow-2xl z-30 border border-white/[0.03]">
              {[ 
                { id: "water", name: "Вода", color: "#1e40af" },
                { id: "sky", name: "Дымка", color: "#7c3aed" },
                { id: "aurora", name: "Сияние", color: "#059669" },
                { id: "mystic", name: "Слейт", color: "#525252" },
              ].map((bgItem) => (
                <button key={bgItem.id} onClick={() => { onUpdateBg(bgItem.id as any); setShowBgPicker(false); }}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                    profile.activeBg === bgItem.id ? "bg-white/8 text-white" : "text-white/40 hover:bg-white/5"
                  }`}>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: bgItem.color }} />
                    {bgItem.name}
                  </span>
                  {profile.activeBg === bgItem.id && <span className="w-1 h-1 rounded-full bg-[#C9A96E]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BLOCK 1: Состояние духа — floating aura design */}
      <div className="relative w-full flex flex-col items-center text-center select-none">
        <div className="absolute w-72 h-72 rounded-full animate-pulse-aura pointer-events-none"
          style={{ background: `radial-gradient(circle at center, ${statusGlow}08 0%, transparent 70%)` }} />

        <div className="space-y-1 mb-6 relative">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-[1px] bg-white/15" />
            <span className="text-[7px] uppercase font-mono tracking-[0.3em] text-white/40">Состояние духа</span>
            <div className="w-3 h-[1px] bg-white/15" />
          </div>
          <span className="font-editorial italic text-2xl text-white/90 block font-light tracking-wide text-aura">
            {getHealthLabel(metrics.status)}
          </span>
        </div>

        <div onClick={onOpenMetricsDetails}
          className="relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-700 hover:scale-[1.03] active:scale-95 group mb-4">
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="52" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <circle cx="64" cy="64" r="52" fill="transparent" stroke={statusGlow}
              strokeWidth="1.5" strokeDasharray="326" strokeDashoffset={326 - (326 * metrics.score) / 100}
              strokeLinecap="round" className="transition-all duration-[1.5s] ease-out" opacity="0.6"
              style={{ filter: `drop-shadow(0 0 6px ${statusGlow}40)` }} />
          </svg>
          <div className="flex flex-col items-center justify-center relative z-10">
            <span className="text-4xl font-display font-light text-white/90 tracking-tighter leading-none text-aura">{metrics.score}</span>
            <span className="text-[7px] font-mono tracking-[0.25em] text-white/40 uppercase">готовность</span>
          </div>
        </div>

        <p className="text-sm font-editorial italic text-white/60 max-w-xs leading-relaxed text-center text-aura">
          «{metrics.status === "сияешь" ? "Энергия на пике — день для глубоких практик." :
             metrics.status === "баланс" ? "Ровное состояние — поддерживай ритм." :
             "Напряжение выше нормы — попробуй дыхание."}»
        </p>

        {/* Sub-metrics */}
        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="flex flex-col items-center cursor-pointer" onClick={onOpenMetricsDetails}>
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/40">ВСР</span>
            <span className="text-lg font-display font-light text-white/80 mt-0.5">{metrics.hrv}</span>
            <span className="text-[7px] text-white/30 font-mono">мс</span>
          </div>
          <div className="w-px h-6 bg-white/8" />
          <div className="flex flex-col items-center cursor-pointer" onClick={onOpenMetricsDetails}>
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/40">Сон</span>
            <span className="text-lg font-display font-light text-white/80 mt-0.5">{metrics.sleepDuration}</span>
            <span className="text-[7px] text-white/30 font-mono">ч</span>
          </div>
          <div className="w-px h-6 bg-white/8" />
          <div className="flex flex-col items-center cursor-pointer" onClick={onOpenMetricsDetails}>
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/40">ЧСС</span>
            <span className="text-lg font-display font-light text-white/80 mt-0.5">{metrics.restingHeartRate}</span>
            <span className="text-[7px] text-white/30 font-mono">уд</span>
          </div>
        </div>

        {/* BLOCK 1: Ключевые факторы */}
        <div className="w-full mt-7 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-[1px] bg-white/12" />
            <span className="text-[8px] font-mono tracking-[0.25em] text-white/30 uppercase">Ключевые факторы</span>
          </div>
          {[
            {
              icon: "🛌",
              label: "Сон",
              normal: "8ч",
              current: `${metrics.sleepDuration}ч`,
              diff: (metrics.sleepDuration - 8).toFixed(1),
              unit: "ч",
              detail: metrics.sleepDuration >= 7 ? "Длительность в норме" : "Недосып",
              good: metrics.sleepDuration >= 7,
            },
            {
              icon: "❤️",
              label: "Восстановление",
              normal: "ВСР 60",
              current: `${metrics.hrv} мс`,
              diff: ((metrics.hrv - 60) / 60 * 100).toFixed(0),
              unit: "%",
              detail: metrics.hrv >= 60 ? "ВСР в зоне восстановления" : "ВСР снижен",
              good: metrics.hrv >= 60,
            },
            {
              icon: "⚡",
              label: "Стресс и энергия",
              normal: "стресс 40%",
              current: `${metrics.stressLevel}%`,
              diff: `${metrics.energyLevel}%`,
              unit: "энерг",
              detail: metrics.stressLevel <= 40 ? "Стресс под контролем" : "Повышенный стресс",
              good: metrics.stressLevel <= 40,
            },
          ].map((factor, idx) => (
            <div key={idx} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-white/[0.01] border border-white/[0.02]">
              <span className="text-sm flex-shrink-0 opacity-50">{factor.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-[11px] text-white/60 font-normal">{factor.label}</h4>
                  <span className={`text-[9px] font-mono whitespace-nowrap ${factor.good ? 'text-[#7BC47F]/50' : 'text-[#D4875E]/50'}`}>
                    {factor.good ? '✓ в норме' : '▼ отклонение'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-white/30">{factor.current}</span>
                  <span className="text-[7px] text-white/12">•</span>
                  <span className="text-[9px] text-white/20 font-editorial italic">{factor.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>



      {/* BLOCK 3: Быстрый вход — MoodWheel */}
      <div className="w-full space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-[1px] bg-white/12" />
            <span className="text-[8px] font-mono tracking-[0.25em] text-[#C9A96E]/80 uppercase">Быстрый вход</span>
          </div>
          <h3 className="text-lg font-display font-medium text-white/90 text-aura">Под настроение</h3>
        </div>
        <MoodWheel onLaunchRitual={onLaunchRitual} />
      </div>

      {/* BLOCK 4: Течение дня — day timeline with actual completed practices */}
      <TimelineBlock
        daySlots={daySlots}
        editingSlotId={editingSlotId}
        editTitle={editTitle}
        editTime={editTime}
        setEditTitle={setEditTitle}
        setEditTime={setEditTime}
        setEditingSlotId={setEditingSlotId}
        handleSaveSlot={handleSaveSlot}
        deleteSlot={deleteSlot}
        addNewSlot={addNewSlot}
        onLaunchRitual={onLaunchRitual}
      />

      {/* BLOCK 5: Влияние практик на здоровье */}
      <section className="w-full space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-[1px] bg-white/12" />
            <span className="text-[8px] font-mono tracking-[0.25em] text-[#C9A96E]/80 uppercase">Влияние практик</span>
          </div>
          <h3 className="text-lg font-display font-medium text-white/90 text-aura">Связь действий и состояния</h3>
          <p className="text-[10px] text-white/20 font-editorial italic">Как выполненные ритуалы повлияли на твои показатели</p>
        </div>
        <div className="space-y-3">
          {MOCK_PRACTICE_IMPACTS.map((impact) => {
            const hoursAgo = Math.floor((Date.now() - new Date(impact.date).getTime()) / 3600000);
            return (
              <div key={impact.ritualId + impact.date}
                className="rounded-xl border border-white/[0.02] p-3.5 bg-white/[0.01]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs text-white/80 font-normal">{impact.ritualTitle}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8px] font-mono tracking-wider text-white/15 uppercase">{impact.group}</span>
                      <span className="text-[6px] text-white/10">•</span>
                      <span className="text-[8px] font-mono text-white/12">{hoursAgo < 1 ? 'только что' : hoursAgo < 24 ? `${hoursAgo}ч назад` : 'вчера'}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-white/15" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {impact.effects.map((eff, i) => {
                    const isPositive = eff.change > 0 && eff.metric !== 'stressLevel';
                    const isPositiveEffect = eff.change > 0 ? (eff.metric === 'stressLevel' ? false : true) : (eff.metric === 'stressLevel');
                    return (
                      <span key={i}
                        className={`text-[8px] font-mono px-2 py-1 rounded-full ${isPositiveEffect ? 'bg-[#7BC47F]/8 text-[#7BC47F]/50' : 'bg-[#D4875E]/8 text-[#D4875E]/50'}`}>
                        {eff.change > 0 ? '▲' : '▼'} {eff.change > 0 ? '+' : ''}{eff.change} {eff.label.split(' ').slice(-2).join(' ')}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const GROUP_COLORS: Record<string, string> = {
  "Исток": "#C9A96E",
  "Тишина": "#8899AA",
  "Энергия": "#D4875E",
  "Ясность": "#8AB4C8",
};
const GROUP_ICONS: Record<string, string> = {
  "Исток": "✦",
  "Тишина": "◈",
  "Энергия": "◉",
  "Ясность": "◇",
};

interface TimelineBlockProps {
  daySlots: DayScheduleSlot[];
  editingSlotId: string | null;
  editTitle: string;
  editTime: string;
  setEditTitle: (v: string) => void;
  setEditTime: (v: string) => void;
  setEditingSlotId: (v: string | null) => void;
  handleSaveSlot: (id: string) => void;
  deleteSlot: (id: string) => void;
  addNewSlot: () => void;
  onLaunchRitual: (id: string, group: string) => void;
}

function TimelineBlock({
  daySlots, editingSlotId, editTitle, editTime,
  setEditTitle, setEditTime, setEditingSlotId,
  handleSaveSlot, deleteSlot, addNewSlot, onLaunchRitual,
}: TimelineBlockProps) {
  const nowMinutes = useMemo(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }, []);

  const events = useMemo(() => {
    return daySlots
      .map(s => {
        const [h, m] = s.time.split(':').map(Number);
        return {
          id: s.id,
          title: s.title,
          time: s.time,
          mins: h * 60 + m,
          type: 'planned' as const,
          ritualId: s.ritualId,
          color: s.color,
        };
      })
      .sort((a, b) => a.mins - b.mins);
  }, [daySlots]);

  const gapThreshold = 90;

  return (
    <section className="w-full space-y-5" id="block_timeline">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-[1px] bg-white/12" />
            <span className="text-[8px] font-mono tracking-[0.25em] text-[#C9A96E]/80 uppercase">Суточный Путь</span>
          </div>
          <h3 className="text-lg font-display font-medium text-white/90 text-aura">Течение дня</h3>
        </div>
        {daySlots.length < 5 && (
          <button onClick={addNewSlot}
            className="text-[9px] text-[#C9A96E]/50 hover:text-[#C9A96E]/80 font-mono tracking-wider transition-colors">+ Добавить</button>
        )}
      </div>
      <div className="relative pl-8">
        <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-white/[0.06] via-white/[0.15] to-white/[0.06]" />
        {events.map((ev, idx) => {
          const isEditing = editingSlotId === ev.id;
          const prevEvent = idx > 0 ? events[idx - 1] : null;
          const gapMinutes = prevEvent ? ev.mins - prevEvent.mins : 0;
          const isFuture = ev.mins > nowMinutes;
          const isMissed = ev.mins <= nowMinutes;

          return (
            <React.Fragment key={ev.id}>
              {gapMinutes > gapThreshold && (
                <div className="relative flex items-center py-3 select-none">
                  <div className="absolute -left-[27px] w-[3px] h-px bg-white/[0.03]" />
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
                    <span className="text-[7px] font-mono text-white/8 tracking-widest">
                      {gapMinutes >= 120 ? `${Math.floor(gapMinutes / 60)}ч` : ''} {gapMinutes % 60}мин тишины
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
                  </div>
                </div>
              )}

              {isEditing ? (
                <div className="relative flex items-start gap-3 py-2">
                  <div className="absolute -left-[23px] w-[3px] h-[3px] rounded-full mt-2 bg-white/20" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="text" value={editTime} onChange={(e) => setEditTime(e.target.value)}
                        className="bg-transparent text-[10px] font-mono text-[#C9A96E]/80 w-14 p-0 border-b border-white/[0.06] outline-none" />
                      <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-transparent text-xs text-white/70 flex-1 p-0 border-b border-white/[0.06] outline-none" placeholder="Название" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleSaveSlot(ev.id)}
                        className="text-[9px] text-[#C9A96E]/60 hover:text-[#C9A96E] font-mono">Сохранить</button>
                      <button onClick={() => deleteSlot(ev.id)}
                        className="text-[9px] text-rose-400/40 hover:text-rose-400 font-mono">Удалить</button>
                      <button onClick={() => setEditingSlotId(null)}
                        className="text-[9px] text-white/20 hover:text-white/40 font-mono">Отмена</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative flex items-start gap-3 py-2 group select-none">
                  <div className={`absolute -left-[23px] w-[3px] h-[3px] rounded-full mt-2 transition-all duration-300 ${
                    isFuture ? 'bg-white/20 group-hover:bg-white/30' : 'bg-white/6'
                  }`} />
                  <div className="flex-1 min-w-0" onClick={() => onLaunchRitual(ev.ritualId || '', 'Исток')}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono tracking-wide ${isFuture ? 'text-[#C9A96E]/80' : 'text-white/15'}`}>{ev.time}</span>
                      <span className={`text-[7px] font-mono uppercase tracking-widest ${isMissed ? 'text-rose-400/30' : 'text-white/10'}`}>
                        {isFuture ? 'ЗАПЛАНИРОВАНО' : 'ПРОПУЩЕНО'}
                      </span>
                    </div>
                    <h4 className={`text-sm font-sans font-normal mt-0.5 transition-colors ${
                      isFuture ? 'text-white/60 group-hover:text-white/80' : 'text-white/20 line-through'
                    }`}>{ev.title}</h4>
                  </div>
                  {isFuture && (
                    <button onClick={(e) => { e.stopPropagation(); setEditingSlotId(ev.id); setEditTitle(ev.title); setEditTime(ev.time); }}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white/40">
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
