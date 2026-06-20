export type HealthState = 'Shining' | 'Balance' | 'Tension' | 'Overload' | 'NoData';

export type PracticeGroupType = 'Исток' | 'Тишина' | 'Энергия' | 'Ясность';

export interface Practice {
  id: string;
  name: string;
  group: PracticeGroupType;
  duration: string; // e.g. "5:30" or "4:30"
  category: string;
  scientificBase: string;
  howItWorks: string;
  result: string;
  isUnlocked: boolean; // True for Исток, or if user is Ritual Plus
}

export interface UserStats {
  daysPractice: number;
  ritualsCompleted: number;
  daysStreak: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconType: string; // e.g. "spark", "ring", "points", "sevenDots", "thirtyDots", "runner", "crystalOne", "crystalThree", "focus", "heart", "road", "crystalRow"
  unlocked: boolean;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface RingSetup {
  shell: 'Matte Titanium' | 'Glow Obsidian';
  engraving: string;
}

export interface ActivityLog {
  id: string;
  type: 'walk' | 'run' | 'bike' | 'focus' | 'audio' | 'breathing';
  date: string;
  durationMinutes: number;
  distanceKm?: number;
  avgPace?: string;
  selectedState?: HealthState;
  cheated?: boolean;
}

export interface NavigatorRecomendation {
  state: HealthState;
  phrase: string;
  reason: string;
  ritualName: string;
  ritualGroup: PracticeGroupType;
  duration: string;
  instructions: string;
}

export interface PathwayLevel {
  id: string;
  chapterIndex: number; // 1, 2, 3, 4
  levelIndex: number; // 1 to 5 (or 6)
  name: string;
  description: string;
  duration: string;
  group: PracticeGroupType;
  overallIndex: number; // 0 to 20
}

