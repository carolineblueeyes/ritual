import React, { useState } from "react";
import { User, ShieldCheck, Heart, Apple, Globe, Award, Sparkles, Send, CircleCheck, Check, ChevronRight, Volume2, Calendar, Layout, MessageSquare } from "lucide-react";
import { UserProfile, RitualHealthMetrics } from "../types";
import { Crystal3D } from "./Crystal3D";

interface ProfileTabProps {
  profile: UserProfile;
  metrics: RitualHealthMetrics;
  completedLevels: string[];
  onUpdateBg: (bg: "water" | "sky" | "aurora" | "mystic") => void;
  onLaunchRitual: (id: string, group: string) => void;
  onUpdateProfileName: (name: string) => void;
  onToggleAppleHealth: () => void;
  onToggleGoogleFit: () => void;
  onToggleHealthConnect: () => void;
  onToggleCoreRing: () => void;
  onConfigureRing: (material: "matte_black" | "glow_obsidian", engraving: string, size: number) => void;
  onPurchaseSubscription: (isSubscribed: boolean) => void;
  onShowToast?: (title: string, subtitle?: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile, metrics, completedLevels, onUpdateBg, onLaunchRitual, onUpdateProfileName,
  onToggleAppleHealth, onToggleGoogleFit, onToggleHealthConnect, onToggleCoreRing, onConfigureRing, onPurchaseSubscription, onShowToast,
}) => {
  const [showSubscription, setShowSubscription] = useState(false);
  const [selectedSubTab, setSelectedSubTab] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [appIcon, setAppIcon] = useState("logo");
  const [ringMaterial, setRingMaterial] = useState<"matte_black" | "glow_obsidian">("glow_obsidian");
  const [engravingText, setEngravingText] = useState("");
  const [engravingBurned, setEngravingBurned] = useState(false);
  const [laserBurning, setLaserBurning] = useState(false);
  const [showRingConfigurator, setShowRingConfigurator] = useState(false);
  const [activeWidgetIdx, setActiveWidgetIdx] = useState(0);

  const getCrystalStage = () => {
    const c = (s: string) => completedLevels.filter(l => l.includes(s)).length >= 3;
    if (c("clarity")) return 5; if (c("energy")) return 4; if (c("silence")) return 3; if (c("istok")) return 2;
    if (completedLevels.includes("istok_1")) return 1; return 0;
  };
  const currentLevel = getCrystalStage();
  const stageNames = ["Туман", "Искра", "Источник", "Тишина", "Энергия", "Ясность"];
  const stageColors = ["#ffffff20", "#C9A96E", "#8899AA", "#8AB4C8", "#D4875E", "#7BC47F"];

  return (
    <div className="space-y-8 pb-24 text-left animate-[fade-in_0.5s_ease-out]">
      {/* Crystal + Name */}
      <div className="flex flex-col items-center pt-2 pb-6 text-center space-y-6">
        <div className="relative w-full flex flex-col items-center justify-center h-[260px] select-none">
          <div className="absolute top-4 left-0 text-left">
            <span className="text-[8px] font-mono tracking-widest text-[#C9A96E]/50 uppercase">Кристалл Личности</span>
          </div>
          {profile.isSubscribed && (
            <div className="absolute top-4 right-0">
              <span className="text-[8px] font-mono tracking-wider text-[#C9A96E]/60 uppercase">Plus</span>
            </div>
          )}
          <div className="h-[200px] w-full flex items-center justify-center relative z-10 scale-[0.85] cursor-grab active:cursor-grabbing">
            <Crystal3D progressLevel={currentLevel} shineScore={metrics.score} />
          </div>
        </div>
        <div className="space-y-1">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)}
                className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-3 py-1 text-center text-white text-sm outline-none font-display" />
              <button onClick={() => { onUpdateProfileName(tempName.trim() || profile.name); setIsEditingName(false); }}
                className="text-[10px] text-white/30 hover:text-white/50 transition-colors">Ок</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-center">
              <h2 className="text-base font-display font-light text-white/80 text-aura">{profile.name}</h2>
              <button onClick={() => { setTempName(profile.name); setIsEditingName(true); }}
                className="text-white/20 text-[10px] hover:text-white/40 transition-colors">✎</button>
            </div>
          )}
          <p className="text-[9px] uppercase font-mono text-white/20 tracking-wider">Проводник внимания</p>
        </div>
      </div>

      <div className="h-px bg-white/[0.02]" />

      {/* Ring connection status — moved up */}
      <div className="space-y-4 pt-2">
        <div className="text-aura-light">
          <span className="text-[9px] font-mono tracking-widest text-[#C9A96E]/50 uppercase">Оборудование</span>
          <h3 className="text-sm font-display font-light text-white/70 mt-0.5">Ritual Inside Smart Ring</h3>
        </div>
        <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
          <span className="text-[10px] font-mono text-white/40">
            {profile.isCoreRingConnected ? `Подключено (${profile.ringBatteryCharge}%)` : 'Не подключено'}
          </span>
          {!profile.isCoreRingConnected && (
            <button onClick={() => { setEngravingBurned(false); setEngravingText(""); setShowRingConfigurator(true); }}
              className="px-3 py-1.5 rounded-xl bg-cyan-400/20 text-cyan-300 text-[10px] font-medium active:scale-95 transition">
              Подключить Core
            </button>
          )}
        </div>
        {profile.isCoreRingConnected && (
          <div className="text-xs text-white/40 leading-relaxed font-mono space-y-1.5 pl-1">
            <div className="flex justify-between text-[10px]">
              <span>Материал:</span>
              <span className="text-white/70">{profile.ringMaterial === "glow_obsidian" ? 'Glow Obsidian' : 'Matte Titanium'}</span>
            </div>
            {profile.ringEngraving && (
              <div className="flex justify-between text-[10px]">
                <span>Гравировка:</span>
                <span className="text-amber-300/70">{profile.ringEngraving}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-px bg-white/[0.02]" />

      {/* Subscription — moved up */}
      <div className="space-y-4 pt-2">
        <div className="text-aura-light">
          <span className="text-[9px] font-mono tracking-widest text-[#C9A96E]/50 uppercase">Личный Навигатор</span>
          {profile.isSubscribed ? (
            <div><h4 className="text-sm font-display font-light text-white/70 mt-1">Ritual Plus Активен</h4><p className="text-[10px] text-white/30 leading-normal">Премиум продлён. Полная библиотека доступна.</p></div>
          ) : (
            <div><h4 className="text-sm font-display font-light text-white/70 mt-1">Разблокировать все грани</h4><p className="text-[10px] text-white/30 leading-normal">Полный доступ к уникальным практикам.</p></div>
          )}
        </div>
        <button onClick={() => setShowSubscription(true)}
          className="w-full h-11 bg-white/[0.03] hover:bg-white/[0.06] text-white/60 font-light rounded-full text-xs tracking-wider transition-all border border-white/[0.03]">
          {profile.isSubscribed ? 'Управлять подпиской' : 'Активировать Ritual Plus'}
        </button>
      </div>

      <div className="h-px bg-white/[0.02]" />

      {/* Data sources */}
      <div className="space-y-4 pt-2">
        <div className="text-aura-light">
          <span className="text-[9px] font-mono tracking-widest text-[#C9A96E]/50 uppercase">Связь с телом</span>
          <h3 className="text-sm font-display font-light text-white/70 mt-0.5">Источники Данных</h3>
        </div>
        <div className="space-y-0">
          <div onClick={onToggleAppleHealth} className="flex justify-between items-center py-3 border-b border-white/[0.02] cursor-pointer">
            <div className="flex items-center gap-3"><Apple size={14} className="text-[#FF453A]/60" /><span className="text-xs text-white/60">Apple Health</span></div>
            <span className={`text-[10px] font-mono ${profile.isAppleHealthConnected ? "text-[#7BC47F]/60" : "text-white/20"}`}>
              {profile.isAppleHealthConnected ? "Подключено" : "Отключено"}</span>
          </div>
          <div onClick={onToggleGoogleFit} className="flex justify-between items-center py-3 border-b border-white/[0.02] cursor-pointer">
            <div className="flex items-center gap-3"><Globe size={14} className="text-blue-400/60" /><span className="text-xs text-white/60">Google Fit</span></div>
            <span className={`text-[10px] font-mono ${profile.isGoogleFitConnected ? "text-[#7BC47F]/60" : "text-white/20"}`}>
              {profile.isGoogleFitConnected ? "Подключено" : "Отключено"}</span>
          </div>
          <div onClick={onToggleHealthConnect} className="flex justify-between items-center py-3 border-b border-white/[0.02] cursor-pointer">
            <div className="flex items-center gap-3"><Heart size={14} className="text-green-400/60" /><span className="text-xs text-white/60">Health Connect (Android)</span></div>
            <span className={`text-[10px] font-mono ${profile.isHealthConnectConnected ? "text-[#7BC47F]/60" : "text-white/20"}`}>
              {profile.isHealthConnectConnected ? "Подключено" : "Подключить"}</span>
          </div>
          <div onClick={onToggleCoreRing} className="flex justify-between items-center py-3 cursor-pointer">
            <div className="flex items-center gap-3"><Heart size={14} className="text-[#C9A96E]/60" /><span className="text-xs text-white/60">Ritual Core</span></div>
            <span className={`text-[10px] font-mono ${profile.isCoreRingConnected ? "text-[#7BC47F]/60" : "text-white/20"}`}>
              {profile.isCoreRingConnected ? `Подключено (${profile.ringBatteryCharge}%)` : "Отключено"}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/[0.02]" />

      {/* Invite */}
      <div className="flex justify-between items-center text-left pt-2 text-aura-light">
        <div>
          <h4 className="text-xs font-light text-white/70">Пригласить Проводника</h4>
          <p className="text-[9px] text-white/25">Подарите 7 дней полной тишины.</p>
        </div>
        <button onClick={() => { onShowToast?.("Ссылка скопирована", "Попробуй Ritual — приложение для возвращения внимания."); }}
          className="text-[10px] text-[#C9A96E]/50 hover:text-[#C9A96E]/70 transition-colors">Пригласить</button>
      </div>

      <div className="h-px bg-white/[0.02]" />

      {/* App icon */}
      <div className="space-y-3 pt-2">
        <div className="text-aura-light">
          <span className="text-[9px] font-mono tracking-widest text-white/20 uppercase">Оформление</span>
          <h4 className="text-xs font-light text-white/70">Иконка приложения</h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "logo", name: "Классик", visual: "⬜" },
            { id: "sun", name: "Солнце", visual: "☀️" },
            { id: "moon", name: "Луна", visual: "🌙" },
          ].map((iconObj) => (
            <div key={iconObj.id} onClick={() => setAppIcon(iconObj.id)}
              className={`p-3 rounded-2xl text-center cursor-pointer transition select-none ${appIcon === iconObj.id ? "bg-white/6" : "bg-white/[0.02] hover:bg-white/[0.04]"}`}>
              <div className="text-xl mb-1 opacity-70">{iconObj.visual}</div>
              <span className="text-[9px] font-mono block leading-tight text-white/40">{iconObj.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/[0.02]" />

      {/* Widgets */}
      <div className="space-y-3 leading-normal pt-2">
        <div className="text-aura-light">
          <span className="text-[9px] font-mono tracking-widest text-white/20 uppercase">Интеграции</span>
          <h4 className="text-xs font-light text-white/70">Виджеты</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Сияние", sampleText: "Сияешь • 84%" },
            { name: "Кристалл", sampleText: "Стадия: Искра" },
            { name: "Быстрый ритуал", sampleText: "⚡ Удлиненный выдох" },
            { name: "Фокус дня", sampleText: "«Я свободен от шума»" },
          ].map((widget, i) => (
            <div key={i} onClick={() => setActiveWidgetIdx(i)}
              className={`p-3 rounded-xl text-left cursor-pointer transition ${activeWidgetIdx === i ? "bg-white/6" : "bg-white/[0.02] hover:bg-white/[0.04]"}`}>
              <h5 className="text-xs font-light text-white/70">{widget.name}</h5>
              <p className="text-[9px] text-white/25 mt-1 font-mono">{widget.sampleText}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ring configurator */}
      {showRingConfigurator && (
        <div className="fixed inset-0 z-50 bg-[#07070A]/95 backdrop-blur-2xl flex items-center justify-center p-6 text-left overflow-y-auto">
          <div className="max-w-md w-full space-y-6 pt-12 pb-24 text-left relative">
            <button onClick={() => setShowRingConfigurator(false)}
              className="absolute right-0 top-0 w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">✕</button>
            <span className="text-[9px] font-mono text-[#C9A96E]/50 uppercase tracking-widest">Конфигуратор</span>
            <h2 className="text-lg font-display font-light text-white/80 text-aura">Сковать Артефакт</h2>
            <div className="space-y-3">
              <label className="text-[9px] font-mono uppercase text-white/25">Материал:</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "matte_black", name: "Матовый Титан", desc: "Matte Black Carbon" },
                  { id: "glow_obsidian", name: "Глянцевая Керамика", desc: "Glow Obsidian" },
                ].map((m) => (
                  <button key={m.id} onClick={() => setRingMaterial(m.id as any)}
                    className={`p-4 rounded-2xl border text-left transition ${ringMaterial === m.id ? "bg-white/6 border-white/10" : "bg-white/[0.02] border-white/[0.03] text-white/40"}`}>
                    <h4 className="text-xs font-light text-white/70">{m.name}</h4>
                    <p className="text-[9px] text-white/25 mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <label className="text-[9px] font-mono uppercase text-white/25">Гравировка:</label>
              <div className="flex gap-2">
                <input type="text" maxLength={16} placeholder="СВОБОДА" value={engravingText}
                  onChange={(e) => { setEngravingText(e.target.value.toUpperCase()); setEngravingBurned(false); }}
                  className="flex-1 h-11 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 text-xs text-white/60 uppercase outline-none placeholder:text-white/10" />
                <button onClick={() => { if (!engravingText.trim()) return; setLaserBurning(true); setTimeout(() => { setLaserBurning(false); setEngravingBurned(true); }, 2000); }}
                  disabled={laserBurning || !engravingText.trim()}
                  className="h-11 bg-white/[0.03] hover:bg-white/[0.06] text-white/50 rounded-xl text-[10px] px-4 disabled:opacity-20 transition-colors">Лазер</button>
              </div>
              {laserBurning && <p className="text-[10px] text-white/20 animate-pulse">Гравировка...</p>}
              {engravingBurned && <p className="text-[10px] text-[#7BC47F]/60">✓ «{engravingText}» выжжено</p>}
            </div>
            <div className="flex justify-between items-center pt-4">
              <div>
                <h4 className="text-xs font-light text-white/70">Твой Ritual Core:</h4>
                <p className="text-[9px] text-white/25 mt-1 font-mono">
                  {ringMaterial === "glow_obsidian" ? "Керамика Obsidian" : "Титан Matte"}{engravingText ? ` • "${engravingText}"` : ""}
                </p>
              </div>
              <span className="text-sm font-light text-white/60">14 900 ₽</span>
            </div>
            <button onClick={() => { onConfigureRing(ringMaterial, engravingText, 10); setShowRingConfigurator(false); onShowToast?.("Ritual Core Забронирован", "Sizing Kit отправлен."); }}
              className="w-full h-12 bg-white/[0.03] hover:bg-white/[0.06] text-white/60 font-light rounded-2xl text-xs tracking-wider transition-all border border-white/[0.03]">
              Забронировать
            </button>
          </div>
        </div>
      )}

      {/* Subscription modal */}
      {showSubscription && (
        <div className="fixed inset-0 z-50 bg-[#07070A]/95 backdrop-blur-2xl flex items-end justify-center p-0">
          <div className="max-w-lg w-full p-6 pb-12 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A96E]/60" />
                <h3 className="text-base font-display font-light text-white/80 text-aura">Ritual Plus</h3>
              </div>
              <button onClick={() => setShowSubscription(false)}
                className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">✕</button>
            </div>
            <p className="text-xs text-white/30 text-left leading-relaxed">Весь ритм жизни — в твоём телефоне.</p>
            <div className="space-y-2 text-left text-xs text-white/50">
              <div className="flex items-center gap-2"><Check size={12} className="text-[#C9A96E]/60" /><span>Все 36 ритуалов</span></div>
              <div className="flex items-center gap-2"><Check size={12} className="text-[#C9A96E]/60" /><span>Все главы Пути внимания</span></div>
              <div className="flex items-center gap-2"><Check size={12} className="text-[#C9A96E]/60" /><span>ИИ рекомендации</span></div>
              <div className="flex items-center gap-2"><Check size={12} className="text-[#C9A96E]/60" /><span>Интеграция с Apple Health / Google Fit</span></div>
            </div>
            <div className="space-y-2 text-left">
              {[
                { price: "590 ₽", period: "1 месяц", desc: "Гибкий старт" },
                { price: "2 890 ₽", period: "6 месяцев", desc: "Популярный" },
                { price: "4 990 ₽", period: "1 год", desc: "Лучшая выгода" },
              ].map((sub, i) => (
                <div key={i} onClick={() => setSelectedSubTab(i)}
                  className={`p-4 rounded-2xl flex justify-between items-center cursor-pointer transition ${selectedSubTab === i ? "bg-white/6" : "bg-white/[0.02]"}`}>
                  <div><h4 className="text-xs font-light text-white/70">{sub.period}</h4><p className="text-[9px] text-white/25 mt-0.5">{sub.desc}</p></div>
                  <span className="text-xs font-light text-white/60">{sub.price}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { onPurchaseSubscription(true); setShowSubscription(false); onShowToast?.("Активирован Ritual Plus", "Расширенные функции разблокированы."); }}
              className="w-full h-12 bg-white/[0.03] hover:bg-white/[0.06] text-white/60 font-light rounded-2xl text-xs tracking-wider transition-all border border-white/[0.03]">
              Начать 7 дней бесплатно
            </button>
            <p className="text-[8px] text-white/15 text-center">Отменить можно в любой момент.</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfileTab;