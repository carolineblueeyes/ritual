import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Plus, Award, ChevronRight, HelpCircle, Dumbbell, History, Bell, Volume2, Sparkles, Navigation, List, TrendingUp, Check, Bookmark, BookmarkCheck, Search, Lock, X, Eye, Zap, Waves, Heart } from "lucide-react";
import { PracticeLevel, Chapter, DayScheduleSlot, PracticeItem } from "../types";
import { CHAPTERS, RITUALS_DATA, CHAPTER_CARDS, GROUP_PILLS } from "../data";
import { BreathingMandala, BiometricWorkoutVisualizer, BrainwaveAudioSpectrum, AudioLevelSpectrogram, RitualBreathingCircle, RitualSpectrogramPlayer } from "./PracticeVisualizers";
import { ttsEngine } from "../services/TTSEngine";
import { soundscapeEngine } from "../services/SoundscapeEngine";
import { audioEngine } from "../services/AudioEngine";
import { getScript } from "../data/ritualScripts";

const LEVEL_TO_RITUAL: Record<string, string> = {
  istok_1: "5-4-3-2-1", istok_2: "sigh", istok_3: "square_breath",
  istok_4: "body_scan", istok_5: "grounding", istok_6: "point",
  silence_1: "night_journal", silence_2: "night_scan", silence_3: "compassion",
  silence_4: "mental_clean", silence_5: "control_release",
  energy_1: "day_code", energy_2: "fire_breath", energy_3: "internal_sun",
  energy_4: "energy_release", energy_5: "morning_awake",
  clarity_1: "goals_map", clarity_2: "morning_affirmation", clarity_3: "priorities",
  clarity_4: "planning_safely", clarity_5: "evening_reflection",
};

interface RitualDataItem {
  id: string; title: string; duration: string; category: string; description: string; isFree: boolean; visualType: "breathing" | "spectrogram" | "journal" | "focus";
}

interface PracticeTabProps {
  completedLevels: string[];
  isSubscribed: boolean;
  onLevelComplete: (levelId: string) => void;
  onLaunchRitual: (id: string, group: string) => void;
  onShowToast?: (title: string, subtitle?: string) => void;
  forcedActiveArea?: "menu" | "movement" | "focus" | "gaze" | "levelPlayer" | "ritualPlayer" | null;
  forcedSelectedLevel?: PracticeLevel | null;
  forcedSelectedChapter?: Chapter | null;
  forcedSelectedRitualData?: RitualDataItem | null;
  onClearForced?: () => void;
}

// Combine all rituals data into a flat array
const ALL_PRACTICES_LIST: PracticeItem[] = (() => {
  const result: PracticeItem[] = [];
  for (const [group, items] of Object.entries(RITUALS_DATA)) {
    for (const item of items) {
      result.push({
        id: item.id,
        name: item.title,
        group: group as any,
        duration: item.duration,
        category: item.category,
        isFree: item.isFree,
        visualType: item.visualType,
      });
    }
  }
  return result;
})();

