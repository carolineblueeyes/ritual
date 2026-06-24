import React, { useState } from "react";
import { Sparkles, Mic, Compass, Trophy, User, BookOpen } from "lucide-react";
import { UserProfile, RitualHealthMetrics, DayScheduleSlot } from "./types";
import { Onboarding } from "./components/Onboarding";
import { VoiceAssistant } from "./components/VoiceAssistant";
import { TodayTab } from "./components/TodayTab";
import { PracticeTab } from "./components/PracticeTab";
import { ProgressTab } from "./components/ProgressTab";
import { ProfileTab } from "./components/ProfileTab";
import { CHAPTERS, RITUALS_DATA } from "./data";
import { GlobalVisualBackdrop } from "./components/PracticeVisualizers";
import { HealthService } from "./services/HealthService";

interface HealthMonitorCard {
  id: string;
  icon: string;
  label: string;
  metricKey: keyof RitualHealthMetrics;
  unit: string;
  trend: string;
  status: string;
  description: string;
  graphData: number[];
}

const HEALTH_MONITOR_CARDS: HealthMonitorCard[] = [
  { id: "sleep", icon: "🛌", label: "Сон", metricKey: "sleepDuration", unit: "ч", trend: "+0.2ч", status: "норма", description: "Глубокие фазы сна восстанавливают тело и разум. Оптимальная норма — 7–9 часов.", graphData: [7, 6.5, 8.2, 5.5, 7.8, 8.5, 6.8] },
  { id: "activity", icon: "🏃", label: "Активность", metricKey: "activitySteps", unit: "шагов", trend: "+22%", status: "выше нормы", description: "Движение стимулирует кровообращение, снижает кортизол и повышает энергию.", graphData: [8, 4, 12, 10, 15, 11.2, 9] },
  { id: "hrv", icon: "🧠", label: "ВСР", metricKey: "hrv", unit: "мс", trend: "+15%", status: "хорошо", description: "Вариабельность ритма — показатель гибкости нервной системы. Высокий ВСР = восстановление.", graphData: [50, 40, 65, 45, 90, 72, 85] },
  { id: "pulse", icon: "❤️", label: "Пульс покоя", metricKey: "restingHeartRate", unit: "уд/мин", trend: "-4%", status: "в норме", description: "Низкий пульс покоя — признак тренированности сердца и низкого стресса.", graphData: [68, 72, 65, 63, 62, 64, 60] },
  { id: "respiration", icon: "🌬️", label: "Дыхание", metricKey: "respirationRate", unit: "вд/мин", trend: "14", status: "ровное", description: "Частота дыхания отражает уровень стресса и расслабления. 12–16 вдохов — здоровая норма.", graphData: [16, 15, 14, 13, 15, 14, 14] },
  { id: "spo2", icon: "💨", label: "Кислород SpO₂", metricKey: "spo2", unit: "%", trend: "99%", status: "отлично", description: "Насыщение крови кислородом. Норма: 95–100%. Показатель эффективности дыхания.", graphData: [97, 98, 99, 97, 98, 99, 99] },
  { id: "temperature", icon: "🌡️", label: "Температура", metricKey: "bodyTemperature", unit: "°C", trend: "36.6", status: "норма", description: "Базальная температура тела. Отклонения могут указывать на воспаление или перегрузку.", graphData: [36.5, 36.4, 36.6, 36.7, 36.5, 36.6, 36.6] },
  { id: "energy", icon: "⚡", label: "Энергия", metricKey: "energyLevel", unit: "%", trend: "+8%", status: "выше среднего", description: "Субъективный уровень энергии. Формируется из качества сна, активности и восстановления.", graphData: [55, 60, 72, 48, 65, 70, 72] },
];

function resolveMetricValue(metrics: RitualHealthMetrics, key: keyof RitualHealthMetrics): string | number {
  const v = metrics[key];
  if (key === "activitySteps") return (v as number / 1000).toFixed(1) + "K";
  if (key === "restingHeartRate") return v as number;
  if (key === "sleepDuration") return v as number;
  if (key === "bodyTemperature") return (v as number).toFixed(1);
  if (key === "spo2") return v as number;
  if (key === "energyLevel") return v as number;
  if (key === "respirationRate") return v as number;
  if (key === "hrv") return v as number;
  return v as number;
}

