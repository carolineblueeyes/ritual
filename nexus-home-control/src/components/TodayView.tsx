import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  MapPin, 
  Activity, 
  Settings, 
  Check, 
  HelpCircle, 
  TrendingUp, 
  Moon, 
  Battery, 
  Droplet, 
  User, 
  ChevronRight, 
  Edit3, 
  Plus, 
  X,
  Footprints,
  Waves,
  Sparkles,
  Flame,
  UserCheck
} from 'lucide-react';
import { HealthState, Practice, ActivityLog, PracticeGroupType } from '../types';
import { ALL_PRACTICES } from '../data';

interface TodayViewProps {
  healthState: HealthState;
  healthScore: number;
  userName: string;
  isPlus: boolean;
  onOpenProfile: () => void;
  onOpenPlus: () => void;
  onOpenHealthDetail: () => void;
  onStartPractice: (practice: Practice) => void;
  background: 'water' | 'sky' | 'aurora';
  onChangeBg: (bg: 'water' | 'sky' | 'aurora') => void;
  recommendedPractice: Practice;
  setRecommendedPractice: (p: Practice) => void;
  practiceLogs: ActivityLog[];
}

export default function TodayView({
  healthState,
  healthScore,
  userName,
  isPlus,
  onOpenProfile,
  onOpenPlus,
  onOpenHealthDetail,
  onStartPractice,
  background,
  onChangeBg,
  recommendedPractice,
  setRecommendedPractice,
  practiceLogs
}: TodayViewProps) {
  // Bg selector visibility
  const [showBgSelector, setShowBgSelector] = useState(false);
  const [hapticRipple, setHapticRipple] = useState<string | null>(null);

  // Scenarios quick triggers (Быстрый вход)
  const SCENARIOS = [
    { id: 'morning', label: '☀️ Начать день', query: 'код' },
    { id: 'important', label: '🎤 Перед важным моментом', query: 'вздох' },
    { id: 'calm', label: '😰 Успокоиться', query: 'сброс' },
    { id: 'focus_mind', label: '🧠 Сосредоточиться', query: 'фокус' },
    { id: 'recover', label: '😴 Восстановиться', query: 'сканирование' },
    { id: 'evening', label: '🌙 Закончить день', query: 'дневник' }
  ];

  // Timeline slots state
  const [daySlots, setDaySlots] = useState([
    { id: 1, time: '08:00', title: 'Утреннее намерение', practiceId: 'day-code' },
    { id: 2, time: '12:30', title: 'Фокус внимания Pomodoro', practiceId: 'goal-map' },
    { id: 3, time: '16:30', title: 'Осознанное движение', practiceId: 'energy-release' },
    { id: 4, time: '20:30', title: 'Сканирование отпускания', practiceId: 'scan-letgo' }
  ]);

  const [editingSlotId, setEditingSlotId] = useState<number | null>(null);
  const [editTitle, setEditingTitle] = useState('');
  const [editTime, setEditingTime] = useState('');

  // Handle fake haptic simulation feedback on clicking the state card
  const handleStateBlockClick = () => {
    let mode = 'peaceful';
    if (healthState === 'Balance') mode = 'vibe-calm';
    if (healthState === 'Tension') mode = 'vibe-tension';
    if (healthState === 'Overload') mode = 'vibe-overload';
    if (healthState === 'Shining') mode = 'vibe-shiny';

    setHapticRipple(mode);
    setTimeout(() => {
      setHapticRipple(null);
    }, 850);
  };

  const getHealthColorStr = (state: HealthState) => {
    switch (state) {
      case 'Shining': return 'from-amber-400 via-purple-400 via-orange-400 to-cyan-400';
      case 'Balance': return 'from-emerald-400 to-green-600';
      case 'Tension': return 'from-amber-400 to-yellow-600';
      case 'Overload': return 'from-rose-400 to-coral-600';
      default: return 'from-gray-400 to-slate-600';
    }
  };

  const getGroupColorStr = (group: PracticeGroupType) => {
    switch (group) {
      case 'Исток': return 'text-[#E6B85C] border-[#E6B85C]/30 bg-[#E6B85C]/10';
      case 'Тишина': return 'text-[#7A9BBA] border-[#7A9BBA]/30 bg-[#7A9BBA]/10';
      case 'Энергия': return 'text-[#E67E22] border-[#E67E22]/30 bg-[#E67E22]/10';
      case 'Ясность': return 'text-[#A8D5E5] border-[#A8D5E5]/30 bg-[#A8D5E5]/10';
    }
  };

  const getHealthLabel = (state: HealthState) => {
    switch (state) {
      case 'Shining': return 'Сияешь';
      case 'Balance': return 'Баланс';
      case 'Tension': return 'Напряжение';
      case 'Overload': return 'Перегруз';
      default: return 'Регенерация';
    }
  };

  const getHealthDescription = (state: HealthState) => {
    switch (state) {
      case 'Shining': return 'Ты полностью восстановлен и в пиковом внимании.';
      case 'Balance': return 'Организм стабилен и спокоен. Всё идёт хорошо.';
      case 'Tension': return 'Накоплен дефицит сна или стресс. Пора сделать паузу.';
      case 'Overload': return 'Предел истощения. Телу необходимо бережное восстановление.';
      default: return 'Датчики считывают твой исходный фон.';
    }
  };

  const handleSaveSlot = (id: number) => {
    setDaySlots(daySlots.map(slot => {
      if (slot.id === id) {
        return { ...slot, title: editTitle, time: editTime };
      }
      return slot;
    }));
    setEditingSlotId(null);
  };

  const deleteSlot = (id: number) => {
    if (daySlots.length <= 3) return; // limit min 3
    setDaySlots(daySlots.filter(s => s.id !== id));
  };

  const addNewSlot = () => {
    if (daySlots.length >= 5) return; // limit max 5
    const newId = daySlots.length > 0 ? Math.max(...daySlots.map(s => s.id)) + 1 : 1;
    setDaySlots([...daySlots, {
      id: newId,
      time: '18:00',
      title: 'Новый ритуал',
      practiceId: 'resisted-breath'
    }]);
  };

  return (
    <div className="w-full flex flex-col space-y-6 pt-4 pb-20 relative px-4">
      {/* Top Header Row */}
      <div className="flex justify-between items-center w-full px-2" id="header_row">
        <button 
          onClick={onOpenProfile}
          className="w-11 h-11 rounded-full border border-white/20 bg-white/5 active:scale-95 transition-transform flex items-center justify-center pointer-events-auto"
          id="btn_profile"
        >
          <User className="text-white/80 w-5 h-5" />
        </button>

        <h1 className="text-base tracking-widest uppercase font-mono text-white/50 select-none">
          R I T U A L
        </h1>

        <div className="relative">
          <button 
            onClick={() => setShowBgSelector(!showBgSelector)}
            className="w-11 h-11 rounded-full border border-white/20 bg-white/5 active:scale-95 transition-transform flex items-center justify-center pointer-events-auto"
            id="btn_bg"
          >
            {background === 'water' && <Waves className="text-white/80 w-5 h-5 animate-pulse" />}
            {background === 'sky' && <Sparkles className="text-white/80 w-5 h-5" />}
            {background === 'aurora' && <FlameIcon className="text-white w-5 h-5 animate-spin duration-100w" />}
          </button>

          <AnimatePresence>
            {showBgSelector && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute right-0 mt-3 p-2 bg-[#090b14]/90 border border-white/10 rounded-2xl flex flex-col space-y-2 w-40 z-30 backdrop-blur-xl"
              >
                <div className="text-[10px] text-white/40 uppercase font-mono tracking-wider p-1 text-center">Пространство</div>
                <button 
                  onClick={() => { onChangeBg('water'); setShowBgSelector(false); }}
                  className={`flex items-center space-x-2 p-1.5 rounded-lg text-xs transition ${background === 'water' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:text-white'}`}
                >
                  <Waves className="w-4 h-4 text-cyan-400" />
                  <span>Живая Вода</span>
                </button>
                <button 
                  onClick={() => { onChangeBg('sky'); setShowBgSelector(false); }}
                  className={`flex items-center space-x-2 p-1.5 rounded-lg text-xs transition ${background === 'sky' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:text-white'}`}
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Канал Неба</span>
                </button>
                <button 
                  onClick={() => { onChangeBg('aurora'); setShowBgSelector(false); }}
                  className={`flex items-center space-x-2 p-1.5 rounded-lg text-xs transition ${background === 'aurora' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:text-white'}`}
                >
                  <FlameIcon className="w-4 h-4 text-amber-400" />
                  <span>Сияние Аврора</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Block 1: State Visual (Сияние) */}
      <div 
        onClick={handleStateBlockClick}
        className="w-full relative mt-2 select-none overflow-hidden"
        id="block_shining"
      >
        <div className="cursor-pointer bg-white/[0.03] active:bg-white/[0.06] border border-white/[0.08] backdrop-blur-md rounded-[32px] p-6 flex flex-col relative transition-all duration-300">
          
          {/* Simulated Haptic/Visual vibration element */}
          {hapticRipple && (
            <motion.div 
              initial={{ opacity: 0.8, scale: 0.95 }}
              animate={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`absolute inset-0 rounded-[32px] border-2 pointer-events-none z-10 ${
                hapticRipple === 'vibe-calm' ? 'border-green-500' :
                hapticRipple === 'vibe-tension' ? 'border-amber-400' :
                hapticRipple === 'vibe-overload' ? 'border-rose-500' :
                'border-amber-300'
              }`}
            />
          )}

          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1">
                Состояние духа
              </span>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold bg-gradient-to-r ${getHealthColorStr(healthState)} bg-clip-text text-transparent`}>
                  {getHealthLabel(healthState)}
                </span>
                <span className="text-sm bg-white/10 text-white/90 px-2.5 py-0.5 rounded-full font-mono">
                  {healthScore}/100
                </span>
              </div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onOpenHealthDetail();
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 active:scale-90 border border-white/10 text-white/50 hover:text-white transition"
              title="Статистика здоровья"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-3 text-white/70 text-sm leading-relaxed">
            {getHealthDescription(healthState)}
          </p>

          {/* Shimmering health bar trail */}
          <div className="mt-5 w-full h-[6px] bg-white/10 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${healthScore}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r from-teal-400 to-[#E6B85C]`}
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onOpenHealthDetail();
              }}
              className="text-xs text-[#E6B85C] hover:underline font-mono py-1"
            >
              Что повлияло на твое сияние?
            </button>
            <span className="text-[10px] font-mono text-white/30">Твой ритм под контролем</span>
          </div>
        </div>
      </div>

      {/* Block 2: Recommended glass-card Practice */}
      <div className="w-full flex flex-col space-y-2" id="block_recommendation">
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest px-2">
          Рекомендация ИИ сейчас
        </span>

        <div className="bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 backdrop-blur-xl rounded-[32px] p-6 relative transition-all overflow-hidden">
          {/* Accent glow on top header of card representing current group */}
          <div className="absolute top-0 right-12 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-transparent blur-2xl pointer-events-none" />

          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-2">
              <span className={`text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full border self-start ${getGroupColorStr(recommendedPractice.group)}`}>
                Группа {recommendedPractice.group}
              </span>
              <h3 className="text-xl font-medium text-white/90">
                {recommendedPractice.name}
              </h3>
            </div>
            <div className="text-xs font-mono text-white/50 bg-white/5 px-2.5 py-1 rounded-lg">
              {recommendedPractice.duration} мин
            </div>
          </div>

          <p className="mt-3 text-sm text-white/60 leading-relaxed font-sans">
            Индивидуальная практика, подобранная на основе твоего состояния ({healthState}). Поможет сбалансировать мысли и восстановить опору.
          </p>

          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => onStartPractice(recommendedPractice)}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-[#E6B85C] hover:opacity-90 active:scale-95 transition text-black font-semibold text-sm shadow-lg shadow-amber-500/20 pointer-events-auto"
            >
              Запустить ритуал
            </button>

            <span className="text-[11px] text-white/40 font-mono italic">
              Нейробиологическая база
            </span>
          </div>
        </div>
      </div>

      {/* Block 4: Scenarios Быстрый вход pills */}
      <div className="w-full flex flex-col space-y-3 pt-2" id="block_scenarios">
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest px-2">
          Быстрый вход под настроение
        </span>

        <div className="grid grid-cols-2 gap-2" id="scenarios_pills">
          {SCENARIOS.map((scen) => (
            <button 
              key={scen.id}
              onClick={() => {
                const matched = ALL_PRACTICES.find(p => 
                  p.name.toLowerCase().includes(scen.query) || 
                  p.category.toLowerCase().includes(scen.query)
                );
                if (matched) {
                  onStartPractice(matched);
                } else {
                  onStartPractice(ALL_PRACTICES[2]); // box-breathing
                }
              }}
              className="p-3.5 bg-white/[0.03] border border-white/[0.07] rounded-xl text-xs text-white/80 active:scale-95 transition text-left font-sans flex justify-between items-center hover:bg-white/[0.06] cursor-pointer"
            >
              <span>{scen.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            </button>
          ))}
        </div>
      </div>

      {/* Block 3: Daily Program / Flow */}
      <div className="w-full flex flex-col space-y-3" id="block_timeline">
        <div className="flex justify-between items-center px-2">
          <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
            Течение дня
          </span>
          <div className="flex space-x-2">
            {daySlots.length < 5 && (
              <button 
                onClick={addNewSlot}
                className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-white/60 hover:text-white"
                title="Добавить слот"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-[21px] before:w-[1px] before:bg-white/10">
          {daySlots.map((slot) => {
            const isEditing = editingSlotId === slot.id;
            return (
              <div 
                key={slot.id}
                className="flex items-center space-x-4 relative group"
              >
                {/* Timeline node */}
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 z-10 shrink-0 text-white/40 text-[10px] font-mono">
                  {slot.time}
                </div>

                {/* Timeline content glass slot card */}
                <div className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.04] transition">
                  {isEditing ? (
                    <div className="flex flex-col space-y-2 w-full">
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          value={editTime}
                          onChange={(e) => setEditingTime(e.target.value)}
                          className="bg-black/30 text-white font-mono text-xs px-2 py-1 rounded border border-white/10 w-16" 
                          placeholder="08:00"
                        />
                        <input 
                          type="text" 
                          value={editTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="bg-black/30 text-white text-xs px-2 py-1 rounded border border-white/10 flex-1" 
                          placeholder="Название практики"
                        />
                      </div>
                      <div className="flex justify-end space-x-2 pt-1">
                        <button 
                          onClick={() => deleteSlot(slot.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 font-mono py-1 px-2"
                        >
                          Удалить
                        </button>
                        <button 
                          onClick={() => handleSaveSlot(slot.id)}
                          className="text-xs text-green-400 hover:text-green-300 font-mono py-1 px-2"
                        >
                          Сохранить
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <span className="text-white/80 text-sm font-medium">{slot.title}</span>
                        <span className="text-[10px] text-white/30 font-mono tracking-wide">Запланировано</span>
                      </div>
                      <div className="flex space-x-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            const matched = ALL_PRACTICES.find(p => p.id === slot.practiceId || p.name.includes(slot.title));
                            if (matched) {
                              onStartPractice(matched);
                            } else {
                              // start arbitrary breathing
                              onStartPractice(ALL_PRACTICES[2]);
                            }
                          }}
                          className="p-1 px-2 rounded-lg bg-white/5 text-[10px] text-white/80 hover:bg-white/15"
                        >
                          Старт
                        </button>
                        <button 
                          onClick={() => {
                            setEditingSlotId(slot.id);
                            setEditingTitle(slot.title);
                            setEditingTime(slot.time);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
                          title="Редактировать"
                        >
                          <Edit3 className="w-3.5 h-3.5" style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Minimal flame icon fallback
function FlameIcon(props: any) {
  return <Flame {...props} />;
}
