/**
 * DARK MATTER LAB — BlackHoleVisual
 * Section 8: Gravitational Lensing & Event Horizon Visual Engine
 * 
 * Features:
 * - Pure dark central singularity (Event Horizon)
 * - Luminous photon ring / gravitational lensing curvature
 * - Accretion disk with relativistic Doppler beaming asymmetry (blueshifted brighter side)
 * - Infalling particle vortex curving into the gravity well
 * - Ultra-lightweight canvas/SVG composite (no heavy WebGL shaders)
 */

import React, { useEffect, useRef } from 'react';
import { useCosmicEffects } from '../../core/cosmic/CosmicEffectsContext.tsx';

interface InfallingParticle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
}

export const BlackHoleVisual: React.FC<{
  className?: string;
  size?: number;
  showParticles?: boolean;
}> = ({ className = '', size = 320, showParticles = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { blackHole, reducedMotion, quality } = useCosmicEffects();

  useEffect(() => {
    if (!blackHole) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = size);
    const height = (canvas.height = size);
    const cx = width / 2;
    const cy = height / 2;
    const eventHorizonRadius = size * 0.18;

    // Infalling particle trails
    const particleCount = quality === 'high' ? 36 : 18;
    const particles: InfallingParticle[] = Array.from({ length: particleCount }).map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: eventHorizonRadius * 1.4 + Math.random() * (size * 0.32),
      speed: 0.012 + Math.random() * 0.02,
      size: 0.8 + Math.random() * 1.2,
      alpha: 0.3 + Math.random() * 0.5,
    }));

    let diskRotation = 0;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!reducedMotion) {
        diskRotation += 0.015 * dt * 60;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Gravitational Lensing Outer Halo (Bending distant starlight)
      const lensGrad = ctx.createRadialGradient(cx, cy, eventHorizonRadius, cx, cy, size * 0.48);
      lensGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)'); // cyan photon ring
      lensGrad.addColorStop(0.15, 'rgba(99, 102, 241, 0.15)'); // indigo bend
      lensGrad.addColorStop(0.45, 'rgba(168, 85, 247, 0.06)');
      lensGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = lensGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.48, 0, Math.PI * 2);
      ctx.fill();

      // 2. Tilted Accretion Disk (with Relativistic Doppler Beaming)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 10); // tilt disk in space
      ctx.scale(1, 0.38); // oblique perspective

      // Outer accretion disk gradient
      const diskGrad = ctx.createRadialGradient(0, 0, eventHorizonRadius * 1.1, 0, 0, size * 0.44);
      diskGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)'); // brilliant inner edge
      diskGrad.addColorStop(0.15, 'rgba(56, 189, 248, 0.7)'); // blue-shifted ion gas
      diskGrad.addColorStop(0.4, 'rgba(99, 102, 241, 0.45)');
      diskGrad.addColorStop(0.75, 'rgba(192, 132, 252, 0.2)');
      diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = diskGrad;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.44, 0, Math.PI * 2);
      ctx.fill();

      // Doppler Beaming Asymmetry (left side moving toward observer is brighter)
      const beamGrad = ctx.createLinearGradient(-size * 0.4, 0, size * 0.4, 0);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      beamGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
      beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.44, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 3. Photon Sphere Ring (Sharp, intense boundary where photons orbit)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, eventHorizonRadius * 1.08, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();

      // 4. Infalling Relativistic Particles
      if (showParticles) {
        ctx.fillStyle = '#e0f2fe';
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (!reducedMotion) {
            p.angle += p.speed;
            p.radius -= 0.15; // spiral inward

            if (p.radius < eventHorizonRadius) {
              p.radius = eventHorizonRadius * 1.4 + Math.random() * (size * 0.3);
              p.angle = Math.random() * Math.PI * 2;
            }
          }

          // Elliptical distortion based on disk inclination
          const px = cx + Math.cos(p.angle) * p.radius;
          const py = cy + Math.sin(p.angle) * (p.radius * 0.5);

          ctx.globalAlpha = p.alpha * ((p.radius - eventHorizonRadius) / (size * 0.3));
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // 5. Central Event Horizon (Complete Void / Infinite Absorption)
      ctx.fillStyle = '#030508';
      ctx.beginPath();
      ctx.arc(cx, cy, eventHorizonRadius, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [blackHole, size, showParticles, reducedMotion, quality]);

  if (!blackHole) return null;

  return (
    <div className={`relative inline-block select-none pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="block" />
      {/* Outer subtle cosmic pulse aura */}
      <div
        className="absolute inset-0 rounded-full blur-2xl pointer-events-none bg-cyan-500/10"
        style={{ transform: 'scale(0.85)' }}
      />
    </div>
  );
};
