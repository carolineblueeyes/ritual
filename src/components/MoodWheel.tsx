import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { MOODS, type MoodCard } from "../data/moods";

interface MoodWheelProps {
  onLaunchRitual: (id: string, group: string) => void;
}

export const MoodWheel: React.FC<MoodWheelProps> = ({ onLaunchRitual }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>("[data-mood-idx]");
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((card) => {
      const idx = parseInt(card.dataset.moodIdx || "0", 10);
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - scrollCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = idx;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateActiveIndex, { passive: true });
    updateActiveIndex();
    return () => container.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  const handleCardClick = (mood: MoodCard) => {
    onLaunchRitual(mood.ritualId, mood.group);
  };

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex overflow-x-auto no-scrollbar py-6 px-[calc(50%-90px)] gap-0"
        style={{
          perspective: "1000px",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        {MOODS.map((mood, index) => {
          const diff = Math.abs(index - activeIndex);
          const scale = diff === 0 ? 1 : diff === 1 ? 0.82 : 0.65;
          const opacity = diff === 0 ? 1 : diff === 1 ? 0.5 : 0.12;
          const rotateY = index === activeIndex ? 0 : index < activeIndex ? -18 : 18;
          const z = diff === 0 ? 0 : diff === 1 ? -60 : -120;

          return (
            <motion.div
              key={mood.id}
              data-mood-idx={index}
              onClick={() => handleCardClick(mood)}
              animate={{
                scale,
                opacity,
                rotateY,
                z,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 35,
                mass: 0.8,
              }}
              className="relative flex-shrink-0 w-[180px] min-h-[230px] mx-2 cursor-pointer select-none"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 rounded-[24px] overflow-hidden"
                style={{ background: mood.gradient, opacity: 0.15 }}
              />
              <div
                className="absolute -top-4 -left-4 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${mood.color}40 0%, transparent 70%)` }}
              />
              <div className="relative z-10 h-full flex flex-col justify-between p-4 rounded-[24px] border border-white/[0.06] backdrop-blur-[12px]"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-[7px] font-mono uppercase tracking-[0.2em] text-white/20">
                      {mood.group}
                    </span>
                  </div>
                  <h4 className="text-sm font-display font-medium text-white/90 mb-1">
                    {mood.label}
                  </h4>
                  <p className="text-[10px] font-editorial italic text-white/30 leading-relaxed">
                    {mood.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className="w-5 h-[1px]"
                    style={{ background: mood.color }}
                  />
                  <span className="text-[7px] font-mono uppercase tracking-[0.15em] text-white/25">
                    Запустить
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-1 mb-2">
        {MOODS.map((mood, index) => (
          <button
            key={mood.id}
            onClick={() => {
              const container = containerRef.current;
              const card = container?.querySelector<HTMLElement>(`[data-mood-idx="${index}"]`);
              card?.scrollIntoView({ behavior: "smooth", inline: "center" });
            }}
            className="rounded-full transition-all duration-300"
            style={{
              width: index === activeIndex ? 20 : 5,
              height: 5,
              background: index === activeIndex ? mood.color : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
};
