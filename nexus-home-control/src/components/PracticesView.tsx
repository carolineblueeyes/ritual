import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Lock, 
  Bookmark, 
  Check, 
  TrendingUp, 
  Heart, 
  Search, 
  BookmarkCheck, 
  Sparkles,
  Zap,
  Waves,
  Eye,
  User,
  Coffee,
  Brain,
  AlertTriangle,
  Lightbulb,
  Sun,
  Flame,
  ChevronRight,
  FlameKindling,
  X
} from 'lucide-react';
import { Practice, PracticeGroupType } from '../types';
import { ALL_PRACTICES } from '../data';

interface PracticesViewProps {
  isPlus: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onStartPractice: (practice: Practice) => void;
  onOpenPlus: () => void;
  currentLevel: number; // e.g. 2 for level 2 of Исток
}

export default function PracticesView({
  isPlus,
  favorites,
  onToggleFavorite,
  onStartPractice,
  onOpenPlus,
  currentLevel
}: PracticesViewProps) {
  const [selectedGroup, setSelectedGroup] = useState<PracticeGroupType | 'Все'>('Все');
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Chapter definition from specifications
  const CHAPTERS = [
    { 
      id: 'istok', 
      title: 'Глава 1: Исток: Рождение Света', 
      desc: 'В рассеянном внимании загорается первая искра. Она становится твоим внутренним Кристаллом.',
      progress: `Уровень ${Math.min(currentLevel, 6)} из 6`,
      level: 1,
      unlocked: true,
      color: 'from-amber-500/20 to-[#E6B85C]/5 border-[#E6B85C]/20',
      badgeColor: 'text-[#E6B85C] bg-[#E6B85C]/10',
      textAccent: 'text-[#E6B85C]'
    },
    { 
      id: 'silence', 
      title: 'Глава 2: Тишина: Глубина Озера', 
      desc: 'Кристалл погружается в глубину безмолвного озера. Нахождение покоя и полного релакса.',
      progress: 'Заверши Исток для открытия',
      level: 2,
      unlocked: isPlus,
      color: 'from-[#7A9BBA]/20 to-[#7A9BBA]/5 border-[#7A9BBA]/20',
      badgeColor: 'text-[#7A9BBA] bg-[#7A9BBA]/10',
      textAccent: 'text-[#7A9BBA]'
    },
    { 
      id: 'energy', 
      title: 'Глава 3: Энергия: Внутренний Огонь', 
      desc: 'Пробуждение тепла внутри. Искра становится огнем силы и бодрой воли.',
      progress: 'Заблокировано (Plus)',
      level: 3,
      unlocked: isPlus,
      color: 'from-[#E67E22]/20 to-[#E67E22]/5 border-[#E67E22]/20',
      badgeColor: 'text-[#E67E22] bg-[#E67E22]/10',
      textAccent: 'text-[#E67E22]'
    },
    { 
      id: 'clarity', 
      title: 'Глава 4: Ясность: Зеркальная Призма', 
      desc: 'Преломление света сквозь грани. Очищение от ментального шума и выбор пути.',
      progress: 'Заблокировано (Plus)',
      level: 4,
      unlocked: isPlus,
      color: 'from-[#A8D5E5]/20 to-[#A8D5E5]/5 border-[#A8D5E5]/20',
      badgeColor: 'text-[#A8D5E5] bg-[#A8D5E5]/10',
      textAccent: 'text-[#A8D5E5]'
    }
  ];

  // Quick unique exercises from specifications
  const UNIQUE_PRACTICES = [
    { id: 'uniq-breath', name: 'Дыхание 4-7-8', type: 'Дыхание', icon: Waves, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', practiceId: 'box-breathing' },
    { id: 'uniq-movement', name: 'Осознанное движение', type: 'Движение', icon: Zap, color: 'text-[#E67E22] bg-[#E67E22]/10 border-[#E67E22]/20', isMovementTrigger: true },
    { id: 'uniq-focus', name: 'Фокус внимания', type: 'Фокус', icon: Eye, color: 'text-[#A8D5E5] bg-[#A8D5E5]/10 border-[#A8D5E5]/20', isFocusTrigger: true },
    { id: 'uniq-glow', name: 'Свечение', type: 'Пауза (Свеча)', iconType: 'glow', isGlowTrigger: true }
  ];

  // Group categorizer horiz sliders
  const GROUP_PILLS: { label: PracticeGroupType | 'Все'; desc: string }[] = [
    { label: 'Все', desc: 'Все практики библиотеки' },
    { label: 'Исток', desc: 'Опора и сенсорный сброс' },
    { label: 'Тишина', desc: 'Вечер, сон и отпускание' },
    { label: 'Энергия', desc: 'Циркадная бодрость и жар' },
    { label: 'Ясность', desc: 'Фокусировка и разгрузка' }
  ];

  // Search filter and group categorization
  const filteredPractices = ALL_PRACTICES.filter(p => {
    const matchesGroup = selectedGroup === 'Все' || p.group === selectedGroup;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  return (
    <div className="w-full flex flex-col space-y-6 pt-4 pb-24 px-4 select-none relative">
      {/* Top Header & Bookmark Favorite btn */}
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-semibold tracking-tight text-white/95">
          Библиотека
        </h2>

        <button 
          onClick={() => setShowFavorites(true)}
          className="relative w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 active:scale-95 transition"
          id="btn_favorites"
        >
          <Bookmark className="w-5 h-5 text-white/80" />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full text-[9px] text-black font-bold flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>
      </div>

      {/* Block 1: Путь внимания (Chapters) */}
      <div className="flex flex-col space-y-3" id="block_chapter_slide">
        <div className="flex justify-between items-center px-1">
          <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
            Путь внимания
          </span>
          <span className="text-[11px] text-[#E6B85C] font-mono">Главы развития</span>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory px-1">
          {CHAPTERS.map((chap) => (
            <div 
              key={chap.id}
              className={`snap-center shrink-0 w-[290px] rounded-3xl border border-white/10 bg-gradient-to-br ${chap.color} p-5 flex flex-col justify-between h-[180px] backdrop-blur-md relative overflow-hidden`}
            >
              {!chap.unlocked && (
                <div 
                  onClick={onOpenPlus}
                  className="absolute inset-0 bg-black/45 backdrop-blur-[3px] rounded-3xl flex flex-col items-center justify-center space-y-1.5 cursor-pointer z-10 p-4 text-center"
                >
                  <Lock className="w-6 h-6 text-white/60 animate-pulse" />
                  <span className="text-xs font-medium text-white/90">Разблокировать в Ritual Plus</span>
                </div>
              )}

              <div>
                <div className="flex justify-between items-start">
                  <h4 className={`text-md font-medium text-white/90 tracking-tight leading-tight max-w-[80%]`}>
                    {chap.title}
                  </h4>
                  <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${chap.badgeColor}`}>
                    {chap.badgeColor ? 'Глава' : ''}
                  </span>
                </div>
                <p className="text-white/50 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {chap.desc}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-mono text-white/40">
                  {chap.progress}
                </span>

                {chap.unlocked ? (
                  <button 
                    onClick={() => {
                      // start current chapter progress
                      const matched = ALL_PRACTICES.find(p => p.group === 'Исток' && p.id === '5-4-3-2-1');
                      if (matched) onStartPractice(matched);
                    }}
                    className="flex items-center space-x-1 px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/15 text-[11px] font-semibold transition"
                  >
                    <span>{currentLevel > 1 ? 'Продолжить' : 'Начать'}</span>
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </button>
                ) : (
                  <button 
                    onClick={onOpenPlus}
                    className="text-[11px] font-mono text-amber-300 underline"
                  >
                    Продлить подписку
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Block 2: Уникальные (Horizontal quick tap cards) */}
      <div className="flex flex-col space-y-3" id="block_unique_practices">
        <span className="text-white/40 text-xs font-mono uppercase tracking-widest px-1">
          Уникальные ритуалы
        </span>

        <div className="grid grid-cols-2 gap-3" id="unique_grid">
          {/* Quick breathing */}
          <div 
            onClick={() => onStartPractice(ALL_PRACTICES[2])} // square box-breathing
            className="p-4 rounded-2xl bg-[#E6B85C]/5 border border-[#E6B85C]/10 backdrop-blur-md active:scale-95 transition cursor-pointer flex flex-col justify-between h-[100px]"
          >
            <div className="flex justify-between items-start">
              <Waves className="w-5 h-5 text-[#E6B85C]" />
              <span className="text-[8px] font-mono tracking-widest uppercase text-white/30">Дыхание</span>
            </div>
            <span className="text-sm font-medium text-white/90">Квадратное дыхание</span>
          </div>

          {/* Quick focus Pomodoro */}
          <div 
            onClick={() => onStartPractice({ id: 'uniq-focus', name: 'Фокус внимания', group: 'Ясность', duration: '10:00', category: 'focus' } as any)}
            className="p-4 rounded-2xl bg-[#A8D5E5]/5 border border-[#A8D5E5]/10 backdrop-blur-md active:scale-95 transition cursor-pointer flex flex-col justify-between h-[100px]"
          >
            <div className="flex justify-between items-start">
              <Eye className="w-5 h-5 text-[#A8D5E5]" />
              <span className="text-[8px] font-mono tracking-widest uppercase text-white/30">Ясность</span>
            </div>
            <span className="text-sm font-medium text-white/90">Таймер Помодоро</span>
          </div>

          {/* Quick Movement */}
          <div 
            onClick={() => onStartPractice({ id: 'uniq-movement', name: 'Осознанное движение', group: 'Энергия', duration: '15:00', category: 'movement' } as any)}
            className="p-4 rounded-2xl bg-[#E67E22]/5 border border-[#E67E22]/10 backdrop-blur-md active:scale-95 transition cursor-pointer flex flex-col justify-between h-[100px]"
          >
            <div className="flex justify-between items-start">
              <Zap className="w-5 h-5 text-[#E67E22]" />
              <span className="text-[8px] font-mono tracking-widest uppercase text-white/30">Энергия</span>
            </div>
            <span className="text-sm font-medium text-white/90">Прогулка и Ходьба</span>
          </div>

          {/* Quick Glowing candle visualizer */}
          <div 
            onClick={() => onStartPractice({ id: 'uniq-glow', name: 'Свечение', group: 'Тишина', duration: '08:00', category: 'ambient' } as any)}
            className="p-4 rounded-2xl bg-[#7A9BBA]/5 border border-[#7A9BBA]/10 backdrop-blur-md active:scale-95 transition cursor-pointer flex flex-col justify-between h-[100px]"
          >
            <div className="flex justify-between items-start">
              <Sparkles className="w-5 h-5 text-[#7A9BBA]" />
              <span className="text-[8px] font-mono tracking-widest uppercase text-white/30">Тишина</span>
            </div>
            <span className="text-sm font-medium text-white/90">Свечение & Звук</span>
          </div>
        </div>
      </div>

      {/* Filter and Library container */}
      <div className="flex flex-col space-y-4 pt-2">
        
        {/* Search Input bar */}
        <div className="relative">
          <input 
            type="text"
            placeholder="Поиск по названию или фокусу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-white/5 rounded-xl px-4 pl-10 border border-white/5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all font-sans"
          />
          <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-xs text-white/40 hover:text-white"
            >
              Сброс
            </button>
          )}
        </div>

        {/* Group tabs selector */}
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none snap-x px-1">
          {GROUP_PILLS.map((pill) => (
            <button 
              key={pill.label}
              onClick={() => setSelectedGroup(pill.label)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium font-sans tracking-wide transition-all ${
                selectedGroup === pill.label
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Practices scroll list rendering */}
        <div className="flex flex-col space-y-2.5">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] uppercase font-mono text-white/30">Список практик ({filteredPractices.length})</span>
            {selectedGroup !== 'Все' && <span className="text-[10px] font-mono text-white/30">Вектор {selectedGroup}</span>}
          </div>

          <div className="flex flex-col space-y-3">
            {filteredPractices.length === 0 ? (
              <div className="text-center py-10 border border-white/5 rounded-2xl bg-white/[0.01]">
                <span className="text-white/40 text-xs">Практики не найдены. Попробуй сбросить поисковый фильтр.</span>
              </div>
            ) : (
              filteredPractices.map((practice) => {
                const isPracticeUnlocked = practice.isUnlocked !== false || isPlus || practice.group === 'Исток';
                const isFav = favorites.includes(practice.id);
                return (
                  <div 
                    key={practice.id}
                    className="p-4 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition rounded-2xl flex items-center justify-between pointer-events-auto"
                  >
                    <div 
                      onClick={() => {
                        if (isPracticeUnlocked) {
                          onStartPractice(practice);
                        } else {
                          onOpenPlus();
                        }
                      }}
                      className="flex-1 cursor-pointer flex flex-col space-y-1 pr-4"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white/95">{practice.name}</span>
                        {!isPracticeUnlocked && <Lock className="w-3 h-3 text-[#E6B85C]/60" />}
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-white/40 font-mono">
                        <span className="bg-white/5 px-2 py-0.5 rounded">{practice.group}</span>
                        <span>•</span>
                        <span>{practice.duration} мин</span>
                        <span>•</span>
                        <span>{practice.category}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => onToggleFavorite(practice.id)}
                      className={`p-2 rounded-full border active:scale-90 transition ${isFav ? 'bg-amber-400/15 border-amber-400/30 text-amber-400' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                    >
                      <Bookmark className="w-4 h-4 fill-current style-none" style={{ fill: isFav ? 'currentColor' : 'none' }} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Embedded Favorite Sheet Bottom Modal */}
      <AnimatePresence>
        {showFavorites && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 flex items-end justify-center pointer-events-auto">
            {/* Backdrop hit container */}
            <div className="absolute inset-0" onClick={() => setShowFavorites(false)} />
            
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-md bg-[#0e101cf2] border-t border-white/10 rounded-t-[32px] p-6 pb-12 z-50 flex flex-col space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium text-white/90">Избранные практики</h3>
                  <span className="text-[10px] text-white/40 tracking-widest font-mono uppercase">Твои якоря ({favorites.length})</span>
                </div>
                <button 
                  onClick={() => setShowFavorites(false)}
                  className="w-8 h-8 rounded-full bg-white/5 active:scale-90 flex items-center justify-center text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col space-y-2 pt-2">
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <BookmarkCheck className="w-12 h-12 text-white/20 mx-auto mb-2" />
                    <span className="text-xs text-white/40 font-sans">В избранном пусто. Сохраняй ритуалы из библиотеки кнопкой закладки!</span>
                  </div>
                ) : (
                  favorites.map((favId) => {
                    const practice = ALL_PRACTICES.find(p => p.id === favId);
                    if (!practice) return null;
                    return (
                      <div 
                        key={practice.id}
                        className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-between"
                      >
                        <div 
                          onClick={() => {
                            setShowFavorites(false);
                            onStartPractice(practice);
                          }}
                          className="flex-1 cursor-pointer"
                        >
                          <span className="text-xs text-white/90 block font-medium">{practice.name}</span>
                          <span className="text-[9px] font-mono text-white/30">{practice.group} • {practice.duration} мин</span>
                        </div>
                        <button 
                          onClick={() => onToggleFavorite(practice.id)}
                          className="text-[11px] text-rose-400 hover:text-rose-300 font-mono"
                        >
                          Удалить
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
