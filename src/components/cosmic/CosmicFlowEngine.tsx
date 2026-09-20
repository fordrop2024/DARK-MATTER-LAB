/**
 * DARK MATTER LAB — CosmicFlowEngine
 * Section 5: Milky Way & Galactic Structure Flow Engine
 * 
 * Features:
 * - Distant galactic arm structure & interstellar dust lanes
 * - Parallax depth layers with slow, physically inspired galactic rotation
 * - Subtle chromatic dust gradients (deep indigo, cyan, cosmic purple, interstellar dust amber)
 * - Calibrated opacity to ensure 100% UI readability
 */

import React, { useEffect, useRef } from 'react';
import { useCosmicEffects } from '../../core/cosmic/CosmicEffectsContext.tsx';

export const CosmicFlowEngine: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { milkyWay, reducedMotion, quality } = useCosmicEffects();

  useEffect(() => {
    if (!milkyWay) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Galactic clusters data
    const clusterCount = quality === 'high' ? 8 : 4;
    const clusters = Array.from({ length: clusterCount }).map((_, i) => ({
      angle: (i / clusterCount) * Math.PI * 2,
      dist: 180 + Math.random() * 320,
      radius: 80 + Math.random() * 140,
      alpha: 0.03 + Math.random() * 0.04,
      hue: i % 2 === 0 ? 195 : 265, // Cyan or Violet
    }));

    let rotationAngle = 0;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!reducedMotion) {
        // Extremely slow rotation: full turn takes several minutes
        rotationAngle += 0.008 * dt;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.65;
      const cy = height * 0.45;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotationAngle);

      // 1. Galactic Core Diffuse Glow
      const coreGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, width * 0.45);
      coreGrad.addColorStop(0, 'rgba(14, 165, 233, 0.07)'); // soft cyan
      coreGrad.addColorStop(0.3, 'rgba(99, 102, 241, 0.04)'); // indigo
      coreGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.02)'); // violet
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.55, height * 0.28, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Interstellar Dust Lanes (Curved galactic arms)
      const armGrad = ctx.createLinearGradient(-width * 0.4, -height * 0.3, width * 0.4, height * 0.3);
      armGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      armGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.03)');
      armGrad.addColorStop(0.55, 'rgba(139, 92, 246, 0.035)');
      armGrad.addColorStop(0.8, 'rgba(217, 119, 6, 0.015)'); // faint warm dust
      armGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = armGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, width * 0.65, height * 0.18, -Math.PI / 4.5, 0, Math.PI * 2);
      ctx.fill();

      // 3. Galactic Clusters
      clusters.forEach((c) => {
        const x = Math.cos(c.angle + rotationAngle * 0.5) * c.dist;
        const y = Math.sin(c.angle + rotationAngle * 0.5) * (c.dist * 0.45);

        const g = ctx.createRadialGradient(x, y, 0, x, y, c.radius);
        g.addColorStop(0, `hsla(${c.hue}, 85%, 65%, ${c.alpha})`);
        g.addColorStop(0.5, `hsla(${c.hue}, 70%, 50%, ${c.alpha * 0.4})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, c.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [milkyWay, reducedMotion, quality]);

  if (!milkyWay) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-90 ${className}`}
    />
  );
};
