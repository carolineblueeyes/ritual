import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Edit3, 
  Plus, 
  X,
  Waves,
  Sparkles,
  Flame,
  User,
  Heart,
  BookOpen,
  ArrowRight,
  Play,
  RotateCcw
} from 'lucide-react';
import { HealthState, Practice, ActivityLog, PracticeGroupType } from '../types';
import { ALL_PRACTICES, EDUCATIONAL_ARTICLES } from '../data';
import type { HealthData } from '../services/HealthService';

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
  onOpenArticle: (article: any) => void;
  isHealthConnected: boolean;
  isConnecting: boolean;
  isSyncing: boolean;
  onConnectHealth: () => void;
  realHealthData: HealthData | null;
  healthError: string | null;
  onDismissError: () => void;
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
  practiceLogs,
  onOpenArticle,
  isHealthConnected,
  isConnecting,
  isSyncing,
  onConnectHealth,
  realHealthData,
  healthError,
  onDismissError
}: TodayViewProps) {
  const [showBgSelector, setShowBgSelector] = useState(false);
  const [isPlayingWave, setIsPlayingWave] = useState(false);
  // isHealthConnected и isConnecting теперь приходят из App.tsx через пропсы

  // Scenarios quick triggers (Быстрый вход под настроение)
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

  const getHealthGradientStr = (state: HealthState) => {
    switch (state) {
      case 'Shining': return 'from-[#E6B85C]/90 via-[#7A9BBA]/80 to-[#A8D5E5]/90';
      case 'Balance': return 'from-[#34C759] to-[#2ecc71]';
      case 'Tension': return 'from-[#FF9F0A] to-[#f39c12]';
      case 'Overload': return 'from-[#FF453A] to-[#e74c3c]';
      default: return 'from-[#8E8E93] to-[#555]';
    }
  };

  const getHealthLabel = (state: HealthState) => {
    switch (state) {
      case 'Shining': return 'Сияешь';
      case 'Balance': return 'Балансируешь';
      case 'Tension': return 'Напряжение';
      case 'Overload': return 'Перегруз';
      default: return 'Покой';
    }
  };

  const getHealthLabelStatus = (state: HealthState) => {
    switch (state) {
      case 'Shining': return 'Идеальное сияние вегетатики';
      case 'Balance': return 'Парасимпатика в балансе';
      case 'Tension': return 'Накоплено вегетативное напряжение';
      case 'Overload': return 'Требуется немедленный покой';
      default: return 'Поиск ритма...';
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
    setDaySlots(daySlots.filter(s => s.id !== id));
  };

  const addNewSlot = () => {
    if (daySlots.length >= 6) return;
    const newId = daySlots.length > 0 ? Math.max(...daySlots.map(s => s.id)) + 1 : 1;
    setDaySlots([...daySlots, {
      id: newId,
      time: '18:00',
      title: 'Свободный интервал',
      practiceId: ''
    }]);
  };

  return (
    <div className="w-full flex flex-col space-y-8 pt-4 pb-28 relative px-4 select-none">
      
      {/* Top Header Row with airy minimal spacing */}
      <div className="flex justify-between items-center w-full px-2" id="header_row">
        <motion.button 
          whileTap={{ scale: 0.92 }}
          onClick={onOpenProfile}
          className="w-12 h-12 rounded-full border border-white/10 bg-white/5 active:scale-95 transition-all flex items-center justify-center pointer-events-auto"
          id="btn_profile"
        >
          <User className="text-white/80 w-5 h-5" />
        </motion.button>

        <div className="flex flex-col items-center" />

        <div className="relative">
          <motion.button 
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowBgSelector(!showBgSelector)}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/5 active:scale-95 transition-all flex items-center justify-center pointer-events-auto"
            id="btn_bg"
          >
            {background === 'water' && <Waves className="text-cyan-400 w-5 h-5 animate-pulse" />}
            {background === 'sky' && <Sparkles className="text-purple-400 w-5 h-5" />}
            {background === 'aurora' && <Flame className="text-amber-500 w-5 h-5" />}
          </motion.button>

          <AnimatePresence>
            {showBgSelector && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-3 p-2 bg-[#090b14ef] border border-white/10 rounded-2xl flex flex-col space-y-1.5 w-44 z-30 backdrop-blur-3xl shadow-2xl"
              >
                <div className="text-[10px] text-white/30 uppercase font-mono tracking-wider p-2 text-center border-b border-white/5">Ритмическое поле</div>
                <button 
                  onClick={() => { onChangeBg('water'); setShowBgSelector(false); }}
                  className={`flex items-center space-x-2.5 p-2 rounded-xl text-xs transition-all ${background === 'water' ? 'bg-white/10 text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                  <Waves className="w-4 h-4 text-cyan-400" />
                  <span>Живая Вода</span>
                </button>
                <button 
                  onClick={() => { onChangeBg('sky'); setShowBgSelector(false); }}
                  className={`flex items-center space-x-2.5 p-2 rounded-xl text-xs transition-all ${background === 'sky' ? 'bg-white/10 text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Канал Неба</span>
                </button>
                <button 
                  onClick={() => { onChangeBg('aurora'); setShowBgSelector(false); }}
                  className={`flex items-center space-x-2.5 p-2 rounded-xl text-xs transition-all ${background === 'aurora' ? 'bg-white/10 text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                >
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Сияние Аврора</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Block 1: OURA RING STYLE READINESS BLOCK */}
      <div className="w-full flex flex-col space-y-3" id="block_my_wave">
        <div className="bg-gradient-to-b from-white/[0.06] to-transparent p-[1px] rounded-[36px]">
          <div className="bg-[#070913f0] border border-white/[0.06] backdrop-blur-3xl rounded-[35px] p-6.5 flex flex-col items-center justify-between relative overflow-hidden shadow-2xl h-[330px]">
            
            {/* Elegant premium background depth light glow */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full filter blur-[60px] opacity-25 bg-gradient-to-br ${getHealthGradientStr(healthState)}`} />
            </div>

            {!isHealthConnected ? (
              /* Disconnected / Connect state wrapper */
              <div className="w-full h-full flex flex-col justify-between z-10 relative">
                
                {/* Header */}
                <div className="w-full flex justify-between items-center">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-white/40">Индекс состояния</span>
                    <span className="text-xs font-semibold text-white/80">Оценка Readiness</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Требуется связь</span>
                  </div>
                </div>

                {/* Main Body */}
                <div className="flex flex-col items-center justify-center text-center px-4 my-auto">
                  {isConnecting ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <motion.div 
                          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 rounded-full border border-[#E6B85C]/35"
                        />
                        <motion.div 
                          animate={{ scale: [1.2, 2.2, 1.2], opacity: [0.15, 0, 0.15] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
                          className="absolute inset-0 rounded-full border border-emerald-500/20"
                        />
                        <div className="w-10 h-10 rounded-full bg-[#05060d] border border-white/15 flex items-center justify-center shadow-lg">
                          <RotateCcw className="w-4 h-4 text-[#E6B85C] animate-spin-slow" />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs font-mono font-bold text-white/90 animate-pulse">Синхронизация биометрии...</span>
                        <span className="text-[10px] text-white/40">Подключение к сенсорам Oura & Health Kit</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3.5">
                      <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shadow-inner">
                        <Heart className="w-5 h-5 text-red-500/60 animate-pulse" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs font-semibold text-white/90">Показатели недоступны</span>
                        <p className="text-[11px] text-white/45 max-w-[250px] leading-relaxed">
                          Показатели ЧСС покоя, качества сна и ВСР доступны только при синхронизации с вашим кольцом или Apple Health.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error message */}
                {healthError && (
                  <div className="w-full bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3 text-[11px] text-rose-300 leading-relaxed flex items-start space-x-2">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span className="flex-1">{healthError}</span>
                    <button onClick={onDismissError} className="text-rose-400/60 hover:text-rose-300">&times;</button>
                  </div>
                )}

                {/* Footer Connect Button */}
                {!isConnecting && (
                  <div className="w-full">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={onConnectHealth}
                      className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#E6B85C]/90 to-emerald-500/90 text-slate-950 text-xs font-bold font-sans shadow-lg shadow-emerald-500/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 animate-pulse"
                    >
                      <span>⚡ Интегрировать данные Oura / Health</span>
                    </motion.button>
                  </div>
                )}

              </div>
            ) : (
              /* Connected / Live Oura dashboard view */
              <div className="w-full h-full flex flex-col justify-between z-10 relative">
                
                {/* Title / Metric state header */}
                <div className="w-full flex justify-between items-center">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-white/40">Индекс состояния</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      whileTap={{ scale: 0.95 }}
                      onClick={onOpenHealthDetail}
                      className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-[#34C759] cursor-pointer flex items-center space-x-1 hover:bg-emerald-500/15"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                      <span>Оптимально</span>
                    </motion.div>
                  </div>
                </div>

                {/* Glowing SVG circular gauge in the center */}
                <div className="relative flex flex-col items-center justify-center -translate-y-1 my-auto">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* SVG Progress Ring */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="48"
                        className="stroke-white/[0.04]"
                        strokeWidth="7"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="48"
                        initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 48 - (healthScore / 100) * (2 * Math.PI * 48) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        stroke={`url(#healthGrad)`}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#E6B85C" />
                          <stop offset="50%" stopColor="#34C759" />
                          <stop offset="100%" stopColor="#A8D5E5" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Syncing overlay */}
                    {isSyncing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070913]/70 backdrop-blur-sm rounded-full z-10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                          className="w-8 h-8 border-2 border-[#E6B85C] border-t-transparent rounded-full mb-1"
                        />
                        <span className="text-[8px] font-mono text-[#E6B85C] animate-pulse">Обновление</span>
                      </div>
                    )}

                    {/* Score Number in center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[34px] font-sans font-bold text-white tracking-tight leading-none"
                      >
                        {healthScore}
                      </motion.span>
                      <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest font-semibold mt-0.5">из 100</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mt-2.5">
                    <span className="text-sm font-semibold text-white/95 leading-none">
                      {getHealthLabel(healthState)}
                    </span>
                    <span className="text-[11px] text-white/40 font-mono mt-1">
                      Система считывания вегетатики
                    </span>
                  </div>
                </div>

                {/* Interactive Grid: 3 critical Oura biometrics */}
                <div className="w-full grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3 z-10">
                  {[
                    { label: 'ВСР', value: realHealthData ? `${Math.round(realHealthData.hrv)} ms` : '—', color: '#34C759' },
                    { label: 'СОН', value: realHealthData ? `${Math.floor(realHealthData.sleepHours)}ч ${Math.round((realHealthData.sleepHours % 1) * 60)}м` : '—', color: '#FF9F0A' },
                    { label: 'ЧСС покоя', value: realHealthData ? `${Math.round(realHealthData.heartRate)} уд` : '—', color: '#34C759' }
                  ].map((item) => (
                    <div
                      key={item.label}
                      onClick={onOpenHealthDetail}
                      className="flex flex-col items-center text-center cursor-pointer hover:bg-white/5 py-1 rounded-xl transition-all"
                    >
                      <span className="text-[9px] uppercase tracking-wider font-mono text-white/30">{item.label}</span>
                      <span className="text-xs font-semibold text-white/90 mt-0.5 font-mono">{item.value}</span>
                      <div className="w-6 h-[2px] rounded-full mt-1.5" style={{ backgroundColor: item.color, opacity: 0.8 }} />
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* Block 2: Quick recommendation alert */}
      <div className="w-full" id="recommended_pills_small">
        <motion.div 
          onClick={() => onStartPractice(recommendedPractice)}
          whileTap={{ scale: 0.98 }}
          className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400/20 to-transparent flex items-center justify-center shrink-0 border border-amber-400/20">
              <RotateCcw className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/30 uppercase font-mono tracking-wider">Подведомственный сеанс:</span>
              <span className="text-sm font-semibold text-white/90">{recommendedPractice.name}</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white" />
        </motion.div>
      </div>

      {/* Block 3: Быстрый старт под настроение (scenarios pills with airy spacing) */}
      <div className="w-full flex flex-col space-y-3.5" id="block_scenarios">
        <span className="text-white/40 text-[13px] font-sans font-semibold tracking-wider uppercase px-2">
          Быстрый вход под настроение
        </span>

        <div className="grid grid-cols-2 gap-2.5" id="scenarios_pills">
          {SCENARIOS.map((scen) => (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              key={scen.id}
              onClick={() => {
                const matched = ALL_PRACTICES.find(p => 
                  p.name.toLowerCase().includes(scen.query) || 
                  p.category.toLowerCase().includes(scen.query)
                );
                if (matched) {
                  onStartPractice(matched);
                } else {
                  onStartPractice(ALL_PRACTICES[2]); // default box-breathing
                }
              }}
              className="p-4 bg-slate-950/20 border border-white/[0.05] rounded-[22px] text-[14px] text-white/85 hover:bg-white/[0.04] active:scale-95 transition-all text-left font-sans flex justify-between items-center cursor-pointer shadow-md"
            >
              <span className="font-semibold">{scen.label}</span>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Block 4: Течение дня (Timeline) */}
      <div className="w-full flex flex-col space-y-4" id="block_timeline">
        <div className="flex justify-between items-center px-2">
          <span className="text-white/40 text-[13px] font-sans font-semibold tracking-wider uppercase">
            Течение дня
          </span>
          {daySlots.length < 5 && (
            <button 
              onClick={addNewSlot}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 active:scale-90 transition-all"
              title="Добавить слот"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        <div className="flex flex-col space-y-5 relative before:absolute before:top-2 before:bottom-2 before:left-[21px] before:w-[1px] before:bg-white/10">
          {daySlots.map((slot) => {
            const isEditing = editingSlotId === slot.id;
            return (
              <div 
                key={slot.id}
                className="flex items-center space-x-4 relative group"
              >
                {/* Timeline node */}
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#090b14]/90 border border-white/10 z-10 shrink-0 text-white/50 text-[11px] font-mono font-medium shadow-md">
                  {slot.time}
                </div>

                {/* Timeline content glass slot card */}
                <div className="flex-1 bg-white/[0.015] border border-white/[0.05] rounded-[22px] p-4 flex items-center justify-between hover:bg-white/[0.04] transition-all">
                  {isEditing ? (
                    <div className="flex flex-col space-y-2.5 w-full">
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          value={editTime}
                          onChange={(e) => setEditingTime(e.target.value)}
                          className="bg-black/40 text-white font-mono text-xs px-2 py-1.5 rounded-lg border border-white/10 w-16" 
                          placeholder="08:00"
                        />
                        <input 
                          type="text" 
                          value={editTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="bg-black/40 text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/10 flex-1" 
                          placeholder="Название практики"
                        />
                      </div>
                      <div className="flex justify-end space-x-2 pt-1">
                        <button 
                          onClick={() => deleteSlot(slot.id)}
                          className="text-xs text-rose-400 hover:text-rose-350 font-mono py-1 px-2.5"
                        >
                          Удалить
                        </button>
                        <button 
                          onClick={() => handleSaveSlot(slot.id)}
                          className="text-xs text-green-400 hover:text-green-350 font-mono py-1 px-2.5"
                        >
                          Сохранить
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-white/90 text-sm font-semibold">{slot.title}</span>
                        <span className="text-[12px] text-white/30 font-mono">
                          {slot.practiceId ? 'Запланировано' : 'Свободный интервал'}
                        </span>
                      </div>
                      <div className="flex space-x-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            const matched = ALL_PRACTICES.find(p => p.id === slot.practiceId || p.name.includes(slot.title));
                            if (matched) {
                              onStartPractice(matched);
                            } else {
                              onStartPractice(ALL_PRACTICES[2]); // default box-breathing
                            }
                          }}
                          className="p-1 px-3 rounded-xl bg-white/10 text-[11px] font-semibold text-white/90 hover:bg-white/20"
                        >
                          {slot.practiceId ? 'Запустить' : '+'}
                        </button>
                        <button 
                          onClick={() => {
                            setEditingSlotId(slot.id);
                            setEditingTitle(slot.title);
                            setEditingTime(slot.time);
                          }}
                          className="p-1.5 rounded-xl hover:bg-white/10 text-white/40 hover:text-white"
                          title="Редактировать"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
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

      {/* Block 5: Полезное чтение (Horizontal scroll) */}
      <div className="flex flex-col space-y-3.5" id="block_today_useful_read">
        <span className="text-white/40 text-[13px] font-sans font-semibold tracking-wider uppercase px-2">
          Полезное чтение
        </span>

        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-none px-2 snap-x">
          {EDUCATIONAL_ARTICLES.map((art) => (
            <motion.div 
              whileTap={{ scale: 0.98 }}
              key={art.id}
              onClick={() => onOpenArticle(art)}
              className="shrink-0 w-[240px] snap-start p-5 rounded-[26px] bg-slate-950/20 border border-white/[0.05] hover:bg-white/[0.03] transition-all flex flex-col justify-between h-[150px] cursor-pointer shadow-lg"
            >
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider font-semibold">Материал</span>
                <h4 className="text-[15px] font-bold text-white/95 line-clamp-1 leading-snug">{art.title}</h4>
              </div>
              <p className="text-[12px] text-white/50 line-clamp-2 leading-relaxed">
                {art.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
