/**
 * DARK MATTER LAB — AsteroidField
 * Section 7: Cinematic Orbital Asteroid Stream
 * 
 * Features:
 * - Procedural irregular polygonal asteroid silhouettes
 * - Multi-depth orbital drift and slow axial tumbling
 * - Distant atmospheric haze blending into deep space
 * - Subtle, unobtrusive rendering behind interactive panels
 */

import React, { useEffect, useRef } from 'react';
import { useCosmicEffects } from '../../core/cosmic/CosmicEffectsContext.tsx';

interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  vertices: { x: number; y: number }[];
  alpha: number;
  color: string;
}

export const AsteroidField: React.FC<{ className?: string; count?: number }> = ({
  className = '',
  count = 24,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { asteroidField, reducedMotion, quality } = useCosmicEffects();

  useEffect(() => {
    if (!asteroidField) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const actualCount = quality === 'high' ? count : Math.floor(count * 0.5);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate irregular polygon vertices for each asteroid
    const createAsteroid = (): Asteroid => {
      const radius = 3 + Math.random() * 8; // Small, distant silhouettes
      const points = 6 + Math.floor(Math.random() * 4);
      const vertices: { x: number; y: number }[] = [];

      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const dist = radius * (0.7 + Math.random() * 0.5);
        vertices.push({
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
        });
      }

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0.15 + Math.random() * 0.35,
        vy: -0.05 + (Math.random() - 0.5) * 0.1,
        radius,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        vertices,
        alpha: 0.15 + Math.random() * 0.25,
        color: Math.random() > 0.4 ? '#27272a' : '#3f3f46', // Distant rocky carbonaceous ch叩
      };
    };

    const asteroids: Asteroid[] = Array.from({ length: actualCount }, createAsteroid);
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < asteroids.length; i++) {
        const a = asteroids[i];

        if (!reducedMotion) {
          a.x += a.vx * dt * 60;
          a.y += a.vy * dt * 60;
          a.rotation += a.rotationSpeed * dt * 60;

          // Wrap boundaries
          if (a.x > width + 50) a.x = -50;
          if (a.y < -50) a.y = height + 50;
          if (a.y > height + 50) a.y = -50;
        }

        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.rotation);

        ctx.beginPath();
        if (a.vertices.length > 0) {
          ctx.moveTo(a.vertices[0].x, a.vertices[0].y);
          for (let v = 1; v < a.vertices.length; v++) {
            ctx.lineTo(a.vertices[v].x, a.vertices[v].y);
          }
          ctx.closePath();
        }

        ctx.fillStyle = a.color;
        ctx.globalAlpha = a.alpha;
        ctx.fill();

        // Subtle solar edge highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [asteroidField, count, reducedMotion, quality]);

  if (!asteroidField) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};
