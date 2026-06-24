import React, { useEffect, useRef, useState } from "react";

// ==========================================
// 1. BREATHING MANDALA (Focus Timer)
// ==========================================
interface BreathingMandalaProps {
  isActive: boolean;
  timeLeft: number;
  durationSeconds: number;
  focusTask: string;
}

export const BreathingMandala: React.FC<BreathingMandalaProps> = ({
  isActive, timeLeft, durationSeconds, focusTask,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [breathPhase, setBreathPhase] = useState<"вдох" | "задержка" | "выдох">("вдох");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 280);
    const height = (canvas.height = 280);
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const now = Date.now();
      const cycleMs = 12000;
      const progress = (now % cycleMs) / cycleMs;

      let scale = 1.0;
      let phaseText = "Вдох";
      let phaseColor = "rgba(168, 213, 229, 0.85)";

      if (progress < 0.33) {
        const t = progress / 0.33;
        scale = 0.7 + 0.6 * Math.sin((t * Math.PI) / 2);
        phaseText = "Глубокий Вдох";
        setBreathPhase("вдох");
      } else if (progress < 0.66) {
        const t = (progress - 0.33) / 0.33;
        scale = 1.3 + 0.04 * Math.sin(t * Math.PI * 2);
        phaseText = "Задержи Дыхание";
        phaseColor = "rgba(230, 184, 92, 0.95)";
        setBreathPhase("задержка");
      } else {
        const t = (progress - 0.66) / 0.34;
        scale = 0.7 + 0.6 * (1.0 - Math.sin((t * Math.PI) / 2));
        phaseText = "Медленный Выдох";
        phaseColor = "rgba(122, 155, 186, 0.85)";
        setBreathPhase("выдох");
      }

      angle += 0.008;
      const maxRadius = 55 * scale;
      const petalCount = 8;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      const gradientRadial = ctx.createRadialGradient(0, 0, 5, 0, 0, maxRadius * 1.5);
      gradientRadial.addColorStop(0, phaseColor.replace("0.85", "0.12").replace("0.95", "0.12"));
      gradientRadial.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradientRadial;
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < petalCount; i++) {
        ctx.rotate((Math.PI * 2) / petalCount);
        ctx.strokeStyle = phaseColor;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(maxRadius * 0.5, 0, maxRadius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = phaseColor.replace("0.85", "0.02").replace("0.95", "0.02");
        ctx.fill();
      }

      ctx.rotate(-angle * 1.5);
      for (let i = 0; i < petalCount; i++) {
        ctx.rotate((Math.PI * 2) / petalCount);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(maxRadius * 0.4, 0);
        ctx.stroke();
      }

      ctx.restore();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fillStyle = phaseColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText(phaseText.toUpperCase(), centerX, centerY + 100);

      const progressPercent = timeLeft / durationSeconds;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 130, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progressPercent);
      ctx.strokeStyle = phaseColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId.current = requestAnimationFrame(render);
    };

    if (isActive) {
      render();
    } else {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 40, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("НАЖМИ СТАРТ", width / 2, height / 2 + 3);
    }

    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [isActive, timeLeft, durationSeconds]);

  return (
    <div className="flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="w-[280px] h-[280px]" />
      <div className="flex gap-4 text-xs font-mono justify-center items-center mt-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${breathPhase === "вдох" ? "bg-[#A8D5E5] animate-ping" : "bg-[#A8D5E5]/20"}`} />
          <span className="text-white/25 text-[10px]">Вдох</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${breathPhase === "задержка" ? "bg-[#E6B85C] animate-pulse" : "bg-[#E6B85C]/20"}`} />
          <span className="text-white/25 text-[10px]">Задержка</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${breathPhase === "выдох" ? "bg-[#7A9BBA] animate-ping" : "bg-[#7A9BBA]/20"}`} />
          <span className="text-white/25 text-[10px]">Выдох</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. BIOMETRIC WORKOUT VISUALIZER (Movement)
// ==========================================
interface BiometricWorkoutVisualizerProps {
  isActive: boolean;
  type: "running" | "walking" | "cycling";
  timePassed: number;
  distance: number;
}

export const BiometricWorkoutVisualizer: React.FC<BiometricWorkoutVisualizerProps> = ({
  isActive, type, timePassed, distance,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 360);
    const height = (canvas.height = 140);

    let step = 0;
    const pulseHistory: number[] = Array(50).fill(70);

    const getHeartRate = () => {
      if (type === "running") return 135 + Math.floor(Math.sin(timePassed / 10) * 10) + Math.floor(Math.random() * 3);
      if (type === "cycling") return 115 + Math.floor(Math.sin(timePassed / 15) * 8) + Math.floor(Math.random() * 2);
      return 85 + Math.floor(Math.sin(timePassed / 20) * 5) + Math.floor(Math.random() * 2);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 0.3;
      for (let x = 0; x < width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      step += 0.15;
      const bpm = getHeartRate();
      pulseHistory.push(bpm);
      if (pulseHistory.length > 55) pulseHistory.shift();

      ctx.strokeStyle = "#D4875E";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const waveStartY = height * 0.45;

      for (let i = 0; i < pulseHistory.length; i++) {
        const x = (width / 2) + (i * 3);
        let waveOffset = 0;
        const indexRatio = (step * 8 + i) % 30;
        if (isActive) {
          if (indexRatio < 2) waveOffset = -12;
          else if (indexRatio >= 4 && indexRatio < 6) waveOffset = 25;
          else if (indexRatio >= 6 && indexRatio < 8) waveOffset = -30;
          else if (indexRatio >= 11 && indexRatio < 14) waveOffset = -8;
        }
        const y = waveStartY + waveOffset + Math.sin(i * 0.15) * 1.5;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = "#D4875E";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`♥ ${bpm}`, 15, 40);

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = "8px monospace";
      ctx.fillText("ПУЛЬС (BPM)", 15, 52);

      const beatsPerSecond = bpm / 60;
      const isPulseSpark = Math.sin(Date.now() * 0.001 * Math.PI * beatsPerSecond) > 0.7;
      ctx.beginPath();
      ctx.arc(145, 33, isPulseSpark && isActive ? 5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = isPulseSpark && isActive ? "#D4875E" : "rgba(212, 135, 94, 0.2)";
      ctx.fill();

      ctx.save();
      const mapCX = 65;
      const mapCY = 100;
      const mapRadius = 22;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(mapCX, mapCY, mapRadius, 0, Math.PI * 2);
      ctx.stroke();

      const traceAngle = (timePassed * 0.05) % (Math.PI * 2);
      const dotX = mapCX + Math.cos(traceAngle) * mapRadius;
      const dotY = mapCY + Math.sin(traceAngle) * mapRadius;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#D4875E";
      ctx.fill();

      ctx.restore();

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText(`${distance.toFixed(3)} КМ`, 105, 94);

      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "8px monospace";
      ctx.fillText("ТРЕК", 105, 106);

      let speedText = "Шаг";
      if (type === "running") speedText = "Бег";
      else if (type === "cycling") speedText = "Вело";
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "8px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`РЕЖИМ: ${speedText.toUpperCase()}`, width - 15, 106);

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [isActive, type, timePassed, distance]);

  return <canvas ref={canvasRef} className="w-full h-[140px]" />;
};

// ==========================================
// 3. BRAINWAVE AUDIO SPECTRUM
// ==========================================
interface BrainwaveAudioSpectrumProps {
  isActive: boolean;
  glowIndex: number;
}

export const BrainwaveAudioSpectrum: React.FC<BrainwaveAudioSpectrumProps> = ({
  isActive, glowIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const colors = [
    "#7A9BBA", "#E6B85C", "#D4875E", "#A8D5E5",
    "#34C759", "#9B59B6", "#FF7979", "#2ECC71",
    "#1ABC9C", "#34495E",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 360);
    const height = (canvas.height = 130);

    let angle = 0;
    const waveColor = colors[glowIndex % colors.length] || "#7A9BBA";

    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.5 + Math.random() * 1.5,
      speed: 0.15 + Math.random() * 0.3,
      waveOffset: Math.random() * Math.PI,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angle += isActive ? 0.025 : 0.004;

      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += Math.sin(angle + p.waveOffset) * 0.1;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        ctx.fillStyle = waveColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const waveAmplitude = isActive ? 14 : 2;

      ctx.strokeStyle = waveColor;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height * 0.5 + Math.sin(x * 0.015 + angle) * waveAmplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = waveColor + "60";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height * 0.5 + Math.sin(x * 0.008 - angle * 0.7) * (waveAmplitude * 1.3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = waveColor + "25";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height * 0.52 + Math.cos(x * 0.004 + angle * 0.3) * (waveAmplitude * 1.8);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "8px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`ЧАСТОТА: ${isActive ? "4.5 ГЦ (THETA)" : "0.0 ГЦ (STATIC)"}`, 15, 18);

      ctx.textAlign = "right";
      ctx.fillText(`АМПЛИТУДА: ${isActive ? "ДИНАМИЧЕСКАЯ" : "СПЯЩИЙ РЕЖИМ"}`, width - 15, 18);

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [isActive, glowIndex]);

  return <canvas ref={canvasRef} className="w-full h-[130px]" />;
};

// ==========================================
// 4. AUDIO LEVEL SPECTROGRAM
// ==========================================
interface AudioLevelSpectrogramProps {
  isPlaying: boolean;
  color: string;
}

export const AudioLevelSpectrogram: React.FC<AudioLevelSpectrogramProps> = ({
  isPlaying, color,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 320);
    const height = (canvas.height = 60);
    const barsCount = 24;
    const barWidth = 5;
    const gap = 4;

    let timeAcc = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      timeAcc += isPlaying ? 0.06 : 0.004;

      const startX = (width - (barsCount * (barWidth + gap) - gap)) / 2;

      for (let i = 0; i < barsCount; i++) {
        const distFromCenter = Math.abs(i - (barsCount - 1) / 2);
        const centerFactor = Math.max(0.1, 1.0 - distFromCenter / ((barsCount - 1) / 1.5));

        let amplitude = 3;
        if (isPlaying) {
          amplitude = 4 + Math.sin(timeAcc + i * 0.8) * Math.cos(timeAcc * 0.4 + i) * 20 * centerFactor;
          amplitude = Math.max(3, Math.abs(amplitude));
        }

        const x = startX + i * (barWidth + gap);
        const y = (height - amplitude) / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + amplitude);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, amplitude, 2);
        ctx.fill();

        if (isPlaying && i % 4 === 0) {
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y + amplitude / 2, 6, 0, Math.PI * 2);
          ctx.fillStyle = color + "08";
          ctx.fill();
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [isPlaying, color]);

  return <canvas ref={canvasRef} className="w-full h-[60px]" />;
};

// ==========================================
// 5. FLUID GRADIENT BACKDROP
// ==========================================
interface GlobalVisualBackdropProps {
  activeBg: "water" | "sky" | "aurora" | "mystic" | "fire";
}

export const GlobalVisualBackdrop: React.FC<GlobalVisualBackdropProps> = ({ activeBg }) => {
  const getBlobs = () => {
    switch (activeBg) {
      case "water":
        return [
          { color: "#1e40af", size: "650px", top: "10%", left: "15%" },
          { color: "#0d9488", size: "550px", top: "50%", left: "60%" },
          { color: "#7A9BBA", size: "450px", top: "25%", left: "40%" },
        ];
      case "sky":
        return [
          { color: "#7c3aed", size: "650px", top: "15%", left: "10%" },
          { color: "#ec4899", size: "550px", top: "45%", left: "65%" },
          { color: "#A8D5E5", size: "450px", top: "30%", left: "35%" },
        ];
      case "aurora":
        return [
          { color: "#059669", size: "650px", top: "10%", left: "20%" },
          { color: "#10b981", size: "550px", top: "55%", left: "55%" },
          { color: "#0d9488", size: "450px", top: "20%", left: "45%" },
        ];
      default:
        return [
          { color: "#d97706", size: "650px", top: "10%", left: "20%" },
          { color: "#E6B85C", size: "550px", top: "50%", left: "55%" },
          { color: "#FBBF24", size: "450px", top: "30%", left: "40%" },
        ];
    }
  };

  const blobs = getBlobs();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-[120px] opacity-20 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at center, ${blob.color} 0%, transparent 70%)`,
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[35vw] h-[35vw] min-w-[300px] min-h-[300px] max-w-[600px] max-h-[600px] rounded-full border border-white/[0.02] animate-spin-slow" />
        <div className="absolute w-[28vw] h-[28vw] min-w-[240px] min-h-[240px] max-w-[480px] max-h-[480px] rounded-full border border-white/[0.015] animate-spin-slower" />
        <div className="absolute w-[42vw] h-[42vw] min-w-[360px] min-h-[360px] max-w-[720px] max-h-[720px] rounded-full border border-white/[0.01] animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white/5 animate-oura-pulse" />
      </div>
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
    </div>
  );
};

// ==========================================
// 6. WAVE RING
// ==========================================
interface WaveRingProps {
  score: number;
  color: string;
}

export const WaveRing: React.FC<WaveRingProps> = ({ score, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 176);
    const height = (canvas.height = 176);
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 72;

      angle += 0.03;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
      ctx.stroke();

      const fillPercent = score / 100;
      const liquidY = centerY + radius - (radius * 2 * fillPercent);

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
      ctx.clip();

      ctx.beginPath();
      for (let x = centerX - radius; x <= centerX + radius; x++) {
        const relativeX = x - (centerX - radius);
        const waveHeight = Math.sin(relativeX * 0.04 + angle) * 3.5 + Math.cos(relativeX * 0.02 - angle * 0.5) * 1.5;
        const y = liquidY + waveHeight;
        if (x === centerX - radius) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(centerX + radius, centerY + radius + 10);
      ctx.lineTo(centerX - radius, centerY + radius + 10);
      ctx.closePath();

      const gradientFront = ctx.createLinearGradient(centerX, liquidY - 10, centerX, centerY + radius);
      gradientFront.addColorStop(0, color);
      gradientFront.addColorStop(0.7, color + "15");
      gradientFront.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradientFront;
      ctx.fill();

      ctx.beginPath();
      for (let x = centerX - radius; x <= centerX + radius; x++) {
        const relativeX = x - (centerX - radius);
        const waveHeight = Math.cos(relativeX * 0.035 - angle * 0.8) * 4 + Math.sin(relativeX * 0.015 + angle * 0.3) * 2;
        const y = liquidY + waveHeight + 2;
        if (x === centerX - radius) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(centerX + radius, centerY + radius + 10);
      ctx.lineTo(centerX - radius, centerY + radius + 10);
      ctx.closePath();

      const gradientBack = ctx.createLinearGradient(centerX, liquidY - 20, centerX, centerY + radius);
      gradientBack.addColorStop(0, color + "40");
      gradientBack.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradientBack;
      ctx.fill();

      ctx.restore();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [score, color]);

  return <canvas ref={canvasRef} className="w-[176px] h-[176px]" />;
};

// ==========================================
// 7. RITUAL BREATHING CIRCLE (Standalone)
// ==========================================
interface RitualBreathingCircleProps {
  isActive: boolean;
  color: string;
}

export const RitualBreathingCircle: React.FC<RitualBreathingCircleProps> = ({
  isActive, color,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 260);
    const height = (canvas.height = 260);
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const now = Date.now();
      const cycleMs = 12000;
      const progress = (now % cycleMs) / cycleMs;

      let scale = 1.0;
      let phaseText = "Вдох";
      let phaseColor = color;

      if (progress < 0.33) {
        const t = progress / 0.33;
        scale = 0.7 + 0.6 * Math.sin((t * Math.PI) / 2);
        phaseText = "Глубокий Вдох";
      } else if (progress < 0.66) {
        const t = (progress - 0.33) / 0.33;
        scale = 1.3 + 0.04 * Math.sin(t * Math.PI * 2);
        phaseText = "Задержи Дыхание";
      } else {
        const t = (progress - 0.66) / 0.34;
        scale = 0.7 + 0.6 * (1.0 - Math.sin((t * Math.PI) / 2));
        phaseText = "Медленный Выдох";
      }

      angle += 0.008;
      const maxRadius = 50 * scale;
      const petalCount = 8;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      const gradientRadial = ctx.createRadialGradient(0, 0, 5, 0, 0, maxRadius * 1.5);
      gradientRadial.addColorStop(0, color + "15");
      gradientRadial.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradientRadial;
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < petalCount; i++) {
        ctx.rotate((Math.PI * 2) / petalCount);
        ctx.strokeStyle = phaseColor;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(maxRadius * 0.5, 0, maxRadius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = phaseColor + "05";
        ctx.fill();
      }

      ctx.restore();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = phaseColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();

      if (isActive) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(phaseText.toUpperCase(), centerX, centerY + 95);

        animationFrameId.current = requestAnimationFrame(render);
      }
    };

    if (isActive) {
      render();
    } else {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 40, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("НАЖМИ СТАРТ", width / 2, height / 2 + 3);
    }

    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [isActive, color]);

  return (
    <div className="flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="w-[260px] h-[260px]" />
    </div>
  );
};

// ==========================================
// 8. RITUAL SPECTROGRAM PLAYER
// ==========================================
interface RitualSpectrogramPlayerProps {
  isActive: boolean;
  color: string;
}

export const RitualSpectrogramPlayer: React.FC<RitualSpectrogramPlayerProps> = ({
  isActive, color,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = 320);
    const height = (canvas.height = 130);
    const barsCount = 28;
    const barWidth = 4;
    const gap = 3;

    let timeAcc = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      timeAcc += isActive ? 0.06 : 0.004;

      const startX = (width - (barsCount * (barWidth + gap) - gap)) / 2;

      for (let i = 0; i < barsCount; i++) {
        const distFromCenter = Math.abs(i - (barsCount - 1) / 2);
        const centerFactor = Math.max(0.1, 1.0 - distFromCenter / ((barsCount - 1) / 1.5));

        let amplitude = 4;
        if (isActive) {
          amplitude = 4 + Math.sin(timeAcc + i * 0.7) * Math.cos(timeAcc * 0.35 + i) * 22 * centerFactor;
          amplitude = Math.max(3, Math.abs(amplitude));
        }

        const x = startX + i * (barWidth + gap);
        const y = (height - amplitude) / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + amplitude);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, amplitude, 2);
        ctx.fill();

        if (isActive && i % 4 === 0) {
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y + amplitude / 2, 5, 0, Math.PI * 2);
          ctx.fillStyle = color + "08";
          ctx.fill();
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [isActive, color]);

  return <canvas ref={canvasRef} className="w-full h-[130px]" />;
};