export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "practice" | "progress" | "profile">("today");
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [showMetricsDetails, setShowMetricsDetails] = useState(false);
  const [toast, setToast] = useState<{ title: string; subtitle?: string } | null>(null);

  const triggerToast = (title: string, subtitle?: string) => {
    setToast({ title, subtitle });
    setTimeout(() => setToast(null), 4500);
  };

  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    isSubscribed: false,
    subscriptionExpiry: null,
    activeBg: "water",
    xp: 0,
    streak: 0,
    totalRitualsCount: 0,
    isCustomRingPreordered: false,
    ringOrderCode: null,
    ringMaterial: "glow_obsidian",
    ringEngraving: "",
    ringSize: null,
    ringBatteryCharge: 78,
    isAppleHealthConnected: false,
    isGoogleFitConnected: false,
    isHealthConnectConnected: false,
    isCoreRingConnected: false,
    weeklyGoal: 5,
    achievements: [],
  });

  const [metrics, setMetrics] = useState<RitualHealthMetrics>({
    score: 84,
    status: "сияешь",
    statusText: "Ты полностью восстановлен и готов действовать",
    hrv: 78,
    sleepDuration: 8.2,
    restingHeartRate: 64,
    activitySteps: 11200,
    bodyTemperature: 36.6,
    spo2: 99,
    respirationRate: 14,
    energyLevel: 72,
    stressLevel: 34,
  });

  const [schedule, setSchedule] = useState<DayScheduleSlot[]>([
    { id: "s1", time: "08:00", title: "Утреннее намерение", ritualId: "morning_affirmation", completed: false, color: "#C9A96E" },
    { id: "s2", time: "12:30", title: "Фокус внимания", ritualId: "priorities", completed: false, color: "#8AB4C8" },
    { id: "s3", time: "16:30", title: "Осознанное движение", ritualId: "grounding", completed: false, color: "#D4875E" },
    { id: "s4", time: "20:30", title: "Дыхание 4-7-8", ritualId: "sigh", completed: false, color: "#8899AA" },
  ]);

  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [practiceActiveArea, setPracticeActiveArea] = useState<"menu" | "movement" | "focus" | "gaze" | "levelPlayer" | "ritualPlayer" | null>(null);
  const [practiceSelectedLevel, setPracticeSelectedLevel] = useState<any | null>(null);
  const [practiceSelectedChapter, setPracticeSelectedChapter] = useState<any | null>(null);
  const [practiceSelectedRitualData, setPracticeSelectedRitualData] = useState<any | null>(null);

  const handleOnboardingComplete = (responses: { message: string; answer: string }[]) => {
    const name = responses.find(r => r.message.includes("уровень стресса"))?.answer || "Искатель";
    setProfile((prev) => ({ ...prev, name }));
    onLevelComplete("istok_1");
    setOnboardingComplete(true);
  };

  const onLevelComplete = (levelId: string) => {
    setCompletedLevels((prev) => {
      if (prev.includes(levelId)) return prev;
      const next = [...prev, levelId];
      setProfile((p) => ({
        ...p,
        xp: p.xp + 25,
        totalRitualsCount: p.totalRitualsCount + 1,
        streak: next.length > 3 ? 5 : next.length,
      }));
      return next;
    });
  };

  const handleLaunchRitualAndTrack = (id: string, group?: string) => {
    let targetArea: "menu" | "movement" | "focus" | "gaze" | "levelPlayer" | "ritualPlayer" = "menu";
    let targetLevel: any = null;
    let targetChapter: any = null;
    let targetRitualData: any = null;
    const normalizedId = id.toLowerCase();

    if (normalizedId === "grounding" || normalizedId === "s3") {
      targetArea = "movement";
    } else if (normalizedId === "priorities" || normalizedId === "s2") {
      targetArea = "focus";
    } else if (normalizedId === "sigh" || normalizedId === "s4") {
      targetArea = "gaze";
    } else {
      let foundLevel: any = null;
      let foundChapter: any = null;
      let searchId = id;
      if (id === "morning_affirmation" || id === "5-4-3-2-1") searchId = "istok_1";
      else if (id === "night_journal") searchId = "silence_4";
      else if (id === "internal_sun") searchId = "energy_3";
      for (const ch of CHAPTERS) {
        const lvl = ch.levels.find(l => l.id === searchId);
        if (lvl) { foundLevel = lvl; foundChapter = ch; break; }
      }
      if (foundLevel && foundChapter) {
        targetArea = "levelPlayer"; targetLevel = foundLevel; targetChapter = foundChapter;
      } else {
        const g = group || "Исток";
        const rituals = RITUALS_DATA[g];
        if (rituals) {
          const found = rituals.find(r => r.id === id);
          if (found) {
            targetArea = "ritualPlayer"; targetRitualData = found;
          } else {
            for (const grp of Object.values(RITUALS_DATA)) {
              const r = grp.find(item => item.id === id);
              if (r) { targetArea = "ritualPlayer"; targetRitualData = r; break; }
            }
          }
        }
        if (!targetRitualData) {
          targetArea = "levelPlayer"; targetLevel = CHAPTERS[0].levels[0]; targetChapter = CHAPTERS[0];
        }
      }
    }
    setActiveTab("practice");
    setPracticeActiveArea(targetArea);
    setPracticeSelectedLevel(targetLevel);
    setPracticeSelectedChapter(targetChapter);
    setPracticeSelectedRitualData(targetRitualData);
    if (targetRitualData) {
      triggerToast("Ритуал запущен", `«${targetRitualData.title}»`);
    } else if (targetLevel) {
      triggerToast("Действие запущено", `Направляем вас в практику: ${targetLevel.title}`);
    } else {
      triggerToast("Действие запущено", targetArea === "movement" ? "Осознанное Движение" : targetArea === "focus" ? "Фокус Внимания" : "Аудио Свечение");
    }
  };

  const handleToggleHealthConnect = async () => {
    if (profile.isHealthConnectConnected) {
      setProfile((prev) => ({ ...prev, isHealthConnectConnected: false }));
      return;
    }
    const granted = await HealthService.requestPermissions();
    if (granted) {
      const healthMetrics = await HealthService.fetchCurrentMetrics();
      setMetrics((m) => ({
        ...m,
        score: Math.min(100, Math.round((healthMetrics.heartRate ? 100 - Math.abs(healthMetrics.heartRate - 70) : m.score) + (healthMetrics.steps > 5000 ? 10 : 0))),
        restingHeartRate: healthMetrics.heartRate || m.restingHeartRate,
        activitySteps: healthMetrics.steps || m.activitySteps,
        bodyTemperature: healthMetrics.bodyTemperature ?? m.bodyTemperature,
        spo2: healthMetrics.spo2 ?? m.spo2,
      }));
      setProfile((prev) => ({ ...prev, isHealthConnectConnected: true }));
      triggerToast("Health Connect подключён", "Данные синхронизированы");
      HealthService.syncWithBackend(profile.name || "user", healthMetrics);
    } else {
      triggerToast("Доступ не предоставлен", "Проверьте настройки Health Connect");
    }
  };

  const triggerMockDataConnection = (type: "apple" | "google" | "ring") => {
    setProfile((prev) => {
      let update: Partial<UserProfile> = {};
      if (type === "apple") {
        update = { isAppleHealthConnected: !prev.isAppleHealthConnected };
        if (!prev.isAppleHealthConnected) setMetrics((m) => ({ ...m, score: 92, status: "сияешь" }));
      } else if (type === "google") update = { isGoogleFitConnected: !prev.isGoogleFitConnected };
      else update = { isCoreRingConnected: !prev.isCoreRingConnected };
      return { ...prev, ...update };
    });
  };

  if (!onboardingComplete) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col px-6 pt-10 pb-0 transition-colors duration-[1.5s] bg-[#07070A]">
      <GlobalVisualBackdrop activeBg={profile.activeBg} />

      <div className="flex-grow overflow-y-auto no-scrollbar w-full max-w-md mx-auto relative z-10 pb-24">
        {activeTab === "today" && (
          <TodayTab
            profile={profile}
            metrics={metrics}
            schedule={schedule}
            onUpdateBg={(bg) => setProfile((p) => ({ ...p, activeBg: bg }))}
            onLaunchRitual={handleLaunchRitualAndTrack}
            onToggleScheduleSlot={(id) => {}}
            onOpenMetricsDetails={() => setShowMetricsDetails(true)}
            onEditSchedule={() => {}}
          />
        )}
        {activeTab === "practice" && (
          <PracticeTab
            completedLevels={completedLevels}
            isSubscribed={profile.isSubscribed}
            onLevelComplete={onLevelComplete}
            onLaunchRitual={handleLaunchRitualAndTrack}
            onShowToast={triggerToast}
            forcedActiveArea={practiceActiveArea}
            forcedSelectedLevel={practiceSelectedLevel}
            forcedSelectedChapter={practiceSelectedChapter}
            forcedSelectedRitualData={practiceSelectedRitualData}
            onClearForced={() => { setPracticeActiveArea(null); setPracticeSelectedLevel(null); setPracticeSelectedChapter(null); setPracticeSelectedRitualData(null); }}
          />
        )}
        {activeTab === "progress" && <ProgressTab profile={profile} metrics={metrics} completedLevels={completedLevels} />}
        {activeTab === "profile" && (
          <ProfileTab
            profile={profile}
            metrics={metrics}
            completedLevels={completedLevels}
            onUpdateBg={(bg) => setProfile((p) => ({ ...p, activeBg: bg }))}
            onLaunchRitual={handleLaunchRitualAndTrack}
            onUpdateProfileName={(newName) => setProfile((p) => ({ ...p, name: newName }))}
            onToggleAppleHealth={() => triggerMockDataConnection("apple")}
            onToggleGoogleFit={() => triggerMockDataConnection("google")}
            onToggleHealthConnect={handleToggleHealthConnect}
            onToggleCoreRing={() => triggerMockDataConnection("ring")}
            onConfigureRing={(mat, eng) => setProfile((p) => ({ ...p, isCustomRingPreordered: true, ringMaterial: mat, ringEngraving: eng }))}
            onPurchaseSubscription={(sub) => setProfile((p) => ({ ...p, isSubscribed: sub }))}
            onShowToast={triggerToast}
          />
        )}
      </div>

      {showMetricsDetails && (
        <div className="fixed inset-0 z-50 bg-[#07070A]/90 backdrop-blur-2xl p-6 overflow-y-auto flex justify-center animate-[fade-in_0.5s_ease-out]">
          <div className="max-w-md w-full space-y-8 pt-14 pb-24 text-left relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-10 blur-[100px] pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${metrics.status === "сияешь" ? "#C9A96E" : metrics.status === "баланс" ? "#7BC47F" : "#D4875E"} 0%, transparent 70%)` }} />
            <button onClick={() => setShowMetricsDetails(false)}
              className="absolute right-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-white/20 hover:text-white/50 transition-colors">✕</button>
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#C9A96E]/50 uppercase tracking-[0.3em]">Ritual Health Index</span>
              <h1 className="text-xl font-display font-light text-white/85 text-aura">Монитор здоровья</h1>
              <p className="text-xs font-editorial italic text-white/20">Детальные показатели за 24 часа</p>
            </div>

            {/* 8 cards grid */}
            <div className="grid grid-cols-2 gap-3">
              {HEALTH_MONITOR_CARDS.map((card) => {
                const isExpanded = expandedMetric === card.id;
                const val = String(resolveMetricValue(metrics, card.metricKey));
                return (
                  <div key={card.id}
                    className={`rounded-2xl border border-white/[0.03] overflow-hidden transition-all duration-300 ${isExpanded ? 'col-span-2' : ''}`}
                    style={{ background: isExpanded ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.015)' }}>
                    <div onClick={() => setExpandedMetric(isExpanded ? null : card.id)}
                      className="p-3.5 cursor-pointer select-none">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs opacity-50">{card.icon}</span>
                        <span className={`text-[7px] font-mono tracking-wider uppercase transition-opacity ${isExpanded ? 'opacity-40' : 'opacity-20'}`}>{isExpanded ? 'свернуть' : 'подробнее'}</span>
                      </div>
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-0.5">{card.label}</h4>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-display font-light text-white/85">{val}</span>
                        <span className="text-[8px] font-mono text-white/20">{card.unit}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[8px] font-mono ${card.trend.startsWith('+') ? 'text-[#7BC47F]/60' : card.trend.startsWith('-') ? 'text-[#FF6B6B]/60' : 'text-white/20'}`}>{card.trend}</span>
                        <span className="text-[6px] text-white/10">•</span>
                        <span className="text-[7px] text-white/15 font-editorial italic">{card.status}</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-3.5 pb-4 space-y-3 animate-[fade-in_0.3s_ease-out] border-t border-white/[0.02] pt-3">
                        <p className="text-[10px] text-white/25 font-editorial italic leading-relaxed">{card.description}</p>
                        <div className="h-10">
                          <svg className="w-full h-full" viewBox="0 0 200 30" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d={`M${card.graphData.map((d, i) => { const x = (i / (card.graphData.length - 1)) * 200; const y = 30 - (d / Math.max(...card.graphData)) * 26; return `${i === 0 ? 'M' : 'L'}${x},${y}`; }).join(' ')} L200,30 L0,30 Z`} fill={`url(#grad-${card.id})`} />
                            <path d={card.graphData.map((d, i) => { const x = (i / (card.graphData.length - 1)) * 200; const y = 30 - (d / Math.max(...card.graphData)) * 26; return `${i === 0 ? 'M' : 'L'}${x},${y}`; }).join(' ')} fill="none" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                          </svg>
                        </div>
                        <div className="flex justify-between">
                          {["Пн","Вт","Ср","Чт","Пт","Сб","Сег"].map((d, i) => (
                            <span key={i} className={`text-[6px] font-mono ${i === 6 ? 'text-white/20' : 'text-white/8'}`}>{d}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={() => setShowMetricsDetails(false)}
              className="w-full py-3 text-[10px] font-mono text-white/20 hover:text-white/40 tracking-wider uppercase transition-colors">
              Закрыть
            </button>
          </div>
        </div>
      )}

      <VoiceAssistant isOpen={voiceAssistantOpen} onClose={() => setVoiceAssistantOpen(false)} onLaunchRitual={handleLaunchRitualAndTrack} userShineScore={metrics.score} />

      <div className="fixed bottom-8 left-0 right-0 z-40 flex items-center justify-center px-5 pointer-events-none">
        <nav className="h-12 flex-1 max-w-sm flex items-center justify-around px-4 rounded-2xl bg-black/50 backdrop-blur-2xl pointer-events-auto border border-white/[0.06] shadow-2xl">
          {[
            { key: "today" as const, icon: Compass, label: "День", glow: "rgba(201,169,110,0.15)" },
            { key: "practice" as const, icon: BookOpen, label: "Путь", glow: "rgba(136,153,170,0.15)" },
            { key: "progress" as const, icon: Trophy, label: "Рост", glow: "rgba(201,169,110,0.15)" },
            { key: "profile" as const, icon: User, label: "Я", glow: "rgba(255,255,255,0.08)" },
          ].map(({ key, icon: Icon, label, glow }) => {
            const isActive = activeTab === key;
            return (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`relative flex flex-col items-center justify-center gap-0 h-full px-3 transition-all duration-500 ${isActive ? "text-white" : "text-white/20 hover:text-white/40"}`}>
                <Icon size={15} style={isActive ? { filter: `drop-shadow(0 0 8px ${glow})` } : {}} />
                <span className={`text-[7px] font-semibold tracking-[0.15em] uppercase mt-0.5 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}>{label}</span>
              </button>
            );
          })}
        </nav>
        <button onClick={() => setVoiceAssistantOpen(true)}
          className="w-12 h-12 rounded-2xl bg-black/30 backdrop-blur-2xl flex items-center justify-center active:scale-90 transition-transform pointer-events-auto border border-white/[0.06] shadow-2xl">
          <Mic size={18} className="text-white/40" />
        </button>
      </div>

      {toast && (
        <div className="fixed top-6 left-0 right-0 px-6 z-50 flex justify-center animate-[fade-in_0.4s_ease-out]">
          <div className="max-w-sm w-full flex items-start gap-3 pb-3 border-b border-white/[0.03]">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-[#C9A96E] text-[10px] flex-shrink-0">✦</span>
              <h4 className="text-[12px] text-white/60 font-normal tracking-wide">{toast.title}</h4>
              {toast.subtitle && <span className="text-[10px] text-white/20 font-editorial italic truncate">— {toast.subtitle}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { App };