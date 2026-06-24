import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  MapPin, 
  Activity, 
  BookOpen, 
  Check, 
  ChevronRight, 
  TrendingUp, 
  Settings, 
  User, 
  ShieldCheck, 
  Mic, 
  Lock, 
  Plus, 
  X,
  Play,
  Pause,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Waves,
  Zap,
  Eye,
  Heart,
  Droplet,
  Smartphone,
  Info,
  Calendar,
  History,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { HealthState, Practice, ActivityLog, UserStats, Achievement } from './types';
import { ALL_PRACTICES, INITIAL_ACHIEVEMENTS } from './data';

// Component imports
import TodayView from './components/TodayView';
import PracticesView from './components/PracticesView';
import ProgressView from './components/ProgressView';
import NavigatorModal from './components/NavigatorModal';
import SubscriptionPlus from './components/SubscriptionPlus';
import RingCustomizer from './components/RingCustomizer';
import Onboarding from './components/Onboarding';

export default function App() {
  // Navigation states: 'today' | 'practices' | 'progress' | 'profile' | 'ring'
  const [activeTab, setActiveTab] = useState<'today' | 'practices' | 'progress' | 'profile'>('today');

  // Core User state persistently saved via localStorage
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    const saved = localStorage.getItem('ritual_onboarded');
    return saved ? JSON.parse(saved) : false;
  });

  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem('ritual_username');
    return saved || 'Странник Внимания';
  });

  const [isPlus, setIsPlus] = useState<boolean>(() => {
    const saved = localStorage.getItem('ritual_plus_active');
    return saved ? JSON.parse(saved) : true; // Default True for MVP richness
  });

  const [ringConnected, setRingConnected] = useState<boolean>(() => {
    const saved = localStorage.getItem('ring_connected');
    return saved === 'true';
  });

  const [ringConfig, setRingConfig] = useState<any>({
    shell: 'Glow Obsidian',
    engraving: 'Я здесь'
  });

  const [healthScore, setHealthScore] = useState<number>(84);
  const [healthState, setHealthState] = useState<HealthState>('Balance');

  const [stats, setStats] = useState<UserStats>({
    daysPractice: 3,
    ritualsCompleted: 5,
    daysStreak: 3
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('ritual_achievements');
    if (saved) return JSON.parse(saved);
    // Auto unlock some achievements for richness if rituals > 0
    return INITIAL_ACHIEVEMENTS.map(ach => {
      if (ach.id === 'first_spark') return { ...ach, unlocked: true };
      return ach;
    });
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ritual_favorites');
    return saved ? JSON.parse(saved) : ['5-4-3-2-1', 'physio-sigh'];
  });

  const [background, setBackground] = useState<'water' | 'sky' | 'aurora'>('water');

  const [recommendedPractice, setRecommendedPractice] = useState<Practice>(() => {
    return ALL_PRACTICES.find(p => p.id === 'physio-sigh') || ALL_PRACTICES[0];
  });

  // Modal displays
  const [showNavigator, setShowNavigator] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showRingConfigurator, setShowRingConfigurator] = useState(false);
  const [showHealthDetail, setShowHealthDetail] = useState(false);
  const [activeReadingTopic, setActiveReadingTopic] = useState<any>(null);

  // Active exercises states
  const [activePractice, setActivePractice] = useState<Practice | null>(null);

  // 1. Breathing loop player controls
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'done'>('inhale');
  const [breathingSecondsLeft, setBreathingSecondsLeft] = useState(4);
  const [breathingCyclesCompleted, setBreathingCyclesCompleted] = useState(0);

  // 2. Focus timer state
  const [pomodoroFocusTitle, setPomodoroFocusTitle] = useState('Главный приоритет');
  const [pomodoroMinutes, setPomodoroFocusMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [pomodoroIsActive, setPomodoroIsActive] = useState(false);
  const [distractionsCount, setDistractionsCount] = useState(0);
  const [userCheated, setUserCheated] = useState(false);
  const [cheatedMessage, setCheatedMessage] = useState(false);

  // 3. Mindful movement (Walk/Run/Bicycle tracker)
  const [movementType, setMovementType] = useState<'walk' | 'run' | 'bike'>('walk');
  const [movementIsActive, setMovementIsActive] = useState(false);
  const [movementTimer, setMovementTimer] = useState(0); // in seconds
  const [movementDistance, setMovementDistance] = useState(0.0); // in km
  const [simicatedPace, setSimulatedPace] = useState('6:15');

  // 4. "Свечение" soundscape horizontal player states
  const [ambientTrackIndex, setAmbientTrackIndex] = useState(0);
  const [ambientIsPlaying, setAmbientIsPlaying] = useState(false);

  // History track log
  const [workoutLogs, setWorkoutLogs] = useState<ActivityLog[]>([
    { id: '1', type: 'audio', date: 'Вчера', durationMinutes: 7, selectedState: 'Balance' },
    { id: '2', type: 'breathing', date: '2 дня назад', durationMinutes: 5, selectedState: 'Shining' }
  ]);

  // Handle active status block click haptic updates from Today
  useEffect(() => {
    localStorage.setItem('ritual_onboarded', JSON.stringify(isOnboarded));
    localStorage.setItem('ritual_username', userName);
    localStorage.setItem('ritual_plus_active', JSON.stringify(isPlus));
    localStorage.setItem('ring_connected', String(ringConnected));
    localStorage.setItem('ritual_favorites', JSON.stringify(favorites));
    localStorage.setItem('ritual_achievements', JSON.stringify(achievements));
  }, [isOnboarded, userName, isPlus, ringConnected, favorites, achievements]);

  // Synchronise window focus for cheating check on Focus (Pomodoro) timer
  useEffect(() => {
    const handleBlur = () => {
      if (activePractice?.id === 'uniq-focus' && pomodoroIsActive) {
        setUserCheated(true);
        setCheatedMessage(true);
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [activePractice, pomodoroIsActive]);

  // Breathing loop interval ticking
  useEffect(() => {
    let timer: any;
    if (activePractice?.group === 'Исток' && !activePractice.id.startsWith('uniq')) {
      // General standard breathing simulation ticker
      if (breathingCyclesCompleted < 4) {
        timer = setInterval(() => {
          setBreathingSecondsLeft(prev => {
            if (prev <= 1) {
              if (breathingPhase === 'inhale') {
                setBreathingPhase('hold');
                return 7; // Hold for 7 sec (4-7-8)
              } else if (breathingPhase === 'hold') {
                setBreathingPhase('exhale');
                return 8; // Exhale for 8 sec
              } else {
                setBreathingPhase('inhale');
                setBreathingCyclesCompleted(c => c + 1);
                return 4; // Inhale for 4 sec
              }
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Complete practice
        handleFinishPractice(activePractice.name, activePractice.duration);
      }
    }
    return () => clearInterval(timer);
  }, [activePractice, breathingPhase, breathingCyclesCompleted]);

  // Focus Pomodoro timer tick interval
  useEffect(() => {
    let interval: any;
    if (activePractice?.id === 'uniq-focus' && pomodoroIsActive) {
      interval = setInterval(() => {
        if (pomodoroSeconds > 0) {
          setPomodoroSeconds(prev => prev - 1);
        } else if (pomodoroMinutes > 0) {
          setPomodoroFocusMinutes(prev => prev - 1);
          setPomodoroSeconds(59);
        } else {
          // completed pomodoro focus block!
          setPomodoroIsActive(false);
          handleFinishPractice(`Фокус: ${pomodoroFocusTitle}`, `${25 - pomodoroMinutes} минут`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePractice, pomodoroIsActive, pomodoroMinutes, pomodoroSeconds]);

  // Mindful Movement dynamic simulation timers
  useEffect(() => {
    let interval: any;
    if (activePractice?.id === 'uniq-movement' && movementIsActive) {
      interval = setInterval(() => {
        setMovementTimer(prev => prev + 1);
        setMovementDistance(prev => {
          const paceMap = movementType === 'run' ? 0.003 : movementType === 'bike' ? 0.007 : 0.0015;
          return parseFloat((prev + paceMap).toFixed(3));
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePractice, movementIsActive, movementType]);

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleOpenStores = () => {
    setShowRingConfigurator(true);
  };

  // Launch pre-specified practice
  const handleStartPracticeSelect = (practice: Practice) => {
    setActivePractice(practice);
    
    // reset practice specific states
    setBreathingPhase('inhale');
    setBreathingSecondsLeft(4);
    setBreathingCyclesCompleted(0);

    setPomodoroIsActive(false);
    setPomodoroFocusMinutes(25);
    setPomodoroSeconds(0);
    setDistractionsCount(0);
    setUserCheated(false);
    setCheatedMessage(false);

    setMovementIsActive(false);
    setMovementTimer(0);
    setMovementDistance(0.0);

    setAmbientIsPlaying(false);
  };

  // Finish practice correctly updating user stats and unlocking achievements
  const handleFinishPractice = (title: string, durationStr: string) => {
    // update statistics
    setStats(prev => {
      const isNewStreak = prev.daysStreak < 4 ? prev.daysStreak + 1 : prev.daysStreak;
      return {
        daysPractice: prev.daysPractice + 1,
        ritualsCompleted: prev.ritualsCompleted + 1,
        daysStreak: isNewStreak
      };
    });

    // append to workout logs
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      type: activePractice?.id === 'uniq-movement' ? 'walk' : 'audio',
      date: 'Только что',
      durationMinutes: activePractice?.id === 'uniq-movement' ? Math.floor(movementTimer / 60) || 1 : 5,
      distanceKm: activePractice?.id === 'uniq-movement' ? movementDistance : undefined,
      selectedState: healthState,
      cheated: userCheated
    };
    setWorkoutLogs([newLog, ...workoutLogs]);

    // trigger success level triggers / achievements
    setAchievements(prev => {
      return prev.map(ach => {
        if (ach.id === 'first_spark') {
          return { ...ach, unlocked: true };
        }
        if (ach.id === 'first_week' && stats.ritualsCompleted + 1 >= 7) {
          return { ...ach, unlocked: true };
        }
        return ach;
      });
    });

    // Close practice sheet and navigate back to progress or today
    setActivePractice(null);
  };

  // Apply AI speech recommendations directly
  const handleApplyAIRecommendation = (rec: any) => {
    // set health states dynamically
    setHealthState(rec.state);
    setHealthScore(rec.state === 'Overload' ? 32 : rec.state === 'Tension' ? 51 : 88);

    // update recommended practice card
    const targetPractice: Practice = {
      id: rec.ritualName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: rec.ritualName,
      group: rec.ritualGroup,
      duration: rec.duration.replace(/:/g, '.'),
      category: rec.phrase,
      scientificBase: rec.reason,
      howItWorks: rec.instructions,
      result: 'Восстановление ясной позиции',
      isUnlocked: true
    };
    setRecommendedPractice(targetPractice);
    setActiveTab('today');
  };

  // Soundscapes horizontal library
  const SOUNDSCAPES = [
    { name: 'Фокус Альфа', desc: 'Бинауральный гул 40 Гц для лучшей глубины когнитивной концентрации.', color: 'from-cyan-900 to-slate-900' },
    { name: 'Поток Энергии', desc: 'Изохронные тоны 18 Гц порождают утреннюю бодрость без кофеина.', color: 'from-orange-950 to-slate-950' },
    { name: 'Расслабление Сердца', desc: 'Альфа-волны 10 Гц растворяют фоновую суету и навязчивые мысли.', color: 'from-[#7A9BBA]/40 to-slate-950' },
    { name: 'Сон Тета', desc: 'Глубокий целебный резонанс 30 Гц стимулирует блуждающий нерв в ночь.', color: 'from-purple-950 to-slate-950' },
    { name: 'Тишина Свечи', desc: 'Естественный тихий треск сандаловой свечи и теплая тишина тибетских чаш.', color: 'from-amber-950 to-slate-950' },
    { name: 'Восстановление ВСР', desc: 'Ритмичные низкочастотные волны для стимуляции вегетативной системы.', color: 'from-teal-950 to-slate-950' }
  ];

  // Dynamic Background style filters
  const getBackgroundStyle = () => {
    switch (background) {
      case 'sky':
        return 'bg-gradient-to-tr from-[#02030a] via-[#06041c] to-[#0a1128]';
      case 'aurora':
        return 'bg-gradient-to-tr from-[#020503] via-[#041c10] to-[#0a2818]';
      default:
        return 'bg-gradient-to-tr from-[#03020c] via-[#070b16] to-[#091823]';
    }
  };

  const getBackgroundCircleGlow = () => {
    switch (background) {
      case 'sky':
        return 'bg-purple-500/10';
      case 'aurora':
        return 'bg-emerald-500/10';
      default:
        return 'bg-cyan-500/10';
    }
  };

  if (!isOnboarded) {
    return <Onboarding onComplete={() => setIsOnboarded(true)} />;
  }

  return (
    <div className={`w-full min-h-screen ${getBackgroundStyle()} text-white font-sans overflow-x-hidden relative flex flex-col justify-between selection:bg-amber-400 selection:text-black`}>
      
      {/* Background Soft Glow Orbs */}
      <div className={`absolute top-24 left-[15%] w-72 h-72 rounded-full ${getBackgroundCircleGlow()} blur-3xl pointer-events-none z-0`} />
      <div className={`absolute bottom-32 right-[10%] w-80 h-80 rounded-full ${getBackgroundCircleGlow()} blur-3xl pointer-events-none z-0`} />

      {/* Main tab viewer container */}
      <main className="w-full flex-1 max-w-md mx-auto z-10 relative pb-10">
        <AnimatePresence mode="wait">
          {activeTab === 'today' && (
            <motion.div 
              key="today"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <TodayView 
                healthState={healthState}
                healthScore={healthScore}
                userName={userName}
                isPlus={isPlus}
                onOpenProfile={() => setActiveTab('profile' as any)}
                onOpenPlus={() => setShowSubscription(true)}
                onOpenHealthDetail={() => setShowHealthDetail(true)}
                onStartPractice={handleStartPracticeSelect}
                background={background}
                onChangeBg={(bg) => setBackground(bg)}
                recommendedPractice={recommendedPractice}
                setRecommendedPractice={setRecommendedPractice}
                practiceLogs={workoutLogs}
              />
            </motion.div>
          )}

          {activeTab === 'practices' && (
            <motion.div 
              key="practices"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <PracticesView 
                isPlus={isPlus}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onStartPractice={handleStartPracticeSelect}
                onOpenPlus={() => setShowSubscription(true)}
                currentLevel={stats.ritualsCompleted + 1}
              />
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div 
              key="progress"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <ProgressView 
                stats={stats}
                achievements={achievements}
                healthState={healthState}
                onOpenPlus={() => setShowSubscription(true)}
                onOpenStore={handleOpenStores}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-6 flex flex-col pt-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-mono">Профиль Личности</h2>
                <button 
                  onClick={() => setActiveTab('today')}
                  className="w-8 h-8 rounded-full bg-white/5 active:scale-95 flex items-center justify-center text-white/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Section 1: Avatar editing */}
              <div className="flex items-center space-x-4 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5">
                <div className="w-16 h-16 rounded-full border-2 border-[#E6B85C]/60 bg-gradient-to-tr from-purple-400 to-[#E6B85C] flex items-center justify-center text-black font-extrabold text-lg shadow-lg">
                  {userName.substring(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col flex-1">
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#E6B85C] focus:outline-none text-white text-base font-medium py-0.5 tracking-wide max-w-[200px]"
                  />
                  <span className="text-[10px] text-white/40 font-mono uppercase mt-0.5">Владелец Кристалла</span>
                </div>
              </div>

              {/* Section 2: Ring connection status */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/30 font-mono tracking-wider uppercase">ОБОРУДОВАНИЕ</span>
                    <h3 className="text-sm font-medium text-white/90">Ritual Inside Smart Ring</h3>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono ${ringConnected ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-white/40'}`}>
                    {ringConnected ? 'Подключено 78%' : 'Не подключено'}
                  </span>
                </div>

                {ringConnected ? (
                  <div className="text-xs text-white/50 leading-relaxed font-sans flex flex-col space-y-2">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Материал:</span>
                      <span className="text-white">{ringConfig.shell}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Код гравировки:</span>
                      <span className="text-amber-300 font-bold">{ringConfig.engraving}</span>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowRingConfigurator(true)}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 text-black font-bold text-xs active:scale-95 transition"
                  >
                    Подключить Ritual Core
                  </button>
                )}
              </div>

              {/* Section 3: Subscription terms */}
              <div 
                onClick={() => setShowSubscription(true)}
                className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 cursor-pointer hover:bg-white/[0.04] transition flex justify-between items-center"
              >
                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] text-[#E6B85C] font-mono uppercase tracking-widest">Ritual Plus</span>
                  <p className="text-xs text-white/50 leading-snug">Полная нейробиологическая библиотека практик активна круглый год.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </div>

              {/* Details sections feedback */}
              <div className="flex flex-col space-y-1 text-center py-4 select-text">
                <span className="text-[9px] font-mono text-white/20 uppercase">Ritual system v1.2</span>
                <span className="text-[9px] font-mono text-cyan-400/40">dmitriyganushak@gmail.com</span>
                <button 
                  onClick={() => setIsOnboarded(false)}
                  className="text-[10px] font-mono text-rose-400/50 hover:text-rose-400 underline pt-4"
                >
                  Сбросить онбординг и начать заново
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Embedded Practice Loops Fullscreen Overlay Player */}
      <AnimatePresence>
        {activePractice && (
          <div className="fixed inset-0 bg-[#060814] z-55 flex flex-col justify-between p-6 pointer-events-auto overflow-y-auto">
            
            {/* Top Close trigger */}
            <div className="flex justify-between items-center w-full max-w-sm mx-auto pt-4">
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-white/5 bg-white/5">
                {activePractice.group} практикуется
              </span>
              <button 
                onClick={() => setActivePractice(null)}
                className="w-10 h-10 rounded-full bg-white/5 active:scale-95 flex items-center justify-center text-white/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Switch block */}
            <div className="flex-1 w-full max-w-sm mx-auto flex flex-col justify-center items-center py-8">
              
              {/* Scenario 1: standard 4-7-8 deep breathing guide */}
              {activePractice.group === 'Исток' && !activePractice.id.startsWith('uniq') && (
                <div className="flex flex-col items-center text-center space-y-8 w-full p-4">
                  
                  {/* Animating breathing circle */}
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <motion.div 
                      animate={{ 
                        scale: breathingPhase === 'inhale' ? 1.5 : breathingPhase === 'hold' ? 1.5 : 0.95
                      }}
                      transition={{ 
                        duration: breathingPhase === 'inhale' ? 4 : breathingPhase === 'hold' ? 0.1 : 8,
                        ease: "easeInOut"
                      }}
                      className="w-36 h-32 rounded-full bg-gradient-to-r from-amber-400/20 to-purple-400/20 blur-xl absolute"
                    />

                    <motion.div 
                      animate={{ 
                        scale: breathingPhase === 'inhale' ? 1.4 : breathingPhase === 'hold' ? 1.4 : 0.95
                      }}
                      transition={{ 
                        duration: breathingPhase === 'inhale' ? 4 : breathingPhase === 'hold' ? 0.1 : 8,
                        ease: "easeInOut"
                      }}
                      className="w-36 h-36 rounded-full border-2 border-amber-400/30 flex items-center justify-center"
                    >
                      <h3 className="text-4xl font-bold font-mono text-white tracking-widest">{breathingSecondsLeft}</h3>
                    </motion.div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="text-md uppercase font-mono tracking-widest text-[#E6B85C]">
                      {breathingPhase === 'inhale' && 'Вдох носом (Раз, два...)'}
                      {breathingPhase === 'hold' && 'Задержка (Все замерло)'}
                      {breathingPhase === 'exhale' && 'Выдох облегчения («ха»)'}
                    </span>
                    <span className="text-xs text-white/40 font-mono">Цикл {breathingCyclesCompleted + 1} из 4</span>
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed font-sans max-w-[280px]">
                    {activePractice.howItWorks || 'Синхронизируйте дыхание с ритмичной геометрией квадрата.'}
                  </p>
                </div>
              )}

              {/* Scenario 2: Unique Mindful Movement selector / active tracker */}
              {activePractice.id === 'uniq-movement' && (
                <div className="flex flex-col space-y-5 w-full p-4">
                  {movementIsActive ? (
                    <div className="flex flex-col items-center space-y-6 text-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 tracking-widest font-mono uppercase">Дистанция</span>
                        <h4 className="text-5xl font-mono font-bold tracking-tight text-white">{movementDistance} км</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="p-3 bg-white/5 rounded-xl text-center border border-white/5">
                          <span className="text-[9px] font-mono text-white/30 uppercase">Время</span>
                          <span className="text-sm font-semibold font-mono text-white mt-1 block">
                            {Math.floor(movementTimer / 60)}:{(movementTimer % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl text-center border border-white/5">
                          <span className="text-[9px] font-mono text-white/30 uppercase">ТЕМП</span>
                          <span className="text-sm font-semibold font-mono text-white mt-1 block">{simicatedPace}м/км</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Heart className="w-5 h-5 text-rose-500 animate-ping" />
                        <span className="text-xs font-mono text-white/50">Simulated Heart Rate: 132 bpm</span>
                      </div>

                      <div className="flex space-x-3 pt-4 w-full">
                        <button 
                          onClick={() => {
                            handleFinishPractice('Движение', `${Math.floor(movementTimer / 60)} мин`);
                          }}
                          className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold text-xs"
                        >
                          Завершить практику
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <h3 className="text-lg font-bold text-center text-white/95">Осознанное движение</h3>
                      <p className="text-xs text-center text-white/50 leading-relaxed max-w-[280px] mx-auto">
                        Прогулка, бег или велосипед возвращают внимание в тело сквозь мерный шаг. Выберите тип:
                      </p>

                      <div className="grid grid-cols-3 gap-2 py-4">
                        {(['walk', 'run', 'bike'] as any[]).map((type) => (
                          <button 
                            key={type}
                            onClick={() => {
                              setMovementType(type);
                              setSimulatedPace(type === 'run' ? '5:10' : type === 'bike' ? '18 км/ч' : '9:30');
                            }}
                            className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-2 ${movementType === type ? 'border-[#E67E22] bg-[#E67E22]/10 text-white' : 'border-white/5 bg-white/5 text-white/60'}`}
                          >
                            <span className="text-[10px] font-mono uppercase font-semibold">{type}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setMovementIsActive(true);
                          setMovementTimer(0);
                        }}
                        className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-xs active:scale-95 transition"
                      >
                        Начать прогулку
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Scenario 3: Unique Focus countdown clock */}
              {activePractice.id === 'uniq-focus' && (
                <div className="flex flex-col space-y-4 w-full p-4">
                  {pomodoroIsActive ? (
                    <div className="flex flex-col items-center space-y-6 text-center">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Eye className="w-5 h-5 animate-pulse" />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#A8D5E5]">Идет сессия фокуса</span>
                        <h4 className="text-base font-semibold text-white/80">{pomodoroFocusTitle}</h4>
                      </div>

                      <h2 className="text-5xl font-mono font-bold tracking-widest text-white">
                        {pomodoroMinutes.toString().padStart(2, '0')}:{pomodoroSeconds.toString().padStart(2, '0')}
                      </h2>

                      {/* I got distracted button */}
                      <button 
                        onClick={() => setDistractionsCount(c => c + 1)}
                        className="px-6 py-3 rounded-xl bg-orange-600/15 border border-orange-500/20 text-orange-400 text-xs font-semibold active:scale-95 transition"
                      >
                        Я отвлекся! {distractionsCount > 0 && `(${distractionsCount})`}
                      </button>

                      {cheatedMessage && (
                        <div className="p-3 bg-rose-500/15 border border-rose-500/20 rounded-xl text-[10px] text-rose-400 max-w-[240px]">
                          Вы свернули приложение — фокус прерван. Субъективная награда Кристалла будет снижена.
                        </div>
                      )}

                      <div className="flex space-x-3 w-full pr-4 pt-4">
                        <button 
                          onClick={() => setPomodoroIsActive(!pomodoroIsActive)}
                          className="p-2.5 rounded-lg border border-white/5 bg-white/5 text-xs text-white"
                        >
                          Пауза
                        </button>
                        <button 
                          onClick={() => {
                            handleFinishPractice(`Фокус: ${pomodoroFocusTitle}`, `${25 - pomodoroMinutes} минут`);
                          }}
                          className="flex-1 py-2.5 bg-[#A8D5E5] text-black font-semibold text-xs rounded-lg"
                        >
                          Завершить
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <h3 className="text-lg font-bold text-center text-white/95">Фокус ума</h3>
                      
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[11px] font-mono text-white/40">Что делаем?</label>
                        <input 
                          type="text" 
                          value={pomodoroFocusTitle}
                          onChange={(e) => setPomodoroFocusTitle(e.target.value)}
                          className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[11px] font-mono text-white/40">Длительность работы (мин)</label>
                        <input 
                          type="number" 
                          value={pomodoroMinutes}
                          onChange={(e) => setPomodoroFocusMinutes(Number(e.target.value))}
                          className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none"
                        />
                      </div>

                      <button 
                        onClick={() => {
                          setPomodoroIsActive(true);
                          setPomodoroSeconds(0);
                        }}
                        className="w-full py-3 bg-white text-black font-semibold text-xs rounded-xl"
                      >
                        Начать фокус
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Scenario 4: "Свечение" Horizontal audio visualizer */}
              {activePractice.id === 'uniq-glow' && (
                <div className="flex flex-col space-y-6 w-full p-4 relative h-[360px] justify-between">
                  <div className="flex flex-col space-y-1 text-center">
                    <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Звуковой ландшафт</span>
                    <h3 className="text-lg font-semibold text-white/95">{SOUNDSCAPES[ambientTrackIndex].name}</h3>
                  </div>

                  {/* Pulsing glow candle representations */}
                  <div className="flex-1 w-full flex items-center justify-center relative my-4">
                    <motion.div 
                      key={ambientTrackIndex}
                      animate={{ 
                        scale: ambientIsPlaying ? [1, 1.25, 1] : 1,
                        opacity: ambientIsPlaying ? [0.4, 0.8, 0.4] : 0.4
                      }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="w-48 h-48 rounded-full bg-amber-400/20 blur-3xl absolute pointer-events-none"
                    />

                    <div className="w-16 h-16 rounded-full border border-amber-400/30 flex items-center justify-center bg-black/40">
                      <Volume2 className={`w-8 h-8 text-amber-300 ${ambientIsPlaying ? 'animate-pulse' : 'opacity-40'}`} />
                    </div>
                  </div>

                  <p className="text-[11px] text-center text-white/50 px-6 font-sans">
                    {SOUNDSCAPES[ambientTrackIndex].desc}
                  </p>

                  {/* Horizont tabs slider to switch tracks */}
                  <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none py-2 px-1">
                    {SOUNDSCAPES.map((t, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setAmbientTrackIndex(idx);
                        }}
                        className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-mono transition-all ${ambientTrackIndex === idx ? 'bg-amber-300 text-black font-semibold' : 'bg-white/5 text-white/40'}`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setAmbientIsPlaying(!ambientIsPlaying)}
                    className="w-full py-3 rounded-full bg-white text-black font-bold text-xs"
                  >
                    {ambientIsPlaying ? 'Пауза саундскейпа' : 'Двойной тап: Воспроизвести'}
                  </button>
                </div>
              )}
            </div>

            {/* Bottom complete practice button trigger */}
            <div className="w-full max-w-sm mx-auto pb-6">
              <button 
                onClick={() => {
                  handleFinishPractice(activePractice.name, activePractice.duration);
                }}
                className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 active:scale-95 transition"
              >
                Завершить ритуал полностью
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded Ritual Health Detailed Screen Bottom Modal */}
      <AnimatePresence>
        {showHealthDetail && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-45 flex items-end justify-center pointer-events-auto">
            {/* Hit space close */}
            <div className="absolute inset-0" onClick={() => setShowHealthDetail(false)} />

            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-md bg-[#0e101cf6] border-t border-white/10 rounded-t-[32px] p-6 pb-12 z-50 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-teal-300">Состояние на приборе</span>
                  <h3 className="text-xl font-bold text-white/95">Что влияет на сияние</h3>
                </div>
                <button 
                  onClick={() => setShowHealthDetail(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Factors list */}
              <div className="flex flex-col space-y-2 py-1 leading-relaxed font-sans text-xs">
                <div className="flex items-center space-x-2 text-white/80">
                  <span className="text-lg">🛌</span>
                  <span>Сон короче нормы на 1 час (6 ч 40 мин)</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <span className="text-lg">❤️</span>
                  <span>Пульс в покое повышен временно (72 уд/мин)</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <span className="text-lg">🧘</span>
                  <span>ВСР (HRV) высокий — быстрая способность регенерировать</span>
                </div>
              </div>

              {/* Metrics Interactive Cards with sparkline draw */}
              <div className="text-xs text-white/40 tracking-wider uppercase font-mono mt-2">Ключевые факторы в деталях:</div>
              <div className="flex flex-col space-y-3 pt-1">
                
                {/* Metric Card 1 */}
                <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-white">ВСР (Вариабельность ритма)</span>
                    <span className="text-teal-300 font-mono">68 ms</span>
                  </div>
                  <p className="text-[11px] text-white/50">Показывает, как тело восстанавливается после стресса. Слишком низкий показатель — сигнал опасности увядания кристалла.</p>
                  
                  {/* Simulated sparkline */}
                  <div className="w-full h-11 bg-white/5 rounded-lg flex items-end justify-between p-2 space-x-1">
                    {[12, 18, 14, 25, 32, 29, 35].map((val, idx) => (
                      <div key={idx} className="flex-1 rounded-sm bg-teal-400" style={{ height: `${val}%` }} />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-white/20 select-none">График ВСР за последние 7 дней</span>
                </div>

                {/* Metric Card 2 */}
                <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-white">Длительность сна</span>
                    <span className="text-[#E6B85C] font-mono">6ч 40м</span>
                  </div>
                  <p className="text-[11px] text-white/50">Сон очищает Кристалл от токсического шума. Сегодня ваш сон короче оптимального на час.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Glassmorphism Bottom Navigation Capsule BAR */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[340px] h-16 bg-[#0c101cd6] border border-white/10 rounded-full z-40 flex items-center justify-between px-3 backdrop-blur-xl shadow-2xl pointer-events-auto">
        <div className="flex items-center justify-between flex-1 pr-14 leading-none">
          {/* Tab 1 */}
          <button 
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center justify-center flex-1 h-12 rounded-full transition-transform active:scale-90 ${activeTab === 'today' ? 'text-amber-300 font-semibold' : 'text-white/40 hover:text-white'}`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-mono font-medium">Сегодня</span>
          </button>

          {/* Tab 2 */}
          <button 
            onClick={() => setActiveTab('practices')}
            className={`flex flex-col items-center justify-center flex-1 h-12 rounded-full transition-transform active:scale-90 ${activeTab === 'practices' ? 'text-amber-300 font-semibold' : 'text-white/40 hover:text-white'}`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] font-mono font-medium">Практики</span>
          </button>

          {/* Tab 3 */}
          <button 
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center justify-center flex-1 h-12 rounded-full transition-transform active:scale-90 ${activeTab === 'progress' ? 'text-amber-300 font-semibold' : 'text-white/40 hover:text-white'}`}
          >
            <Compass className="w-4 h-4 mb-0.5 animate-spin-slow" style={{ animationDuration: '30s' }} />
            <span className="text-[9px] font-mono font-medium">Прогресс</span>
          </button>
        </div>

        {/* Floating Microphone Action Button IA Navigator */}
        <button 
          onClick={() => setShowNavigator(true)}
          className="absolute -right-1 w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-[#E6B85C] flex items-center justify-center text-black shadow-lg shadow-amber-500/25 active:scale-90 transition pointer-events-auto cursor-pointer"
          title="Голосовой ИИ ассистент"
          id="btn_fab_mic"
        >
          <Mic className="w-6 h-6 stroke-[2.5]" />
        </button>
      </footer>

      {/* Floating Modals Connections */}
      <NavigatorModal 
        isOpen={showNavigator}
        onClose={() => setShowNavigator(false)}
        onApplyRecommendation={handleApplyAIRecommendation}
      />

      <SubscriptionPlus 
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        onUnlockPlus={() => setIsPlus(true)}
        alreadyPlus={isPlus}
      />

      <RingCustomizer 
        isOpen={showRingConfigurator}
        onClose={() => setShowRingConfigurator(false)}
        onConnectRing={() => {
          setRingConnected(true);
          setRingConfig({
            shell: 'Glow Obsidian',
            engraving: 'Я здесь'
          });
        }}
      />
    </div>
  );
}
