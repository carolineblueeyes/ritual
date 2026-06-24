export interface UserProfile {
  name: string;
  isSubscribed: boolean;
  subscriptionExpiry: string | null;
  activeBg: "water" | "sky" | "aurora" | "mystic";
  xp: number;
  streak: number;
  totalRitualsCount: number;
  isCustomRingPreordered: boolean;
  ringOrderCode: string | null;
  ringMaterial: "matte_black" | "glow_obsidian";
  ringEngraving: string;
  ringSize: number | null;
  ringBatteryCharge: number;
  isAppleHealthConnected: boolean;
  isGoogleFitConnected: boolean;
  isHealthConnectConnected: boolean;
  isCoreRingConnected: boolean;
  weeklyGoal: number; // e.g. 5
  achievements: string[]; // list of unlocked achievement IDs
}

export type BiometricStatus = "сияешь" | "баланс" | "напряжение" | "перегруз" | "нет данных";

export interface RitualHealthMetrics {
  score: number; // 0 - 100
  status: BiometricStatus;
  statusText: string;
  hrv: number; // ms
  sleepDuration: number; // hours
  restingHeartRate: number; // bpm
  activitySteps: number; // steps
  bodyTemperature: number; // °C
  spo2: number; // %
  respirationRate: number; // breaths per minute
  energyLevel: number; // 0 - 100
  stressLevel: number; // 0 - 100
}

export interface PracticeImpact {
  ritualId: string;
  ritualTitle: string;
  group: string;
  date: string;
  effects: {
    metric: keyof RitualHealthMetrics;
    change: number; // absolute change
    label: string;
  }[];
}

export interface RitualActivityLog {
  id: string;
  ritualId: string;
  title: string;
  group: "Исток" | "Тишина" | "Энергия" | "Ясность";
  date: string; // ISO String
  duration: number; // seconds
  selectedState?: string;
  cheated?: boolean;
  distractions?: number;
  distanceKm?: number;
  avgPace?: string;
  notes?: string;
  manual?: boolean;
}

export interface DayScheduleSlot {
  id: string;
  time: string;
  title: string;
  ritualId: string | null;
  completed: boolean;
  color: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  imageQuery: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedCondition: string;
}

export interface PracticeItem {
  id: string;
  name: string;
  group: 'Исток' | 'Тишина' | 'Энергия' | 'Ясность';
  duration: string;
  category: string;
  isFree?: boolean;
  visualType?: "breathing" | "spectrogram" | "journal" | "focus";
}

export interface PracticeLevel {
  id: string;
  number: number;
  title: string;
  metaphor: string;
  result: string;
  durationText: string;
  isPremium: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  metaphor: string;
  result: string;
  color: string;
  levels: PracticeLevel[];
}

// ===== Типы для скриптов ритуалов (из документа RITUAL.txt) =====

export type PhaseType = 'пролог' | 'вступление' | 'практика' | 'микро_чек' | 'инсайт' | 'ключевая_фраза' | 'задание' | 'закрытие';

export interface VoiceInstruction {
  text: string;
  tone?: 'мягкий' | 'уверенный' | 'глубокий' | 'нейтральный' | 'энергичный' | 'шёпот';
  tempo?: 'медленный' | 'средний' | 'быстрый';
}

export interface MusicLayer {
  padFreq?: number;
  instrument?: string;
  volume?: number;
  binauralBeat?: { left: number; right: number };
  isochronicTone?: number;
}

export interface HapticSpec {
  pattern: 'continuous' | 'pulse' | 'wave' | 'chime' | 'none';
  intensity: number;
  frequency?: number;
}

export interface RingTriggerCondition {
  metric: 'hrv' | 'heartRate' | 'stressLevel' | 'kgr' | 'sleepDuration';
  operator: 'lt' | 'gt' | 'between';
  value: number | [number, number];
}

export interface RingTrigger {
  type: 'hard' | 'soft';
  condition: RingTriggerCondition;
  hapticPattern: 'calm_pulse' | 'tense_tap' | 'overload_silent' | 'completion_chime';
}

export interface ScriptSegment {
  phase: PhaseType;
  from: number;
  to: number;
  voice?: VoiceInstruction;
  music?: MusicLayer;
  haptic?: HapticSpec;
  ringTrigger?: RingTrigger;
}

export interface HealthImpact {
  metric: keyof RitualHealthMetrics;
  expectedChange: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface PostRitualLink {
  ritualId: string;
  group: 'Исток' | 'Тишина' | 'Энергия' | 'Ясность';
  reason: string;
}

export interface RitualScript {
  ritualId: string;
  group: 'Исток' | 'Тишина' | 'Энергия' | 'Ясность';
  title: string;
  durationSeconds: number;
  category: string;
  scientificBase: string;
  howItWorks: string;
  segments: ScriptSegment[];
  expectedImpacts: HealthImpact[];
  postLinks: PostRitualLink[];
  shortVersion?: Omit<RitualScript, 'shortVersion'>;
}

export type GroupName = 'Исток' | 'Тишина' | 'Энергия' | 'Ясность';
