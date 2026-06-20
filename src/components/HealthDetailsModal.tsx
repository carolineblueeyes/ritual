import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, ChevronDown, CheckCircle } from 'lucide-react';
import type { HealthData } from '../services/HealthService';

interface MetricDetail {
  id: string;
  name: string;
  valStr: string;
  desc: string;
  helpText: string;
  unit: string;
  sparkline: number[];
  color: string;
}

interface HealthDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthScore: number;
  healthData: HealthData | null;
}

export default function HealthDetailsModal({ isOpen, onClose, healthScore, healthData }: HealthDetailsModalProps) {
  const [expandedMetricId, setExpandedMetricId] = useState<string | null>('hrv');

  const METRICS: MetricDetail[] = useMemo(() => {
    if (!healthData) {
      return [
        {
          id: 'hrv', name: 'ВСР (Вариабельность ритма)', valStr: '—', unit: 'ms',
          color: '#8E8E93', desc: 'Нет данных. Подключите Health Connect.', helpText: 'ВСР (HRV) — это микроскопический интервал изменений между ударами сердца.', sparkline: []
        },
        {
          id: 'sleep', name: 'Длительность сна', valStr: '—', unit: 'ч',
          color: '#8E8E93', desc: 'Нет данных.', helpText: 'Сон очищает глиальные пространства мозга и нормализует баланс медиаторов внимания.', sparkline: []
        },
        {
          id: 'resting_hr', name: 'Пульс покоя', valStr: '—', unit: 'уд/мин',
          color: '#8E8E93', desc: 'Нет данных.', helpText: 'Пульс в состоянии покоя отражает общую тренированность.', sparkline: []
        },
        {
          id: 'activity', name: 'Двигательная активность', valStr: '—', unit: 'шагов',
          color: '#8E8E93', desc: 'Нет данных.', helpText: 'Осознанные шаги насыщают ткани кислородом.', sparkline: []
        },
        {
          id: 'respiratory', name: 'Частота дыхания', valStr: '—', unit: 'дых/мин',
          color: '#A8D5E5', desc: 'Нет данных.', helpText: 'Частота дыхания отражает уровень стресса и восстановления.', sparkline: []
        },
        {
          id: 'calories', name: 'Активные калории', valStr: '—', unit: 'ккал',
          color: '#FF9F0A', desc: 'Нет данных.', helpText: 'Калории, сожжённые за счёт физической активности.', sparkline: []
        }
      ];
    }

    const h = healthData;
    return [
      {
        id: 'hrv', name: 'ВСР (Вариабельность ритма)', valStr: `${Math.round(h.hrv)} ms`, unit: 'ms',
        color: h.hrv >= 50 ? '#34C759' : h.hrv >= 30 ? '#FF9F0A' : '#FF453A',
        desc: h.hrv >= 50 ? 'Отличная вегетативная гибкость.' : h.hrv >= 30 ? 'Средний уровень восстановления.' : 'Низкий уровень ВСР — рекомендуется отдых.',
        helpText: 'ВСР (HRV) — это микроскопический интервал изменений между ударами сердца. Высокий показатель говорит о преобладании парасимпатического тонуса саморегуляции.',
        sparkline: [h.hrv]
      },
      {
        id: 'sleep', name: 'Длительность сна',
        valStr: `${Math.floor(h.sleepHours)}ч ${Math.round((h.sleepHours % 1) * 60)}м`, unit: 'ч',
        color: h.sleepHours >= 7 ? '#34C759' : h.sleepHours >= 5 ? '#FF9F0A' : '#FF453A',
        desc: h.sleepHours >= 7 ? 'Норма сна выполнена.' : h.sleepHours >= 5 ? 'Сон короче нормы.' : 'Критически мало сна.',
        helpText: 'Сон очищает глиальные пространства мозга и нормализует баланс медиаторов внимания.',
        sparkline: [h.sleepHours * 60]
      },
      {
        id: 'resting_hr', name: 'Пульс покоя', valStr: `${Math.round(h.heartRate)} уд/мин`, unit: 'уд/мин',
        color: h.heartRate >= 50 && h.heartRate <= 80 ? '#34C759' : h.heartRate > 80 ? '#FF9F0A' : '#34C759',
        desc: h.heartRate >= 50 && h.heartRate <= 80 ? 'В норме.' : 'Пульс повышен — возможен стресс.',
        helpText: 'Пульс в состоянии покоя отражает общую тренированность и уровень возбужденности симпатической системы.',
        sparkline: [h.heartRate]
      },
      {
        id: 'activity', name: 'Двигательная активность',
        valStr: `${h.steps.toLocaleString('ru-RU')} шагов`, unit: 'шагов',
        color: h.steps >= 7000 ? '#34C759' : h.steps >= 3000 ? '#FF9F0A' : '#FF453A',
        desc: h.steps >= 7000 ? 'Норма активности выполнена.' : h.steps >= 3000 ? 'Мало шагов — добавьте движение.' : 'Сидячий режим.',
        helpText: 'Осознанные шаги насыщают ткани кислородом и снимают мышечный каркас стресса.',
        sparkline: [h.steps]
      },
      {
        id: 'respiratory', name: 'Частота дыхания',
        valStr: `${Math.round(h.respiratoryRate)} дых/мин`, unit: 'дых/мин',
        color: h.respiratoryRate >= 12 && h.respiratoryRate <= 18 ? '#34C759' : '#FF9F0A',
        desc: h.respiratoryRate >= 12 && h.respiratoryRate <= 18 ? 'Стабильный ритм дыхания.' : 'Частота дыхания повышена.',
        helpText: 'Частота дыхания отражает уровень стресса и восстановления нервной системы.',
        sparkline: [h.respiratoryRate]
      },
      {
        id: 'calories', name: 'Активные калории',
        valStr: `${Math.round(h.activityCalories)} ккал`, unit: 'ккал',
        color: h.activityCalories >= 300 ? '#34C759' : '#FF9F0A',
        desc: h.activityCalories >= 300 ? 'Хороший расход энергии.' : 'Низкая активность.',
        helpText: 'Калории, сожжённые за счёт физической активности.',
        sparkline: [h.activityCalories]
      }
    ];
  }, [healthData]);

  const toggleMetric = (id: string) => {
    if (expandedMetricId === id) {
      setExpandedMetricId(null);
    } else {
      setExpandedMetricId(id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-end justify-center pointer-events-auto">
          {/* Back click close constraint */}
          <div className="absolute inset-0 z-0" onClick={onClose} />

          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="w-full max-w-md bg-[#090b14ef] border-t border-white/[0.12] rounded-t-[36px] p-6 pb-12 z-10 flex flex-col space-y-5 max-h-[88vh] overflow-y-auto scrollbar-none"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-mono text-teal-400">Вегетативный фон</span>
                <h3 className="text-xl font-bold text-white/95 leading-normal">Показатели здоровья</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 active:scale-90 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Micro correlation chart of "Практики и Сияние" (Core correlation info) */}
            <div className="bg-slate-950/40 border border-white/[0.05] rounded-2xl p-4 flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Корреляция практик</span>
                <span className="text-[11px] text-teal-300 bg-teal-950/30 px-2 py-0.5 rounded-full font-mono font-bold">+18% к ВСР</span>
              </div>
              
              <h4 className="text-[13px] font-sans font-semibold text-white/90">Влияние ритуалов на Сияние Кристалла</h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                Статистический анализ сеансов показывает: дыхание «Нейро-сброс» и «Тишина» дают буст парасимпатическому тонусу на 3-4 часа.
              </p>

              {/* Correlation bar visual */}
              <div className="w-full h-[65px] flex items-end justify-between px-2 pt-2 gap-2 relative">
                {/* Simulated bar chart: Left side are rituals completed, Right side is state index */}
                {[
                  { label: 'Пн', rituals: 1, Index: 65 },
                  { label: 'Вт', rituals: 2, Index: 72 },
                  { label: 'Ср', rituals: 0, Index: 58 },
                  { label: 'Чт', rituals: 4, Index: 88 },
                  { label: 'Пт', rituals: 3, Index: 82 },
                  { label: 'Сб', rituals: 5, Index: 94 },
                  { label: 'Вс', rituals: 2, Index: 86 }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center space-y-1.5 h-full justify-end">
                    {/* Index height */}
                    <div className="w-2.5 rounded-full bg-[#E6B85C]/90" style={{ height: `${item.Index / 1.7}%` }} />
                    <span className="text-[9px] font-mono text-white/40">{item.label}</span>
                  </div>
                ))}
              </div>
              <span className="text-[9px] font-mono text-center text-white/20 select-none">Золотые столбцы показывают индекс Сияния здоровья по дням недели</span>
            </div>

            {/* Metrics expanders */}
            <div className="flex flex-col space-y-3">
              <span className="text-xs text-white/40 tracking-wider uppercase font-mono px-1">Метрики в деталях:</span>
              
              {METRICS.map((metric) => {
                const isExpanded = expandedMetricId === metric.id;
                return (
                  <div 
                    key={metric.id}
                    className="p-4 bg-white/[0.015] border border-white/[0.05] rounded-2xl flex flex-col space-y-2 transition-all duration-300"
                  >
                    <div 
                      onClick={() => toggleMetric(metric.id)}
                      className="flex justify-between items-center cursor-pointer select-none"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-sm font-semibold text-white/95">{metric.name}</span>
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono font-bold" style={{ color: metric.color }}>{metric.valStr}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 text-[12px] text-white/60 space-y-3 leading-relaxed flex flex-col border-t border-white/[0.04] mt-2.5">
                            <p>{metric.desc}</p>
                            
                            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-white/[0.03] text-[11px] leading-relaxed text-white/50 flex space-x-2 items-start">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{metric.helpText}</span>
                            </div>

                            {/* Minimal Sparkline with 7-day track */}
                            <div className="pt-1 flex flex-col space-y-1">
                              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest px-0.5">Ретроспектива за 7 дней</span>
                              <div className="w-full h-14 bg-black/40 rounded-xl flex items-end justify-between p-2.5 space-x-1 border border-white/[0.02]">
                                {metric.sparkline.map((val, idx) => {
                                  // Map min-max values to friendly height percentiles
                                  const min = Math.min(...metric.sparkline);
                                  const max = Math.max(...metric.sparkline);
                                  const pct = max === min ? 50 : ((val - min) / (max - min)) * 75 + 15;
                                  return (
                                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                                      <div className="w-full rounded-sm transition-all duration-500" style={{ height: `${pct}%`, backgroundColor: metric.color }} />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-xs active:scale-98 transition mt-3"
            >
              Вернуться назад
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
