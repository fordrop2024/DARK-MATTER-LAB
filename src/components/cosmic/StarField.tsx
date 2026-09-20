/**
 * DARK MATTER LAB — StarField Engine
 * Section 6: High-Performance Multi-Layer Cosmic Star Field
 * 
 * Features:
 * - Multi-depth star distribution (deep dust, mid field, luminous primary stars)
 * - Micro-twinkle & orbital drift
 * - Seamless radial light-speed streak acceleration during Warp Speed
 * - Performance guard: pauses on tab blur, scales particle count based on quality setting
 * - Respects prefers-reduced-motion
 */

import React, { useEffect, useRef } from 'react';
import { useCosmicEffects } from '../../core/cosmic/CosmicEffectsContext.tsx';

interface Star {
  x: number;
  y: number;
  z: number; // depth: 0 (furthest) to 1 (closest)
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

export const StarField: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { starField, warpSpeed, reducedMotion, quality } = useCosmicEffects();

  useEffect(() => {
    if (!starField) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = !document.hidden;

    // Determine star count based on quality setting
    const countMultiplier = quality === 'high' ? 1 : quality === 'medium' ? 0.6 : 0.3;
    const baseCount = Math.floor(650 * countMultiplier);

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Palettes for realistic astronomical spectral types
    const starColors = [
      '#ffffff', // Class A/F white
      '#e0f2fe', // Class B light blue
      '#bae6fd', // Deep blue tint
      '#fef08a', // Class G solar yellow/white
      '#fed7aa', // Class K soft amber
      '#c7d2fe', // Soft indigo
    ];

    const stars: Star[] = [];
    for (let i = 0; i < baseCount; i++) {
      const z = Math.random();
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        size: z > 0.9 ? 1.8 + Math.random() * 0.8 : z > 0.6 ? 1.0 + Math.random() * 0.5 : 0.4 + Math.random() * 0.4,
        baseAlpha: z > 0.85 ? 0.8 : z > 0.5 ? 0.45 : 0.2,
        alpha: 0.2 + Math.random() * 0.5,
        twinkleSpeed: 0.005 + Math.random() * 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    let warpProgress = 0; // 0 = normal drift, 1 = maximum warp speed
    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smoothly interpolate warp factor
      const targetWarp = warpSpeed ? 1 : 0;
      warpProgress += (targetWarp - warpProgress) * (warpSpeed ? 0.06 : 0.04);

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Normal space drift speed
      const driftSpeed = reducedMotion ? 0 : 4;
      const warpSpeedFactor = 380;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (warpProgress > 0.02) {
          // WARP SPEED MODE: Radial light streaks outward from center
          const dx = star.x - centerX;
          const dy = star.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = dx / dist;
          const ny = dy / dist;

          const speed = (star.z * warpSpeedFactor * warpProgress + driftSpeed) * dt * 60;
          star.x += nx * speed;
          star.y += ny * speed;

          // Wrap around screen when crossing boundary
          if (star.x < 0 || star.x > width || star.y < 0 || star.y > height) {
            const angle = Math.random() * Math.PI * 2;
            const spawnDist = Math.random() * 80 + 10;
            star.x = centerX + Math.cos(angle) * spawnDist;
            star.y = centerY + Math.sin(angle) * spawnDist;
          }

          // Draw relativistic streak
          const streakLength = Math.min(dist * 0.25 * warpProgress + 8, 120);
          const tailX = star.x - nx * streakLength;
          const tailY = star.y - ny * streakLength;

          const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0)');
          gradient.addColorStop(0.7, 'rgba(125, 211, 252, 0.6)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = star.size * (1 + warpProgress * 0.8);
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();
        } else {
          // NORMAL DRIFT MODE
          if (!reducedMotion) {
            star.twinklePhase += star.twinkleSpeed;
            star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.18;

            // Slow cosmic drift based on depth layer
            star.y -= (0.08 + star.z * 0.12) * driftSpeed * dt * 10;
            if (star.y < 0) {
              star.y = height;
              star.x = Math.random() * width;
            }
          }

          ctx.beginPath();
          ctx.fillStyle = star.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();

          // Subtle corona / diffraction spikes for luminous foreground stars
          if (star.z > 0.92 && quality !== 'low') {
            ctx.fillStyle = 'rgba(224, 242, 254, 0.15)';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [starField, warpSpeed, reducedMotion, quality]);

  if (!starField) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};