export const PracticeTab: React.FC<PracticeTabProps> = ({
  completedLevels, isSubscribed, onLevelComplete, onLaunchRitual, onShowToast,
  forcedActiveArea, forcedSelectedLevel, forcedSelectedChapter, forcedSelectedRitualData, onClearForced,
}) => {
  const [activeArea, setActiveArea] = useState<"menu" | "movement" | "focus" | "gaze" | "levelPlayer" | "ritualPlayer">("menu");
  const [selectedLevel, setSelectedLevel] = useState<PracticeLevel | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedRitual, setSelectedRitual] = useState<RitualDataItem | null>(null);

  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['sigh', 'square_breath']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('Все');

  useEffect(() => {
    if (forcedActiveArea) {
      setActiveArea(forcedActiveArea);
      if (forcedSelectedLevel !== undefined) setSelectedLevel(forcedSelectedLevel);
      if (forcedSelectedChapter !== undefined) setSelectedChapter(forcedSelectedChapter);
      if (forcedSelectedRitualData !== undefined) setSelectedRitual(forcedSelectedRitualData);
      if (forcedActiveArea === "levelPlayer" && forcedSelectedLevel) {
        setPlayerSeconds(0);
        const scriptId = LEVEL_TO_RITUAL[forcedSelectedLevel.id];
        const script = scriptId ? getScript(scriptId) : undefined;
        setPlayerMaxSeconds(script ? script.durationSeconds : (forcedSelectedLevel.id.includes("istok") ? 180 : 300));
        setPlayerPlaying(true);
      } else if (forcedActiveArea === "gaze") setGlowActive(true);
      else if (forcedActiveArea === "ritualPlayer" && forcedSelectedRitualData) {
        setRitualPlayerSeconds(0);
        setRitualPlayerActive(true);
      }
      if (onClearForced) onClearForced();
    }
  }, [forcedActiveArea, forcedSelectedLevel, forcedSelectedChapter, forcedSelectedRitualData, onClearForced]);

  const [movementType, setMovementType] = useState<"running" | "walking" | "cycling">("walking");
  const [movementState, setMovementState] = useState<"setup" | "active" | "history">("setup");
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutDistance, setWorkoutDistance] = useState(0.0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [movementHistory, setMovementHistory] = useState<any[]>([
    { id: "1", date: "Вчера", type: "Ходьба", distance: "4.2 км", duration: "32 мин" },
    { id: "2", date: "16 июня", type: "Бег", distance: "5.0 км", duration: "25 мин" },
  ]);
  const [manualType, setManualType] = useState("Ходьба");
  const [manualDist, setManualDistance] = useState("");
  const [manualDur, setManualDuration] = useState("");

  const [focusState, setFocusState] = useState<"setup" | "timer" | "resting" | "completed">("setup");
  const [focusTask, setFocusTask] = useState("");
  const [focusDuration, setFocusDuration] = useState(25);
  const [focusRest, setFocusRest] = useState(5);
  const [focusTimeLeft, setFocusTimeLeft] = useState(1500);
  const [focusDistractions, setFocusDistractions] = useState(0);
  const [cheatedFlag, setCheatedFlag] = useState(false);

  const [glowIndex, setGlowIndex] = useState(1);
  const [glowActive, setGlowActive] = useState(false);
  const [glowVolume, setGlowVolume] = useState(0.7);
  const [showGlowHelp, setShowGlowHelp] = useState(false);

  const [playerPlaying, setPlayerPlaying] = useState(false);
  const [playerSeconds, setPlayerSeconds] = useState(0);
  const [playerMaxSeconds, setPlayerMaxSeconds] = useState(300);
  const [subtitleText, setSubtitleText] = useState("");

  const [ritualPlayerActive, setRitualPlayerActive] = useState(false);
  const [ritualPlayerSeconds, setRitualPlayerSeconds] = useState(0);
  const ritualSecondsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const playSecondsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const ritualSegmentRef = useRef(-1);
  const levelSegmentRef = useRef(-1);

  const soundscapesList = [
    { name: "Фокус", desc: "Бинауральные ритмы для концентрации", colors: "from-blue-400 to-[#8AB4C8]", info: "44 Гц + 14 Гц" },
    { name: "Поток", desc: "Частоты для энергии без стресса", colors: "from-amber-400 to-[#C9A96E]", info: "50 Гц + 16 Гц" },
    { name: "Расслабление", desc: "Альфа-волны для снятия зажатия", colors: "from-[#8899AA] to-blue-500", info: "40 Гц + 8 Гц" },
    { name: "Сон", desc: "Тета-волны для глубокого сна", colors: "from-indigo-950 to-[#8899AA]", info: "30 Гц + 4 Гц" },
    { name: "Тишина", desc: "Треск свечи для декомпрессии", colors: "from-orange-400 to-black", info: "Аналоговый шум" },
    { name: "Пробуждение", desc: "Бета-ритмы для утреннего запуска", colors: "from-[#C9A96E] to-[#D4875E]", info: "18 Гц" },
    { name: "Восстановление", desc: "Глубокие частоты от выгорания", colors: "from-teal-600 to-neutral-800", info: "35 Гц + 5 Гц" },
    { name: "Творчество", desc: "Альфа-волны для идей", colors: "from-[#8AB4C8] to-purple-600", info: "10 Гц" },
    { name: "Дыхание", desc: "Пульсация в ритме 4-7-8", colors: "from-white to-[#8899AA]", info: "Синусоидальный шум" },
    { name: "Лес", desc: "Птицы, ручей, шелест крон", colors: "from-green-600 to-[#D4875E]", info: "Природный шум" },
  ];

  useEffect(() => {
    let t: NodeJS.Timeout | null = null;
    if (workoutActive && activeArea === "movement") { t = setInterval(() => { setWorkoutTime(p => p + 1); const r = movementType === "cycling" ? 0.006 : movementType === "running" ? 0.003 : 0.0012; setWorkoutDistance(p => parseFloat((p + r).toFixed(3))); }, 1000); }
    return () => { if (t) clearInterval(t); };
  }, [workoutActive, movementType, activeArea]);

  useEffect(() => {
    let t: NodeJS.Timeout | null = null;
    if (focusState === "timer" && activeArea === "focus") {
      t = setInterval(() => { setFocusTimeLeft(p => { if (p <= 1) { setFocusState("resting"); navigator.vibrate?.(100); return focusRest * 60; } return p - 1; }); }, 1000);
    } else if (focusState === "resting" && activeArea === "focus") {
      t = setInterval(() => { setFocusTimeLeft(p => { if (p <= 1) { setFocusState("completed"); navigator.vibrate?.(100); return 0; } return p - 1; }); }, 1000);
    }
    return () => { if (t) clearInterval(t); };
  }, [focusState, activeArea, focusRest]);

  const getSubtitles = (sec: number, id: string) => {
    const s = sec;
    if (id.includes("istok_1")) {
      if (s < 10) return "Сегодня ты научишься собирать рассеянное внимание в одну точку. Как превратить туман в луч света.";
      if (s < 25) return "Представь туман. Густой, как молоко. В таком тумане ничего не видно, звуки глохнут.";
      if (s < 45) return "Твои мысли — клочья этого тумана. Внимание рассеяно. Но ориентир — стопы.";
      if (s < 60) return "Положи руку на сердце. Прижми ладонь плотно, чтобы почувствовать тепло. Вдохни глубоко.";
      if (s < 85) return "Внимание — это луч твоего сознания. Ты можешь направить его на звук, на мысль. Сейчас — в центр груди.";
      if (s < 115) return "Вдох. Почувствуй, как грудная клетка поднимается под ладонью. Выдох. Представь, что луч внимания ярче.";
      return "Ты только что зажёг свою первую искру. Твой кристалл рожден. Сделай выдох.";
    }
    if (id.includes("istok_2")) {
      if (s < 15) return "Ты состоишь из трёх уровней: тело, эмоции и мысли. Сегодня ты найдёшь четвёртый — Наблюдателя.";
      if (s < 35) return "Твой кристалл уже существует — как тихий, ясный свет в центре груди.";
      if (s < 55) return "Направь внимание на стопы. Почувствуй их вес, тепло, контакт с полом.";
      return "Осознай: все три уровня — тело, чувства и мысли — это слои. За ними стоит Наблюдатель.";
    }
    if (id.includes("istok_3")) {
      if (s < 15) return "Твой нейтральный свет обретает твой личный, подлинный оттенок.";
      if (s < 35) return "Представь, как кристалл окрашивается в тёплые золотые тона спокойствия.";
      return "Ты сам выбираешь своё состояние прямо сейчас. Сияй изнутри.";
    }
    if (id.includes("istok_4")) {
      if (s < 15) return "Позволь теням напряжения, накопленным обидам и утомлению подняться на поверхность.";
      if (s < 35) return "Дыши сквозь эти тени. Представь, как лучи Кристалла пробивают их насквозь.";
      return "Старые обиды растворяются. Приходит ощущение невероятной лёгкости.";
    }
    if (id.includes("istok_5")) {
      if (s < 15) return "Направь рассеянный свет в тонкий, кристально сфокусированный луч.";
      return "Осознай свою главную еженедельную цель. Направь силу своего намерения прямо туда.";
    }
    if (id.includes("istok_6")) {
      if (s < 15) return "Поздравляю, утренний ритуал собран. Внимание, состояние и вектор слились воедино.";
      return "Кристалл ровно и устойчиво сияет. Ты чувствуешь опору под ногами.";
    }
    if (id.includes("silence_1")) {
      if (s < 15) return "Внутренний шум затихает. Погружайся к алмазному кристаллу сквозь тёплую воду.";
      return "Озеро ума абсолютно прозрачно. Насладись этим пространством чистого безмолвия.";
    }
    if (id.includes("silence_2")) {
      if (s < 15) return "Дыши в ритме мягких набегающих волн. Вдох — живот надувается, выдох — расслабление.";
      return "Челюсть расслаблена, плечи опущены. Напряжение растворяется в покое.";
    }
    if (id.includes("silence_3")) {
      if (s < 15) return "Мысли и эмоции — это всего лишь скользящая рябь на зеркальной поверхности озера.";
      return "Не цепляйся за них. Позволь им проплывать мимо. Кристалл остаётся чистым.";
    }
    if (id.includes("silence_4")) {
      if (s < 15) return "Поблагодари уходящий день за его вызовы и тепло. Собери уроки в кристалл ума.";
      return "Отпускай всё. Время работы завершено. Готовь тело к глубокому сну.";
    }
    if (id.includes("silence_5")) {
      if (s < 15) return "Дыхание, тихие отклики чувств и благодарность сливаются в вечерний ритуал.";
      return "Система перезагружена. Проваливайся в восстановительный сон.";
    }
    if (id.includes("energy_1")) {
      if (s < 15) return "Потри ладони друг о друга, согревая их, и положи на живот. Почувствуй зарождение искры.";
      return "Направляй тепло глубоко в таз и поясницу. Возбуждай скрытые резервы.";
    }
    if (id.includes("energy_2")) {
      if (s < 15) return "Представь золотистую струю тепла, поднимающуюся вверх по позвоночнику на вдохе.";
      return "На выдохе опускай тепло обратно к копчику. Зажимы спины сгорают.";
    }
    if (id.includes("energy_3")) {
      if (s < 15) return "Начнём быстрое ритмичное дыхание Туммо. Резкий вдох, расслабленный выдох.";
      return "Задержка дыхания на выдохе. Ощути огненный кристалл в животе.";
    }
    if (id.includes("energy_4")) {
      if (s < 15) return "Собери разогретое пламя в острый луч силы воли. Направь его в лоб и глаза.";
      return "Почувствуй жгучее желание действовать. Никаких откладываний.";
    }
    if (id.includes("energy_5")) {
      if (s < 15) return "Тепло, задержки Туммо и вектор воли объединяются. Внутреннее солнце взошло.";
      return "Ты полон биологического тонуса и готов свернуть горы.";
    }
    if (id.includes("clarity_1")) {
      if (s < 15) return "Хаос и затуманенность ума начинают отступать. Дыши ровно и смотри на грани сознания.";
      return "Разложи дела по полочкам. Выдели главное. Лишнее исчезнет из памяти.";
    }
    if (id.includes("clarity_2")) {
      if (s < 15) return "Чужие голоса, ожидания, страхи — всё это фоновый шум, забивающий эфир.";
      return "Выключи этот шум. Кристаллизуй внимание на том, что по-настоящему важно.";
    }
    if (id.includes("clarity_3")) {
      if (s < 15) return "Найди ту точку приложения сил в груди, которая даст 90% результата при 10% усилий.";
      return "Точка силы определена. Внимание сжато в лазерный пучок.";
    }
    if (id.includes("clarity_4")) {
      if (s < 15) return "Отпусти судорожный контроль ума. Дай подсознанию пространство для инсайта.";
      return "Озарения приходят сами во время пауз. Замечай приходящие идеи.";
    }
    if (id.includes("clarity_5")) {
      if (s < 15) return "Все четыре грани кристалла созвучны. Проекция планов безупречна.";
      return "Прими сильное решение на основе глубокого телесного отклика. Путь кристально чист.";
    }
    return "Вдох... Выдох... Направляй тепло в кристальный центр. Ты возвращаешься к себе.";
  };

  const handleLaunchLevelPlayer = (level: PracticeLevel, chapter: Chapter) => {
    setSelectedLevel(level); setSelectedChapter(chapter);
    setPlayerSeconds(0);
    const ritualId = LEVEL_TO_RITUAL[level.id];
    const script = ritualId ? getScript(ritualId) : undefined;
    setPlayerMaxSeconds(script ? script.durationSeconds : (level.id.includes("istok") ? 180 : 300));
    setPlayerPlaying(true); setActiveArea("levelPlayer");
  };

  const parseDurationToSeconds = (dur: string): number => {
    const parts = dur.split(":");
    if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    return 300;
  };

  useEffect(() => {
    if (playerPlaying && activeArea === "levelPlayer" && selectedLevel) {
      playSecondsIntervalRef.current = setInterval(() => {
        setPlayerSeconds((prev) => {
          if (prev >= playerMaxSeconds) {
            setPlayerPlaying(false); onLevelComplete(selectedLevel.id);
            navigator.vibrate?.(100);
            onShowToast?.("Практика Завершена", `Ты наполнил кристалл светом: "${selectedLevel.title}".`);
            return playerMaxSeconds;
          }
          const ns = prev + 1;
          setSubtitleText(getSubtitles(ns, selectedLevel.id));
          return ns;
        });
      }, 1000);
    } else { if (playSecondsIntervalRef.current) clearInterval(playSecondsIntervalRef.current); }
    return () => { if (playSecondsIntervalRef.current) clearInterval(playSecondsIntervalRef.current); };
  }, [playerPlaying, activeArea, selectedLevel, playerMaxSeconds]);

  useEffect(() => {
    if (ritualPlayerActive && activeArea === "ritualPlayer" && selectedRitual) {
      const maxSec = parseDurationToSeconds(selectedRitual.duration);
      ritualSecondsIntervalRef.current = setInterval(() => {
        setRitualPlayerSeconds((prev) => {
          if (prev >= maxSec) {
            setRitualPlayerActive(false);
            navigator.vibrate?.(100);
            onShowToast?.("Ритуал Завершён", `«${selectedRitual.title}» — ты молодец.`);
            onLevelComplete(selectedRitual.id);
            return maxSec;
          }
          return prev + 1;
        });
      }, 1000);
    } else { if (ritualSecondsIntervalRef.current) clearInterval(ritualSecondsIntervalRef.current); }
    return () => { if (ritualSecondsIntervalRef.current) clearInterval(ritualSecondsIntervalRef.current); };
  }, [ritualPlayerActive, activeArea, selectedRitual, onLevelComplete, onShowToast]);

  // Ritual Player Audio
  useEffect(() => {
    if (!ritualPlayerActive || !selectedRitual || activeArea !== "ritualPlayer") {
      ttsEngine.stop();
      soundscapeEngine.stopAll();
      ritualSegmentRef.current = -1;
      return;
    }
    const script = getScript(selectedRitual.id);
    if (!script) return;
    const currentSeg = script.segments.find(s => ritualPlayerSeconds >= s.from && ritualPlayerSeconds < s.to);
    if (!currentSeg) return;
    const segIdx = script.segments.indexOf(currentSeg);
    if (segIdx !== ritualSegmentRef.current) {
      ritualSegmentRef.current = segIdx;
      if (currentSeg.voice) ttsEngine.speak(currentSeg.voice);
      if (currentSeg.music) soundscapeEngine.playLayer(currentSeg.music);
    }
  }, [ritualPlayerActive, ritualPlayerSeconds, selectedRitual, activeArea]);

  // Level Player Audio
  useEffect(() => {
    if (!playerPlaying || !selectedLevel || activeArea !== "levelPlayer") {
      ttsEngine.stop();
      soundscapeEngine.stopAll();
      levelSegmentRef.current = -1;
      return;
    }
    const ritualId = LEVEL_TO_RITUAL[selectedLevel.id];
    if (!ritualId) return;
    const script = getScript(ritualId);
    if (!script) return;
    const currentSeg = script.segments.find(s => playerSeconds >= s.from && playerSeconds < s.to);
    if (!currentSeg) return;
    const segIdx = script.segments.indexOf(currentSeg);
    if (segIdx !== levelSegmentRef.current) {
      levelSegmentRef.current = segIdx;
      if (currentSeg.voice) {
        ttsEngine.speak(currentSeg.voice);
        setSubtitleText(currentSeg.voice.text);
      }
      if (currentSeg.music) soundscapeEngine.playLayer(currentSeg.music);
    }
  }, [playerPlaying, playerSeconds, selectedLevel, activeArea]);

  // Gaze Audio
  useEffect(() => {
    if (activeArea !== "gaze" || !glowActive) {
      soundscapeEngine.stopAll();
      return;
    }
    const name = soundscapesList[glowIndex]?.name;
    if (name) soundscapeEngine.playSoundscape(name, glowVolume);
  }, [glowActive, glowIndex, activeArea, glowVolume]);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredPractices = ALL_PRACTICES_LIST.filter(p => {
    const matchesGroup = selectedGroup === 'Все' || p.group === selectedGroup;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  const chapterColors: Record<string, string> = {
    shina_source: "#C9A96E", shina_silence: "#8899AA", shina_energy: "#D4875E", shina_clarity: "#8AB4C8"
  };

  const groupColors: Record<string, string> = {
    "Исток": "#C9A96E", "Тишина": "#8899AA", "Энергия": "#D4875E", "Ясность": "#8AB4C8"
  };

  return (
    <div className="space-y-8 pb-24 text-left animate-[fade-in_0.5s_ease-out]">
      {activeArea === "menu" && (
        <div className="space-y-10">
          {/* HEADER + Favorites button */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-4 h-[1px] bg-white/6" />
                <span className="text-[8px] font-mono tracking-widest text-white/20 uppercase">Путь</span>
              </div>
              <h1 className="text-xl font-display font-light text-white/85 text-aura">Библиотека</h1>
            </div>
            <button onClick={() => setShowFavorites(true)}
              className="relative text-white/40 hover:text-white/60 transition-colors">
              <Bookmark className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-[#C9A96E]/70 rounded-full text-[7px] text-white font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-display font-light text-white/50 text-aura-light">Путь внимания</span>
            <div className="flex-1 h-[1px] bg-white/[0.02]" />
          </div>

          {/* BLOCK 1: Путь внимания — cards, old design */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 snap-x select-none">
            {CHAPTER_CARDS.map((chap, idx) => {
              const targetChapter = idx < CHAPTERS.length ? CHAPTERS[idx] : CHAPTERS[0];
              return (
              <div key={chap.id}
                className={`flex-none w-[220px] snap-start cursor-pointer select-none p-4 pt-5 transition-all duration-300 ${chap.unlocked ? 'hover:bg-white/[0.02]' : ''} relative`}>
                {!chap.unlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 z-10 p-4 text-center">
                    <Lock className="w-4 h-4 text-white/30" />
                    <span className="text-[9px] text-white/40">Ritual Plus</span>
                  </div>
                )}
                <div className={`space-y-2 ${!chap.unlocked ? 'opacity-20' : ''}`}>
                  <h4 className="text-sm font-display font-light text-white/80">{chap.title}</h4>
                  <p className="text-[9px] text-white/30 font-editorial italic leading-relaxed">{chap.desc}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.02]">
                    <span className="text-[8px] font-mono text-white/20">{chap.progress}</span>
                    {chap.unlocked && (
                      <button onClick={() => handleLaunchLevelPlayer(targetChapter.levels[0], targetChapter)}
                        className="text-[8px] text-[#C9A96E]/50 hover:text-[#C9A96E]/80 font-mono tracking-wider transition-colors">
                        Продолжить →
                      </button>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-display font-light text-white/50 text-aura-light">Уникальные ритуалы</span>
            <div className="flex-1 h-[1px] bg-white/[0.02]" />
          </div>

          {/* BLOCK 2: Уникальные ритуалы — 2×2, old design floating */}
          <div className="grid grid-cols-2 gap-0">
            <div onClick={() => onLaunchRitual("square_breath", "Исток")}
              className="group cursor-pointer py-4 pr-3 space-y-2 border-r border-b border-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-[3px] h-3 rounded-full bg-[#C9A96E]/30" />
                <span className="text-[8px] font-mono text-[#C9A96E]/40 uppercase tracking-wider">Дыхание</span>
              </div>
              <h4 className="text-sm font-display font-light text-white/70 group-hover:text-white/90 transition-colors text-aura-light">Квадратное дыхание</h4>
              <p className="text-[9px] text-white/20 font-editorial italic">breath ritual</p>
            </div>
            <div onClick={() => setActiveArea("focus")}
              className="group cursor-pointer py-4 pl-3 space-y-2 border-b border-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-[3px] h-3 rounded-full bg-[#8AB4C8]/30" />
                <span className="text-[8px] font-mono text-[#8AB4C8]/40 uppercase tracking-wider">Ясность</span>
              </div>
              <h4 className="text-sm font-display font-light text-white/70 group-hover:text-white/90 transition-colors text-aura-light">Таймер Помодоро</h4>
              <p className="text-[9px] text-white/20 font-editorial italic">focus timer</p>
            </div>
            <div onClick={() => setActiveArea("movement")}
              className="group cursor-pointer py-4 pr-3 space-y-2 border-r border-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-[3px] h-3 rounded-full bg-[#D4875E]/30" />
                <span className="text-[8px] font-mono text-[#D4875E]/40 uppercase tracking-wider">Энергия</span>
              </div>
              <h4 className="text-sm font-display font-light text-white/70 group-hover:text-white/90 transition-colors text-aura-light">Прогулка и Ходьба</h4>
              <p className="text-[9px] text-white/20 font-editorial italic">mindful movement</p>
            </div>
            <div onClick={() => { setGlowActive(false); setActiveArea("gaze"); }}
              className="group cursor-pointer py-4 pl-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-[3px] h-3 rounded-full bg-[#8899AA]/30" />
                <span className="text-[8px] font-mono text-[#8899AA]/40 uppercase tracking-wider">Тишина</span>
              </div>
              <h4 className="text-sm font-display font-light text-white/70 group-hover:text-white/90 transition-colors text-aura-light">Свечение & Звук</h4>
              <p className="text-[9px] text-white/20 font-editorial italic">soundscapes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-display font-light text-white/50 text-aura-light">Поиск практик</span>
            <div className="flex-1 h-[1px] bg-white/[0.02]" />
          </div>

          {/* BLOCK 3: Поиск + фильтр — floating old style */}
          <div className="space-y-4">
            <div className="relative">
              <input type="text" placeholder="Поиск по названию или фокусу..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-transparent border-b border-white/[0.06] text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all font-sans" />
              <Search className="w-3 h-3 text-white/20 absolute left-0 top-3.5" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-0 top-2.5 text-[9px] text-white/20 hover:text-white/40">Сброс</button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 snap-x">
              {GROUP_PILLS.map((pill) => (
                <button key={pill.label} onClick={() => setSelectedGroup(pill.label)}
                  className={`flex-none snap-start text-[9px] font-mono tracking-wider transition-all px-3 py-1.5 ${
                    selectedGroup === pill.label ? "bg-white/8 text-white rounded-full" : "text-white/30 hover:bg-white/[0.03] rounded-full"
                  }`}>
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* BLOCK 4: Список практик — old design minimal */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Практики ({filteredPractices.length})</span>
              {selectedGroup !== 'Все' && <span className="text-[9px] font-mono text-white/15">{selectedGroup}</span>}
            </div>
            <div className="space-y-0">
              {filteredPractices.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-xs text-white/20 font-editorial italic">Практики не найдены.</span>
                </div>
              ) : (
                filteredPractices.map((practice) => {
                  const isFav = favorites.includes(practice.id);
                  return (
                    <div key={practice.id}
                      className="flex items-center justify-between py-3 border-b border-white/[0.01] last:border-0 group">
                      <div onClick={() => onLaunchRitual(practice.id, practice.group)}
                        className="flex-1 cursor-pointer space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-1 h-1 rounded-full flex-shrink-0 ${isFav ? 'bg-[#C9A96E]' : 'bg-white/10'}`} />
                          <span className="text-[11px] text-white/60 group-hover:text-white/80 transition-colors">{practice.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[8px] font-mono text-white/15 ml-3">
                          <span>{practice.group}</span>
                          <span>•</span>
                          <span>{practice.duration}</span>
                          <span>•</span>
                          <span>{practice.category}</span>
                        </div>
                      </div>
                      <button onClick={() => handleToggleFavorite(practice.id)}
                        className={`text-white/20 hover:text-[#C9A96E]/60 transition-colors ${isFav ? 'text-[#C9A96E]/50' : ''}`}>
                        <Bookmark className="w-3 h-3" style={{ fill: isFav ? 'currentColor' : 'none' }} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Favorites Sheet */}
      {showFavorites && (
        <div className="fixed inset-0 bg-[#07070A]/95 backdrop-blur-2xl z-40 flex items-end justify-center">
          <div className="absolute inset-0" onClick={() => setShowFavorites(false)} />
          <div className="w-full max-w-md p-6 pb-12 flex flex-col space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-base font-display font-light text-white/80 text-aura">Избранное</h3>
                <span className="text-[9px] text-white/30 font-mono uppercase tracking-widest">{favorites.length} практик</span>
              </div>
              <button onClick={() => setShowFavorites(false)}
                className="text-white/20 hover:text-white/40 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-0">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-xs text-white/20 font-editorial italic">В избранном пусто.</span>
                </div>
              ) : (
                favorites.map((favId) => {
                  const practice = ALL_PRACTICES_LIST.find(p => p.id === favId);
                  if (!practice) return null;
                  return (
                    <div key={practice.id} className="flex items-center justify-between py-4 border-b border-white/[0.01] last:border-0">
                      <div onClick={() => { setShowFavorites(false); onLaunchRitual(practice.id, practice.group); }} className="flex-1 cursor-pointer">
                        <span className="text-xs text-white/70 block">{practice.name}</span>
                        <span className="text-[8px] font-mono text-white/20">{practice.group} • {practice.duration}</span>
                      </div>
                      <button onClick={() => handleToggleFavorite(practice.id)} className="text-[9px] text-white/20 hover:text-rose-400/60 font-mono">Удалить</button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOVEMENT */}
      {activeArea === "movement" && (
        <div className="space-y-6 text-center px-2 animate-[fade-in_0.4s_ease-out]">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-display font-light text-white/80 text-aura">
              <Dumbbell className="inline w-4 h-4 text-[#D4875E] mr-2" />Осознанное Движение
            </h2>
            <button onClick={() => { setWorkoutActive(false); setActiveArea("menu"); }}
              className="text-[10px] text-white/30 hover:text-white/50 transition-colors">Назад</button>
          </div>
          {movementState === "setup" && (
            <div className="space-y-6 py-4">
              <p className="text-xs text-white/30 text-left leading-relaxed text-aura-light">
                Ритуал возвращает рассеянное внимание в тело через механическое движение.
              </p>
              <div className="flex gap-2 justify-center">
                {["walking", "running", "cycling"].map((type) => (
                  <button key={type} onClick={() => setMovementType(type as any)}
                    className={`px-5 py-2 text-[10px] font-mono uppercase tracking-wider transition rounded-full ${
                      movementType === type ? "bg-white/8 text-white" : "text-white/30 hover:bg-white/[0.03]"
                    }`}>
                    {type === "walking" ? "🚶 Ходьба" : type === "running" ? "🏃 Бег" : "🚴 Вело"}
                  </button>
                ))}
              </div>
              <div className="py-6 text-center space-y-4">
                <Sparkles className="w-5 h-5 text-[#D4875E]/50 mx-auto animate-drift" />
                <h4 className="text-base font-display font-light text-white/70 text-aura">Готов вернуть внимание к телу?</h4>
                <button onClick={() => { setWorkoutDistance(0); setWorkoutTime(0); setWorkoutActive(true); setMovementState("active"); }}
                  className="w-full h-12 bg-white/[0.03] hover:bg-white/[0.06] text-white/70 font-light rounded-full text-xs tracking-wider transition-all active:scale-[0.98] border border-white/[0.03]">
                  Начать тренировку
                </button>
              </div>
              <div className="h-px bg-white/[0.01]" />
              <div className="space-y-3">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-[9px] font-mono uppercase tracking-widest text-white/20">История тренировок</h3>
                  <button onClick={() => setShowHistoryModal(true)}
                    className="text-[9px] text-[#D4875E]/50 hover:text-[#D4875E]/70 transition-colors flex items-center gap-1">
                    <Plus size={10} /> Добавить
                  </button>
                </div>
                <div className="space-y-0">
                  {movementHistory.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-left py-3 border-b border-white/[0.02] last:border-b-0">
                      <div>
                        <span className="text-[9px] font-mono text-white/20">{item.date}</span>
                        <h4 className="text-sm font-light text-white/60 text-aura-light">{item.type}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-light text-white/60">{item.distance}</span>
                        <p className="text-[10px] text-white/20">{item.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {movementState === "active" && (
            <div className="space-y-6 py-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-widest text-[#D4875E]/60 uppercase animate-pulse">ТРЕНИРОВКА</span>
                <span className="text-[10px] text-white/20 block capitalize">Тип: {movementType}</span>
              </div>
              <BiometricWorkoutVisualizer isActive={workoutActive} type={movementType} timePassed={workoutTime} distance={workoutDistance} />
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="text-center">
                  <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/15">Дистанция</span>
                  <h1 className="text-xl font-display font-light text-white/60 mt-1">{workoutDistance.toFixed(2)}</h1>
                  <span className="text-[7px] font-mono text-white/12">км</span>
                </div>
                <div className="w-px h-8 bg-white/4" />
                <div className="text-center">
                  <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/15">Время</span>
                  <h1 className="text-xl font-display font-light text-white/60 mt-1">
                    {Math.floor(workoutTime / 60)}:{(workoutTime % 60).toString().padStart(2, "0")}
                  </h1>
                  <span className="text-[7px] font-mono text-white/12">мин</span>
                </div>
                <div className="w-px h-8 bg-white/4" />
                <div className="text-center">
                  <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/15">Темп</span>
                  <h1 className="text-xl font-display font-light text-white/60 mt-1">
                    {workoutTime > 0 ? (workoutTime / 60 / (workoutDistance || 0.01)).toFixed(1) : "--"}
                  </h1>
                  <span className="text-[7px] font-mono text-white/12">мин/км</span>
                </div>
              </div>
              <div className="flex gap-4 max-w-sm mx-auto pt-2">
                <button onClick={() => setWorkoutActive(!workoutActive)}
                  className="flex-1 h-10 bg-white/[0.02] hover:bg-white/[0.04] rounded-full text-[10px] text-white/50 transition-colors">
                  {workoutActive ? "Пауза" : "Продолжить"}
                </button>
                <button onClick={() => { setWorkoutActive(false); setMovementState("history"); }}
                  className="flex-1 h-10 bg-white/[0.04] hover:bg-white/[0.08] rounded-full text-[10px] text-white/60 transition-all active:scale-[0.98]">
                  Завершить
                </button>
              </div>
            </div>
          )}
          {movementState === "history" && (
            <div className="space-y-6 py-6 text-center">
              <Award className="w-10 h-10 text-[#D4875E]/40 mx-auto animate-drift" />
              <h2 className="text-xl font-display font-light text-white/70 text-aura">Тренировка завершена</h2>
              <p className="text-xs text-white/30">Активность записана в твой профиль.</p>
              <div className="max-w-md mx-auto py-4 space-y-4">
                <div className="h-px bg-white/[0.02]" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-white/20 font-mono">ДИСТАНЦИЯ</span>
                    <h3 className="text-lg font-light text-white/60 mt-1">{workoutDistance.toFixed(2)} км</h3>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/20 font-mono">ВРЕМЯ</span>
                    <h3 className="text-lg font-light text-white/60 mt-1">{Math.ceil(workoutTime / 60)} мин</h3>
                  </div>
                </div>
              </div>
              <button onClick={() => setMovementState("setup")}
                className="w-full max-w-sm h-12 bg-white/[0.03] hover:bg-white/[0.06] text-white/60 font-light rounded-full text-xs tracking-wider transition-all active:scale-[0.98] border border-white/[0.03]">
                Вернуться к выбору
              </button>
            </div>
          )}
          {showHistoryModal && (
            <div className="fixed inset-0 z-50 bg-[#07070A]/90 backdrop-blur-2xl flex items-center justify-center p-6">
              <div className="max-w-sm w-full space-y-4 text-left">
                <h3 className="text-base font-display font-light text-white/80 text-aura">Ручной ввод</h3>
                <div className="h-px bg-white/[0.02]" />
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono text-white/25 uppercase block mb-1">Тип</label>
                    <select value={manualType} onChange={(e) => setManualType(e.target.value)}
                      className="w-full h-11 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white text-xs px-3 outline-none">
                      <option className="bg-[#07070A]" value="Ходьба">🚶 Ходьба</option>
                      <option className="bg-[#07070A]" value="Бег">🏃 Бег</option>
                      <option className="bg-[#07070A]" value="Велосипед">🚴 Велосипед</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/25 uppercase block mb-1">Дистанция (км)</label>
                    <input type="text" placeholder="4.2" value={manualDist} onChange={(e) => setManualDistance(e.target.value)}
                      className="w-full h-11 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white text-xs px-3 outline-none placeholder:text-white/10" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/25 uppercase block mb-1">Длительность (мин)</label>
                    <input type="text" placeholder="30" value={manualDur} onChange={(e) => setManualDuration(e.target.value)}
                      className="w-full h-11 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white text-xs px-3 outline-none placeholder:text-white/10" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowHistoryModal(false)}
                    className="flex-1 h-10 border border-white/[0.05] rounded-xl text-[10px] text-white/30 transition-colors">Отмена</button>
                  <button onClick={() => { if (!manualDist || !manualDur) return; setMovementHistory(p => [{ id: Date.now().toString(), date: "Сегодня", type: manualType, distance: `${manualDist} км`, duration: `${manualDur} мин` }, ...p]); setManualDistance(""); setManualDuration(""); setShowHistoryModal(false); }}
                    className="flex-1 h-10 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-[10px] text-white/60 transition-colors">Записать</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOCUS */}
      {activeArea === "focus" && (
        <div className="space-y-6 text-center px-2 animate-[fade-in_0.4s_ease-out]">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-display font-light text-white/80 text-aura">
              <Sparkles className="inline w-4 h-4 text-[#8AB4C8] mr-2" />Фокус Внимания
            </h2>
            <button onClick={() => setActiveArea("menu")}
              className="text-[10px] text-white/30 hover:text-white/50 transition-colors">Назад</button>
          </div>
          {focusState === "setup" && (<div className="space-y-6 py-4 text-left">
              <p className="text-xs text-white/30 leading-relaxed text-aura-light">
                Не просто Pomodoro-таймер, а инструмент прокачки префронтальной коры.
              </p>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/25 uppercase tracking-widest pl-1">Что кристаллизуешь?</label>
                <input type="text" placeholder="Например, написать статью" value={focusTask} onChange={(e) => setFocusTask(e.target.value)}
                  className="w-full h-12 bg-white/[0.02] border border-white/[0.05] focus:border-[#8AB4C8]/20 rounded-2xl px-4 text-sm text-white/70 font-light placeholder:text-white/10 outline-none" />
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/50">Время работы</span>
                  <span className="text-xs font-mono text-[#8AB4C8]/70">{focusDuration} мин</span>
                </div>
                <input type="range" min="5" max="60" step="5" value={focusDuration} onChange={(e) => setFocusDuration(parseInt(e.target.value))}
                  className="w-full accent-[#8AB4C8] opacity-40" />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/50">Отдых</span>
                  <span className="text-xs font-mono text-[#8AB4C8]/70">{focusRest} мин</span>
                </div>
                <input type="range" min="1" max="15" step="1" value={focusRest} onChange={(e) => setFocusRest(parseInt(e.target.value))}
                  className="w-full accent-[#8AB4C8] opacity-40" />
              </div>
              <button onClick={() => { if (!focusTask.trim()) return; setFocusDistractions(0); setCheatedFlag(false); setFocusTimeLeft(focusDuration * 60); setFocusState("timer"); }}
                disabled={!focusTask.trim()}
                className="w-full h-12 bg-white/[0.03] hover:bg-white/[0.06] text-white/60 font-light rounded-full text-xs tracking-wider transition-all active:scale-[0.98] border border-white/[0.03] disabled:opacity-20">
                Начать фокус-сессию
              </button>
            </div>
          )}
          {focusState === "timer" && (<div className="space-y-6 py-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-widest text-[#8AB4C8]/60 uppercase animate-pulse">Концентрация</span>
                <h4 className="text-sm font-display font-light text-white/70 text-aura">«{focusTask}»</h4>
              </div>
              <div className="relative py-4">
                <BreathingMandala isActive={true} timeLeft={focusTimeLeft} durationSeconds={focusDuration * 60} focusTask={focusTask} />
                <div className="absolute top-[108px] left-1/2 -translate-x-1/2 text-center pointer-events-none">
                  <h1 className="text-2xl font-display font-light text-white/80 tracking-widest leading-none text-aura">
                    {Math.floor(focusTimeLeft / 60).toString().padStart(2, "0")}:{(focusTimeLeft % 60).toString().padStart(2, "0")}
                  </h1>
                  <span className="text-[7px] font-mono text-white/15 uppercase block tracking-wider mt-0.5">осталось</span>
                </div>
              </div>
              <div className="space-y-2">
                <button onClick={() => setFocusDistractions((prev) => prev + 1)}
                  className="w-full max-w-sm h-10 bg-white/[0.02] hover:bg-white/[0.04] text-[#FF6B6B]/60 rounded-2xl flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all text-xs">
                  <Bell className="w-3 h-3" /> Я отвлекся ({focusDistractions})
                </button>
              </div>
              <div className="flex gap-4 max-w-sm mx-auto pt-2">
                <button onClick={() => setFocusState("completed")}
                  className="flex-1 h-10 bg-white/[0.02] hover:bg-white/[0.04] rounded-full text-[10px] text-white/40 transition-colors">Завершить</button>
                <button onClick={() => setCheatedFlag(true)}
                  className="flex-1 h-10 bg-white/[0.02] hover:bg-white/[0.04] rounded-full text-[10px] text-white/40 transition-colors">Пропустить</button>
              </div>
            </div>
          )}
          {focusState === "resting" && (<div className="space-y-6 py-4 text-center">
              <h3 className="text-base font-display font-light text-white/70 text-aura">Перерыв</h3>
              <h1 className="text-3xl font-display font-light text-white/80 text-aura">
                {Math.floor(focusTimeLeft / 60).toString().padStart(2, "0")}:{(focusTimeLeft % 60).toString().padStart(2, "0")}
              </h1>
              <button onClick={() => setFocusState("completed")}
                className="w-full max-w-sm h-10 bg-white/[0.03] hover:bg-white/[0.06] text-white/50 font-light rounded-full text-xs transition-all active:scale-[0.98]">Завершить перерыв</button>
            </div>
          )}
          {focusState === "completed" && (<div className="space-y-6 py-6 text-center">
              <Award className="w-10 h-10 text-[#8AB4C8]/40 mx-auto animate-drift" />
              <h2 className="text-xl font-display font-light text-white/70 text-aura">Сессия завершена</h2>
              <p className="text-xs text-white/30">Отвлечений: {focusDistractions}{cheatedFlag ? " (с читом)" : ""}</p>
              <button onClick={() => { setFocusState("setup"); setFocusTask(""); }}
                className="w-full max-w-sm h-10 bg-white/[0.03] hover:bg-white/[0.06] text-white/50 font-light rounded-full text-xs transition-all active:scale-[0.98]">Новая сессия</button>
            </div>
          )}
        </div>
      )}

      {/* GAZE */}
      {activeArea === "gaze" && (
        <div className="space-y-6 text-center px-2 animate-[fade-in_0.4s_ease-out]">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-display font-light text-white/80 text-aura">
              <Volume2 className="inline w-4 h-4 text-[#8899AA] mr-2" />Аудио Свечение
            </h2>
            <button onClick={() => { setGlowActive(false); setActiveArea("menu"); soundscapeEngine.stopAll(); }}
              className="text-[10px] text-white/30 hover:text-white/50 transition-colors">Назад</button>
          </div>
          <BrainwaveAudioSpectrum isActive={glowActive} glowIndex={glowIndex} />
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 snap-x">
            {soundscapesList.map((s, i) => (
              <button key={i} onClick={() => { setGlowIndex(i); setGlowActive(true); }}
                className={`flex-none px-4 py-2 rounded-full text-[9px] font-mono tracking-wider transition-all snap-start ${
                  glowIndex === i && glowActive ? "bg-white/8 text-white" : "text-white/30 hover:bg-white/[0.03]"
                }`}>{s.name}</button>
            ))}
          </div>
          <div className="space-y-1 text-left max-w-sm mx-auto w-full">
            <h3 className="text-sm font-display font-light text-white/70 text-aura">{soundscapesList[glowIndex].name}</h3>
            <p className="text-[10px] text-white/30 leading-relaxed">{soundscapesList[glowIndex].desc}</p>
            <p className="text-[8px] font-mono text-white/15 mt-1">{soundscapesList[glowIndex].info}</p>
          </div>
          <button onClick={() => setGlowActive(!glowActive)}
            className="h-10 px-6 bg-white/[0.03] hover:bg-white/[0.06] rounded-full text-[10px] text-white/50 transition-all active:scale-[0.98] border border-white/[0.03]">
            {glowActive ? "Пауза" : "Запустить волну"}
          </button>
        </div>
      )}

      {/* LEVEL PLAYER */}
      {activeArea === "levelPlayer" && selectedLevel && selectedChapter && (
        <div className="space-y-8 text-center px-2 animate-[fade-in_0.4s_ease-out]">
          <div className="flex justify-between items-center w-full">
            <button onClick={() => { setPlayerPlaying(false); setActiveArea("menu"); }}
              className="text-[10px] text-white/30 hover:text-white/50 transition-colors">Назад</button>
            <h2 className="text-sm font-display font-light text-white/70 text-aura">{selectedChapter.title}</h2>
            <div className="w-10" />
          </div>
          <div className="relative py-8 flex flex-col items-center">
            <div className="absolute w-48 h-48 rounded-full animate-pulse-aura pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${chapterColors[selectedChapter.id] || "#C9A96E"}08 0%, transparent 70%)` }} />
            <div className="relative flex flex-col items-center">
              <AudioLevelSpectrogram isPlaying={playerPlaying} color={chapterColors[selectedChapter.id] || "#C9A96E"} />
              <button onClick={() => setPlayerPlaying(!playerPlaying)}
                className="w-16 h-16 rounded-full bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition-all active:scale-90 mt-6 border border-white/[0.03]">
                {playerPlaying ? <Pause size={20} className="text-white/50" /> : <Play size={20} className="text-white/50 ml-0.5" />}
              </button>
            </div>
            <div className="space-y-2 mt-6">
              <h3 className="text-base font-display font-light text-white/80 text-aura">{selectedLevel.title}</h3>
              <p className="text-[10px] text-white/20 font-editorial italic max-w-xs mx-auto">{selectedLevel.metaphor}</p>
            </div>
            {subtitleText && (
              <div className="mt-6 max-w-sm mx-auto">
                <p className="text-xs text-white/35 leading-relaxed font-editorial italic text-aura-light animate-[fade-in_0.3s_ease-out]">
                  «{subtitleText}»
                </p>
              </div>
            )}
            <div className="w-full max-w-xs mt-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[7px] font-mono text-white/15">{Math.floor(playerSeconds / 60)}:{(playerSeconds % 60).toString().padStart(2, "0")}</span>
                <div className="flex-1 h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(playerSeconds / playerMaxSeconds) * 100}%`, backgroundColor: chapterColors[selectedChapter.id] || "#C9A96E", opacity: 0.4 }} />
                </div>
                <span className="text-[7px] font-mono text-white/15">{Math.floor(playerMaxSeconds / 60)}:{(playerMaxSeconds % 60).toString().padStart(2, "0")}</span>
              </div>
            </div>
          </div>
          <div className="py-4 border-t border-white/[0.02]">
            <p className="text-[10px] text-white/20 font-editorial italic leading-relaxed text-aura-light">{selectedLevel.result}</p>
          </div>
        </div>
      )}

      {/* RITUAL PLAYER */}
      {activeArea === "ritualPlayer" && selectedRitual && (
        <div className="space-y-6 text-center px-2 animate-[fade-in_0.4s_ease-out]">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <span className="w-[3px] h-3 rounded-full"
                style={{ backgroundColor: groupColors[selectedRitual.visualType === "focus" ? "Ясность" : selectedRitual.visualType === "breathing" ? "Энергия" : selectedRitual.visualType === "journal" ? "Тишина" : "Исток"] || "#C9A96E" }} />
              <span className="text-[8px] font-mono uppercase tracking-wider text-white/25">{selectedRitual.category}</span>
            </div>
            <button onClick={() => { setRitualPlayerActive(false); setActiveArea("menu"); }}
              className="text-[10px] text-white/30 hover:text-white/50 transition-colors">Назад</button>
          </div>

          <div className="relative py-4 flex flex-col items-center">
            {selectedRitual.visualType === "breathing" || selectedRitual.visualType === "focus" ? (
              <RitualBreathingCircle isActive={ritualPlayerActive} color={groupColors[selectedRitual.visualType === "focus" ? "Ясность" : "Энергия"] || "#C9A96E"} />
            ) : (
              <RitualSpectrogramPlayer isActive={ritualPlayerActive} color={groupColors[selectedRitual.visualType === "journal" ? "Тишина" : "Исток"] || "#C9A96E"} />
            )}

            <div className="space-y-1 mt-4">
              <h3 className="text-base font-display font-light text-white/80 text-aura">{selectedRitual.title}</h3>
              <p className="text-[10px] text-white/20 font-editorial italic max-w-xs mx-auto">{selectedRitual.description}</p>
            </div>
          </div>

          <button onClick={() => setRitualPlayerActive(!ritualPlayerActive)}
            className="w-16 h-16 mx-auto rounded-full bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition-all active:scale-90 border border-white/[0.03]">
            {ritualPlayerActive ? <Pause size={20} className="text-white/50" /> : <Play size={20} className="text-white/50 ml-0.5" />}
          </button>

          <div className="w-full max-w-xs mx-auto mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[7px] font-mono text-white/15">
                {Math.floor(ritualPlayerSeconds / 60)}:{(ritualPlayerSeconds % 60).toString().padStart(2, "0")}
              </span>
              <div className="flex-1 h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(ritualPlayerSeconds / parseDurationToSeconds(selectedRitual.duration)) * 100}%`,
                    backgroundColor: groupColors[selectedRitual.visualType === "focus" ? "Ясность" : selectedRitual.visualType === "breathing" ? "Энергия" : selectedRitual.visualType === "journal" ? "Тишина" : "Исток"] || "#C9A96E", opacity: 0.4 }} />
              </div>
              <span className="text-[7px] font-mono text-white/15">{selectedRitual.duration}</span>
            </div>
          </div>

          <div className="py-3 border-t border-white/[0.02] max-w-xs mx-auto">
            <p className="text-[10px] text-white/20 font-editorial italic leading-relaxed text-aura-light">{selectedRitual.description}</p>
          </div>

          <button onClick={() => { setRitualPlayerActive(false); setActiveArea("menu"); }}
            className="w-full max-w-xs h-10 bg-white/[0.03] hover:bg-white/[0.06] text-white/50 font-light rounded-full text-xs tracking-wider transition-all active:scale-[0.98] border border-white/[0.03]">
            Завершить
          </button>
        </div>
      )}
    </div>
  );
};
