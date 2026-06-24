import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  MapPin, 
  HelpCircle, 
  Activity, 
  Check, 
  ChevronRight, 
  TrendingUp, 
  Settings, 
  Shield, 
  BookOpen, 
  Cpu, 
  Sparkles,
  Zap,
  Waves,
  Eye,
  Heart,
  Share2,
  Lock,
  Plus
} from 'lucide-react';
import { Achievement, Article, UserStats, HealthState } from '../types';
import { INITIAL_ACHIEVEMENTS, EDUCATIONAL_ARTICLES } from '../data';

interface ProgressViewProps {
  stats: UserStats;
  achievements: Achievement[];
  healthState: HealthState;
  onOpenPlus: () => void;
  onOpenStore: () => void;
}

export default function ProgressView({
  stats,
  achievements,
  healthState,
  onOpenPlus,
  onOpenStore
}: ProgressViewProps) {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState<Achievement | null>(null);
  const [selectedGoalCount, setSelectedGoalCount] = useState(5);
  const [currentGoalProgress, setCurrentGoalCount] = useState(3);
  
  // Rotating 3D crystal drag state
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotYAngle] = useState(-15);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotY(prev => prev + dx * 0.4);
    setRotYAngle(prev => Math.max(-60, Math.min(60, prev - dy * 0.4)));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;
    setRotY(prev => prev + dx * 0.5);
    setRotYAngle(prev => Math.max(-60, Math.min(60, prev - dy * 0.5)));
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  // Determine crystal appearance stage based on completed count
  const getCrystalStage = () => {
    const total = stats.ritualsCompleted;
    if (total === 0) return 'fog';
    if (total > 0 && total < 3) return 'spark';
    if (total >= 3 && total < 7) return 'rough';
    if (total >= 7 && total < 15) return 'lavender';
    if (total >= 15 && total < 30) return 'fiery';
    return 'prism';
  };

  const getStageTitle = (stage: string) => {
    switch (stage) {
      case 'fog': return 'Состояние: Густой Туман';
      case 'spark': return 'Рождение: Искра в тумане';
      case 'rough': return 'Проявление: Кристалл Истока';
      case 'lavender': return 'Сияние Тишины';
      case 'fiery': return 'Искры Энергии';
      case 'prism': return 'Спектр Ясности';
      default: return 'Кристалл';
    }
  };

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case 'fog': return 'Твой внутренний мир скрыт под шумом. Начни Путь Внимания, чтобы рассеять дымку.';
      case 'spark': return 'Первый ритуал зажег искру. Она мягко греет твое внимание в тумане.';
      case 'rough': return 'Поздравляем! Базовые грани кристалла очищены и сияют золотом Исходного Света.';
      case 'lavender': return 'Тишина наполнила глубину кристалла лавандовым свечением покоя.';
      case 'fiery': return 'Огненные контуры воли пробегают по граням пробужденной энергии сердца.';
      case 'prism': return 'Совершенный спектральный алмаз. Преломляет чистый радужный свет ясности разума.';
    }
  };

  // Render SVG polygon wireframe depending on crystal stage
  const renderCrystalSVG = (stage: string) => {
    // Stage colors defining overall accent
    let strokeColor = 'rgba(255,255,255,0.15)';
    let glows = 'rgba(255,255,255,0.05)';
    let pointsColor = '#ffffff';

    if (stage === 'spark') {
      strokeColor = 'rgba(230,184,92,0.18)';
      glows = 'rgba(230,184,92,0.15)';
      pointsColor = '#E6B85C';
    } else if (stage === 'rough') {
      strokeColor = 'rgba(230,184,92,0.45)';
      glows = 'rgba(230,184,92,0.2)';
      pointsColor = '#E6B85C';
    } else if (stage === 'lavender') {
      strokeColor = 'rgba(122,155,186,0.6)';
      glows = 'rgba(122,155,186,0.35)';
      pointsColor = '#7A9BBA';
    } else if (stage === 'fiery') {
      strokeColor = 'rgba(230,126,34,0.75)';
      glows = 'rgba(230,126,34,0.4)';
      pointsColor = '#E67E22';
    } else if (stage === 'prism') {
      strokeColor = 'rgba(168,213,229,0.85)';
      glows = 'rgba(168,213,229,0.5)';
      pointsColor = '#A8D5E5';
    }

    if (stage === 'fog') {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.45, 0.3] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="w-48 h-48 rounded-full bg-slate-500/20 blur-3xl"
          />
          <div className="text-white/20 select-none text-xs font-mono text-center max-w-[200px] leading-relaxed">
            Туман клубится.<br/>Сделай первую практику,<br/>чтобы привлечь искру
          </div>
        </div>
      );
    }

    if (stage === 'spark') {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.85, 0.4] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full bg-[#E6B85C]/60 blur-xl absolute"
          />
          <motion.div 
            animate={{ scale: [0.8, 1.1, 0.8] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-2.5 h-2.5 bg-[#E6B85C] rounded-full shadow-[0_0_15px_#E6B85C]"
          />
        </div>
      );
    }

    return (
      <div 
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transformStyle: "preserve-3d",
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
        className="flex items-center justify-center duration-75"
      >
        {/* Glow ball inside */}
        <div 
          style={{ transform: "translateZ(0px)", backgroundColor: glows, filter: 'blur(30px)' }}
          className="absolute w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all"
        />

        {/* SVG wireframe representing octahedron crystal */}
        <svg viewBox="0 0 100 100" className="w-[180px] h-[180px] absolute z-10 overflow-visible">
          {/* Bottom points to top points path segments for standard diamond style */}
          <polygon points="50,15 20,45 50,45" fill="none" stroke={strokeColor} strokeWidth="1" />
          <polygon points="50,15 80,45 50,45" fill="none" stroke={strokeColor} strokeWidth="1" />
          <polygon points="50,85 20,45 50,45" fill="none" stroke={strokeColor} strokeWidth="1" />
          <polygon points="50,85 80,45 50,45" fill="none" stroke={strokeColor} strokeWidth="1" />
          <polygon points="50,15 42,45 50,85" fill="none" stroke={strokeColor} strokeWidth="1.2" />
          <polygon points="53,15 58,45 53,85" fill="none" stroke={strokeColor} strokeWidth="1.2" />

          {/* Special spark lines for energetic stage */}
          {stage === 'fiery' && (
            <>
              <motion.line x1="50" y1="15" x2="35" y2="30" stroke="#E67E22" strokeWidth="1.5" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <motion.line x1="50" y1="85" x2="65" y2="65" stroke="#E67E22" strokeWidth="1.5" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
            </>
          )}

          {/* Refraction spectrum prism color glow rays */}
          {stage === 'prism' && (
            <g opacity="0.3">
              <polygon points="50,15 42,45 50,45" fill="url(#prismGrad1)" />
              <polygon points="50,15 50,45 80,45" fill="url(#prismGrad2)" />
              <defs>
                <linearGradient id="prismGrad1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fc8181" />
                  <stop offset="50%" stopColor="#f6e05e" />
                  <stop offset="100%" stopColor="#4fd1c5" />
                </linearGradient>
                <linearGradient id="prismGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#63b3ed" />
                  <stop offset="100%" stopColor="#b794f4" />
                </linearGradient>
              </defs>
            </g>
          )}
        </svg>

        {/* Small sparkling background particles orbits inside glass block */}
        <AnimatePresence>
          {stage === 'prism' && (
            <div className="absolute inset-0 z-0">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 absolute left-20 top-20 animate-ping" />
              <div className="w-1 h-1 rounded-full bg-amber-200 absolute right-24 top-24 animate-pulse" />
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const getHapticClass = (achievement: Achievement) => {
    return achievement.unlocked ? 'border-[#E6B85C]/30 bg-[#E6B85C]/10 text-[#E6B85C] shadow-[0_0_15px_rgba(230,184,92,0.15)]' : 'border-white/5 bg-white/5 text-white/30';
  };

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'spark': return <Sparkles className="w-6 h-6" />;
      case 'ring': return <Shield className="w-6 h-6" />;
      case 'points': return <Trophy className="w-6 h-6" />;
      case 'sevenDots': return <Waves className="w-6 h-6" />;
      case 'thirtyDots': return <TrendingUp className="w-6 h-6" />;
      case 'runner': return <Cpu className="w-6 h-6" />;
      case 'crystalOne': return <Activity className="w-6 h-6" />;
      default: return <Trophy className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 pt-4 pb-24 px-4 relative">
      {/* Top Header Row with sharing widget */}
      <div className="flex justify-between items-center px-2" id="progress_row">
        <h2 className="text-2xl font-semibold tracking-tight text-white/95">
          Прогресс
        </h2>

        <button 
          onClick={() => {
            // standard share prompt simulation
            alert("Ссылка для шеринга сгенерирована! 'Мой кристалл - " + getStageTitle(getCrystalStage()) + "'\nПоделись своими инсайтами воли!");
          }}
          className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 active:scale-95 transition"
          title="Поделиться прогрессом"
        >
          <Share2 className="w-5 h-5 text-white/80" />
        </button>
      </div>

      {/* Block 1: The Crystal Interactive Area */}
      <div className="w-full" id="block_interactive_crystal">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-[32px] p-6 h-[440px] flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
          
          <div className="flex justify-between items-center z-10 relative">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Твой прогресс</span>
              <h3 className="text-lg font-medium text-white/90">{getStageTitle(getCrystalStage())}</h3>
            </div>
            <span className="text-xs font-mono text-white/40 bg-white/10 px-2 py-0.5 rounded-full select-none">3D модель</span>
          </div>

          {/* Interactive touch element representation */}
          <div 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            className="flex-1 w-full flex items-center justify-center cursor-grab active:cursor-grabbing border border-transparent overflow-hidden my-2"
            id="touch_element_crystal"
          >
            {renderCrystalSVG(getCrystalStage())}
          </div>

          <p className="text-xs text-center text-white/50 leading-relaxed font-sans px-4 z-10 select-none">
            {getStageDescription(getCrystalStage())}
          </p>
          <p className="text-[10px] text-center text-white/20 select-none font-mono mt-1 z-10">
            Вращай кристалл пальцем для созерцания граней
          </p>
        </div>
      </div>

      {/* Block 2: Путь в цифрах (horizontal stats) */}
      <div className="flex flex-col space-y-3" id="block_digits_stats">
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest px-1">
          Путь в цифрах
        </span>

        <div className="flex space-x-3 w-full" id="digits_grid">
          {/* Card 1 */}
          <div className="flex-1 p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono text-white/95">{stats.daysPractice}</span>
            <span className="text-[10px] text-white/40 font-sans tracking-wide mt-1">дни практики</span>
          </div>

          {/* Card 2 */}
          <div className="flex-1 p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono text-white/95">{stats.ritualsCompleted}</span>
            <span className="text-[10px] text-white/40 font-sans tracking-wide mt-1">ритуалов</span>
          </div>

          {/* Card 3 */}
          <div className="flex-1 p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono text-white/95">{stats.daysStreak}</span>
            <span className="text-[10px] text-white/40 font-sans tracking-wide mt-1">дней серии</span>
          </div>
        </div>
      </div>

      {/* Block 3: Goals (Цели) */}
      <div className="flex flex-col space-y-3" id="block_goals">
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest px-1">
          Цели
        </span>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-white/80">Твоя цель на неделю</h4>
            <button 
              onClick={() => setShowGoalModal(true)}
              className="text-xs text-[#E6B85C] hover:underline font-mono"
            >
              Изменить
            </button>
          </div>

          {/* Progress branch representation */}
          <div className="flex items-center space-x-3 w-full">
            <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentGoalProgress / selectedGoalCount) * 100}%` }}
                className="h-full bg-gradient-to-r from-emerald-400 to-[#E6B85C]"
              />
            </div>
            <span className="text-xs font-mono text-white/60 shrink-0">
              {currentGoalProgress} из {selectedGoalCount} ритуалов
            </span>
          </div>

          <p className="text-xs text-white/45 font-sans leading-relaxed">
            Регулярные цели помогают направить внимание. Закончив на этой неделе ещё {selectedGoalCount - currentGoalProgress} ритуала, ты вырастишь следующую ветвь сознания!
          </p>
        </div>
      </div>

      {/* Block 4: Achievements (Достижения horizontal track) */}
      <div className="flex flex-col space-y-3" id="block_achievements">
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest px-1">
          Мои достижения
        </span>

        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none px-1">
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              onClick={() => setShowBadgeModal(ach)}
              className={`shrink-0 w-[110px] h-[110px] rounded-2xl border flex flex-col items-center justify-center text-center p-2 cursor-pointer transition active:scale-95 ${getHapticClass(ach)}`}
            >
              {getIconComponent(ach.iconType)}
              <span className="text-[10px] text-white/90 font-medium truncate w-full mt-2">
                {ach.title}
              </span>
              <span className="text-[8px] text-white/30 font-mono mt-0.5">
                {ach.unlocked ? 'Получено' : 'Скрыто'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Block 5: Useful readings (Полезное чтение) */}
      <div className="flex flex-col space-y-3" id="block_educational_articles">
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest px-1">
          Полезное чтение
        </span>

        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-none px-1">
          {EDUCATIONAL_ARTICLES.map((art) => (
            <div 
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="shrink-0 w-[240px] p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all flex flex-col justify-between h-[130px] cursor-pointer"
            >
              <div className="flex flex-col space-y-1">
                <span className="text-[9px] uppercase font-mono text-white/30 tracking-widest">Статья</span>
                <h4 className="text-sm font-medium text-white/90 truncate leading-snug">{art.title}</h4>
              </div>
              <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">
                {art.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Block 6: Deepen practice teaser block */}
      <div className="w-full pt-4 border-t border-white/5" id="block_deepen">
        <div className="bg-gradient-to-r from-amber-400/5 to-transparent border border-white/[0.05] rounded-2xl p-5 flex flex-col space-y-3 pointer-events-auto">
          <span className="text-[9px] uppercase tracking-wider font-mono text-amber-300">Сообщество и Экосистема</span>
          <h4 className="text-sm font-medium text-white/90">Сковать свой Артефакт</h4>
          <p className="text-xs text-white/50 leading-relaxed font-sans">
            Умное кольцо Ritual Core непрерывно считывает пульс, ВСР и температуру. Сочетается с подпиской Ritual Plus для совершенного удержания внимания.
          </p>
          <div className="flex space-x-3 pt-2">
            <button 
              onClick={onOpenStore}
              className="px-4 py-2 bg-amber-400 text-black font-semibold rounded-xl text-xs active:scale-95 transition"
            >
              Кольцо Core
            </button>
            <button 
              onClick={onOpenPlus}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs active:scale-95 transition"
            >
              Попробовать Plus
            </button>
          </div>
        </div>
      </div>

      {/* Goal Configure popup modal */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-45 flex items-center justify-center p-4 pointer-events-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#0e101cf2] border border-white/10 p-6 rounded-3xl flex flex-col space-y-4"
            >
              <h3 className="text-lg font-medium text-white/95">Изменить цель на неделю</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Повышение или понижение планки недельных ритуалов задает интенсивность твоего движения. Выбери норму:
              </p>
              
              <div className="flex justify-between items-center pt-2">
                {[3, 5, 7, 10].map(count => (
                  <button 
                    key={count}
                    onClick={() => setSelectedGoalCount(count)}
                    className={`w-12 h-12 rounded-xl border font-mono text-sm leading-relaxed transition ${selectedGoalCount === count ? 'bg-amber-400 border-amber-400 text-black font-bold' : 'bg-white/5 border-white/10 text-white'}`}
                  >
                    {count}
                  </button>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => {
                    // Save and complete
                    setShowGoalModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E6B85C] text-black text-xs font-semibold"
                >
                  Применить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Badge/Achievement Detail sheet */}
      <AnimatePresence>
        {showBadgeModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-45 flex items-center justify-center p-4 pointer-events-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#0e101cf2] border border-white/10 p-6 rounded-3xl flex flex-col items-center text-center space-y-4 relative"
            >
              <button 
                className="absolute top-4 right-4 text-white/40 hover:text-white"
                onClick={() => setShowBadgeModal(null)}
              >
                Закрыть
              </button>

              <div className={`p-4 rounded-full border mb-2 ${showBadgeModal.unlocked ? 'bg-amber-400/20 border-amber-400/40 text-amber-400' : 'bg-white/5 border-white/5 text-white/30'}`}>
                {getIconComponent(showBadgeModal.iconType)}
              </div>

              <span className="text-[10px] uppercase font-mono tracking-widest text-[#E6B85C]">Поздравляем!</span>
              <h3 className="text-xl font-medium text-white/95">{showBadgeModal.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed max-w-[240px]">
                {showBadgeModal.description}
              </p>

              <p className="text-[10px] font-mono text-white/20 pt-2">
                {showBadgeModal.unlocked ? 'Достижение раскрыто на пути' : 'Достижение пока заблокировано'}
              </p>

              <button 
                onClick={() => {
                  setShowBadgeModal(null);
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 text-white text-xs font-medium border border-white/10"
              >
                Круто!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Useful Reading Bottom Sheet Article Reader */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-45 flex items-end justify-center pointer-events-auto">
            {/* Hit space close */}
            <div className="absolute inset-0" onClick={() => setActiveArticle(null)} />

            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-md bg-[#0e101cf2] border-t border-white/10 rounded-t-[32px] p-6 pb-12 z-50 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-[#E6B85C]">Полезное чтение</span>
                  <h3 className="text-lg font-medium text-white/90">{activeArticle.title}</h3>
                </div>
                <button 
                  onClick={() => setActiveArticle(null)}
                  className="w-8 h-8 rounded-full bg-white/5 active:scale-90 flex items-center justify-center text-white/60 hover:text-white"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm text-white/70 leading-relaxed font-sans space-y-4 pt-2 whitespace-pre-line">
                {activeArticle.content}
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col">
                <span className="text-[10px] text-white/30 font-mono">Тема: Attention Recovery</span>
                <span className="text-[10px] text-white/30 font-mono mt-0.5">В основе материала — нейробиологические исследования ВСР и внимания</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Close icon alias
function CloseIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
