import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Crystal3DProps {
  progressLevel: number;
  shineScore?: number;
}

export const Crystal3D: React.FC<Crystal3DProps> = ({ progressLevel, shineScore = 80 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 280;
    const height = mountRef.current.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.6;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, THREE.MathUtils.lerp(0.1, 0.3, shineScore / 100));
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xffffff, THREE.MathUtils.lerp(0.3, 1.2, shineScore / 100), 20);
    mainLight.position.set(3, 4, 3);
    scene.add(mainLight);

    const getTargetColor = () => {
      switch (progressLevel) {
        case 1: return 0xe6b85c;
        case 2: return 0xe6b85c;
        case 3: return 0x7a9bba;
        case 4: return 0xd4875e;
        case 5: return 0xa8d5e5;
        default: return 0xe6b85c;
      }
    };

    const fillLight = new THREE.PointLight(getTargetColor(), THREE.MathUtils.lerp(0.15, 1.5, shineScore / 100), 15);
    fillLight.position.set(-3, -2, -3);
    scene.add(fillLight);

    let glowLight: THREE.PointLight | null = null;
    if (shineScore >= 50 && progressLevel >= 2) {
      glowLight = new THREE.PointLight(getTargetColor(), ((shineScore - 50) / 50) * 1.0, 6);
      glowLight.position.set(0, 0, 0);
      scene.add(glowLight);
    }

    const scoreFactor = Math.max(0.3, Math.min(1.5, shineScore / 80));

    let crystalMesh: THREE.Mesh | null = null;
    let particleSystem: THREE.Points | null = null;
    let sparksGroup: THREE.Group | null = null;

    if (progressLevel === 0) {
      const fogGeo = new THREE.BufferGeometry();
      const count = 80;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2.5;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      }
      fogGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const fogMat = new THREE.PointsMaterial({
        color: 0x8e8e93,
        size: 0.06,
        transparent: true,
        opacity: 0.25,
      });
      particleSystem = new THREE.Points(fogGeo, fogMat);
      scene.add(particleSystem);

    } else if (progressLevel === 1) {
      const coreGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xe6b85c,
        transparent: true,
        opacity: Math.max(0.3, shineScore / 100),
      });
      crystalMesh = new THREE.Mesh(coreGeo, coreMat);
      scene.add(crystalMesh);

      const sparksGeo = new THREE.BufferGeometry();
      const count = 30;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 0.25 + Math.random() * 0.35;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
      }
      sparksGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const sparkPointsMat = new THREE.PointsMaterial({
        color: 0xe6b85c,
        size: 0.04,
        transparent: true,
        opacity: 0.5,
      });
      particleSystem = new THREE.Points(sparksGeo, sparkPointsMat);
      scene.add(particleSystem);

    } else {
      const crystalDetail = progressLevel >= 5 ? 2 : progressLevel >= 3 ? 1 : 0;
      const baseGeo = new THREE.IcosahedronGeometry(1.1, crystalDetail);
      const pos = baseGeo.attributes.position;
      const noiseAmt = 0.03 * (progressLevel >= 5 ? 3 : progressLevel >= 3 ? 2 : 1);
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const len = Math.sqrt(x*x + y*y + z*z);
        const n = 1 + (Math.random() - 0.5) * noiseAmt;
        pos.setXYZ(i, (x/len) * 1.1 * n, (y/len) * 1.1 * n, (z/len) * 1.1 * n);
      }
      pos.needsUpdate = true;
      baseGeo.computeVertexNormals();

      let matColor = 0xc9a96e;
      let customRoughness = 0.4;
      let customTransmission = 0.35;
      let isGlowSliver = false;
      let hasRainbowSparks = false;

      if (progressLevel === 3) {
        matColor = 0x7a9bba;
        customTransmission = 0.6;
        customRoughness = 0.2;
      } else if (progressLevel === 4) {
        matColor = 0x7a9bba;
        customTransmission = 0.7;
        customRoughness = 0.12;
        isGlowSliver = true;
      } else if (progressLevel === 5) {
        matColor = 0xa8d5e5;
        customTransmission = 0.9;
        customRoughness = 0.04;
        hasRainbowSparks = true;
      }

      let finalRoughness = customRoughness;
      let finalTransmission = customTransmission;
      let finalMetalness = 0.03;
      let finalClearcoat = 1.0;
      let finalClearcoatRoughness = 0.15;
      let finalOpacity = 0.8;

      const baseColor = new THREE.Color(matColor);

      if (shineScore < 50) {
        const factor = (50 - shineScore) / 50;
        finalRoughness = THREE.MathUtils.lerp(customRoughness, 0.9, factor);
        finalTransmission = THREE.MathUtils.lerp(customTransmission, 0.03, factor);
        finalClearcoat = THREE.MathUtils.lerp(1.0, 0.0, factor);
        finalClearcoatRoughness = THREE.MathUtils.lerp(0.15, 1.0, factor);
        finalMetalness = 0.0;
        finalOpacity = THREE.MathUtils.lerp(0.8, 0.95, factor);
        const dullColor = new THREE.Color(0x3e3f42);
        baseColor.lerp(dullColor, factor * 0.6);
      } else {
        const factor = (shineScore - 50) / 50;
        finalRoughness = THREE.MathUtils.lerp(customRoughness, 0.01, factor);
        finalTransmission = THREE.MathUtils.lerp(customTransmission, 0.95, factor);
        finalClearcoat = 1.0;
        finalClearcoatRoughness = THREE.MathUtils.lerp(0.15, 0.02, factor);
        finalMetalness = THREE.MathUtils.lerp(0.03, 0.18, factor);
        finalOpacity = THREE.MathUtils.lerp(0.8, 0.6, factor);
        const extraBright = new THREE.Color(progressLevel === 5 ? 0xffffff : matColor);
        baseColor.lerp(extraBright, factor * 0.25);
      }

      const crystalMaterial = new THREE.MeshPhysicalMaterial({
        color: baseColor,
        metalness: finalMetalness,
        roughness: finalRoughness,
        transmission: finalTransmission,
        ior: 1.6,
        thickness: 1.0,
        specularIntensity: shineScore / 50,
        clearcoat: finalClearcoat,
        clearcoatRoughness: finalClearcoatRoughness,
        flatShading: true,
        transparent: true,
        opacity: finalOpacity,
      });

      crystalMesh = new THREE.Mesh(baseGeo, crystalMaterial);
      scene.add(crystalMesh);

      const edgeGeo = new THREE.EdgesGeometry(baseGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: matColor,
        transparent: true,
        opacity: 0.08 + (shineScore / 100) * 0.12,
      });
      const edgeWire = new THREE.LineSegments(edgeGeo, edgeMat);
      crystalMesh.add(edgeWire);

      if (isGlowSliver) {
        sparksGroup = new THREE.Group();
        const fireGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const fireMat = new THREE.MeshBasicMaterial({
          color: 0xd4875e,
          transparent: true,
          opacity: 0.4,
        });
        const topTip = new THREE.Mesh(fireGeo, fireMat);
        topTip.position.set(0, 1.1, 0);
        const bottomTip = topTip.clone();
        bottomTip.position.set(0, -1.1, 0);
        sparksGroup.add(topTip);
        sparksGroup.add(bottomTip);
        crystalMesh.add(sparksGroup);
      }

      if (hasRainbowSparks) {
        const rainbowGeo = new THREE.BufferGeometry();
        const rCount = 25;
        const positions = new Float32Array(rCount * 3);
        const colors = new Float32Array(rCount * 3);
        const rColors = [0x7a9bba, 0xe6b85c, 0xa8d5e5, 0xd4875e];

        for (let i = 0; i < rCount; i++) {
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(Math.random() * 2 - 1);
          const dist = 1.3 + Math.random() * 0.3;
          positions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = dist * Math.cos(phi);
          const randomColor = new THREE.Color(rColors[Math.floor(Math.random() * rColors.length)]);
          colors[i * 3] = randomColor.r;
          colors[i * 3 + 1] = randomColor.g;
          colors[i * 3 + 2] = randomColor.b;
        }

        rainbowGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        rainbowGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const customMat = new THREE.PointsMaterial({
          size: 0.06,
          vertexColors: true,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
        });
        particleSystem = new THREE.Points(rainbowGeo, customMat);
        scene.add(particleSystem);
      }
    }

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocityX = 0;
    let velocityY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      velocityX = 0; velocityY = 0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaMove = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y };
      velocityY = deltaMove.x * 0.009;
      velocityX = deltaMove.y * 0.009;
      currentRotationY += velocityY;
      currentRotationX += velocityX;
      if (crystalMesh) { crystalMesh.rotation.y = currentRotationY; crystalMesh.rotation.x = currentRotationX; }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        velocityX *= 0.95;
        velocityY *= 0.95;
        const idleSpeed = 0.004 * scoreFactor * (isHovered ? 1.5 : 1.0);
        currentRotationY += velocityY + idleSpeed;
        currentRotationX += velocityX;
        if (crystalMesh) {
          crystalMesh.rotation.y = currentRotationY;
          crystalMesh.rotation.x = currentRotationX;
          crystalMesh.rotation.z = Math.sin(elapsedTime * 0.4) * 0.03;
        }
        if (particleSystem) { particleSystem.rotation.y += 0.002 * scoreFactor; }
      }

      if (progressLevel === 1 && crystalMesh) {
        const scaleVal = 0.9 + Math.sin(elapsedTime * (2 * Math.PI / 5)) * 0.12;
        crystalMesh.scale.set(scaleVal, scaleVal, scaleVal);
        if (particleSystem) particleSystem.rotation.y += 0.012;
      }

      if (progressLevel >= 2 && crystalMesh) {
        const breatheFactor = 1.0 + Math.sin(elapsedTime * 1.2) * 0.02 * scoreFactor;
        crystalMesh.scale.set(breatheFactor, breatheFactor, breatheFactor);
      }

      if (sparksGroup) {
        sparksGroup.children.forEach((child, index) => {
          const glowMesh = child as THREE.Mesh;
          const pulse = 1.0 + Math.sin(elapsedTime * 3 + index) * 0.2;
          glowMesh.scale.set(pulse, pulse, pulse);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (renderer && renderer.domElement && mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [progressLevel, shineScore, isHovered]);

  const getGlowColorHex = () => {
    switch (progressLevel) {
      case 1: return "#e6b85c";
      case 2: return "#c9a96e";
      case 3: return "#7a9bba";
      case 4: return "#d4875e";
      case 5: return "#a8d5e5";
      default: return "#c9a96e";
    }
  };

  const getStageMessage = () => {
    switch (progressLevel) {
      case 0: return "Туман. Начни путь.";
      case 1: return "Искра.";
      case 2: return "Кристалл Истока.";
      case 3: return "Сияние Тишины.";
      case 4: return "Энергия.";
      case 5: return "Ясность.";
      default: return "";
    }
  };

  const glowColorHex = getGlowColorHex();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col justify-center items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute w-40 h-40 rounded-full blur-[80px] pointer-events-none transition-all duration-[2s]"
        style={{
          background: `radial-gradient(circle, ${glowColorHex} 0%, transparent 70%)`,
          opacity: shineScore >= 50 ? 0.15 + ((shineScore - 50) / 50) * 0.25 : 0.03,
          transform: `scale(${shineScore >= 50 ? 1.0 : 0.7})`,
        }}
      />

      <div ref={mountRef} className="w-[260px] h-[260px] cursor-grab active:cursor-grabbing relative" />

      <p className="mt-1 text-[10px] font-mono text-center text-white/30 tracking-wider">
        {getStageMessage()}
      </p>
    </div>
  );
};