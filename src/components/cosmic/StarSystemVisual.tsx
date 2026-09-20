/**
 * DARK MATTER LAB — StarSystemVisual
 * Section 9 & 17: Scientific Star System & Project Orbit Engine
 * 
 * Features:
 * - Central Primary Star with subtle coronal energy pulse (Project Core)
 * - Concentric astronomical orbital rings with scientific markings
 * - Orbiting planetary stations representing pipeline production nodes
 * - Interactive node inspection & workspace navigation
 * - Precision scientific aesthetic (cool whites, cyan telemetry, restrained orbital paths)
 */

import React, { useState } from 'react';
import { WorkspaceId } from '../../types/domain.ts';
import { WORKSPACES } from '../../types/constants.ts';
import { useMasterProjectContext } from '../../core/context/MasterProjectContext.tsx';

interface StarSystemVisualProps {
  className?: string;
  onSelectWorkspace?: (wsId: WorkspaceId) => void;
  activeWorkspaceId?: WorkspaceId;
  interactive?: boolean;
}

interface OrbitNode {
  id: WorkspaceId;
  label: string;
  radius: number; // distance from sun in px
  speed: number; // orbital period seconds
  size: number; // planet size in px
  color: string;
  category: string;
  phaseOrder: number;
}

const ORBIT_NODES: OrbitNode[] = [
  { id: 'trend', label: 'TREND', radius: 70, speed: 28, size: 7, color: '#38bdf8', category: 'PRE-PROD', phaseOrder: 1 },
  { id: 'research', label: 'RESEARCH', radius: 105, speed: 38, size: 8, color: '#818cf8', category: 'PRE-PROD', phaseOrder: 2 },
  { id: 'idea', label: 'IDEA', radius: 140, speed: 48, size: 7, color: '#a78bfa', category: 'PRE-PROD', phaseOrder: 3 },
  { id: 'story', label: 'STORY', radius: 175, speed: 60, size: 9, color: '#34d399', category: 'PRE-PROD', phaseOrder: 4 },
  { id: 'script', label: 'SCRIPT', radius: 210, speed: 72, size: 8, color: '#facc15', category: 'PRE-PROD', phaseOrder: 5 },
  { id: 'scene_plan', label: 'SCENE PLAN', radius: 245, speed: 85, size: 7, color: '#fb923c', category: 'PRODUCTION', phaseOrder: 6 },
  { id: 'movie', label: 'MOVIE INTEL', radius: 280, speed: 100, size: 10, color: '#c084fc', category: 'PRODUCTION', phaseOrder: 7 },
  { id: 'audio', label: 'AUDIO STUDIO', radius: 315, speed: 115, size: 8, color: '#22d3ee', category: 'POST-PROD', phaseOrder: 8 },
  { id: 'video', label: 'VIDEO ENGINE', radius: 350, speed: 130, size: 9, color: '#60a5fa', category: 'PRODUCTION', phaseOrder: 9 },
  { id: 'editor', label: 'PRO EDITOR', radius: 385, speed: 150, size: 11, color: '#06b6d4', category: 'POST-PROD', phaseOrder: 10 },
  { id: 'youtube', label: 'YOUTUBE STUDIO', radius: 420, speed: 175, size: 9, color: '#f43f5e', category: 'DISTRIB', phaseOrder: 11 },
  { id: 'analytics', label: 'ANALYTICS', radius: 455, speed: 200, size: 8, color: '#10b981', category: 'DISTRIB', phaseOrder: 12 },
];

export const StarSystemVisual: React.FC<StarSystemVisualProps> = ({
  className = '',
  onSelectWorkspace,
  activeWorkspaceId,
  interactive = true,
}) => {
  const { activeProject } = useMasterProjectContext();
  const [hoveredNode, setHoveredNode] = useState<OrbitNode | null>(null);

  const containerSize = 980;
  const center = containerSize / 2;

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{ width: containerSize, height: containerSize }}
    >
      {/* Background astronomical coordinates & grid reticle */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
        <div className="w-full h-px bg-cyan-500/30" />
        <div className="h-full w-px bg-cyan-500/30 absolute" />
        <div className="w-3/4 h-3/4 rounded-full border border-dashed border-zinc-700/50 absolute" />
      </div>

      <svg
        className="w-full h-full absolute inset-0 pointer-events-none"
        viewBox={`0 0 ${containerSize} ${containerSize}`}
      >
        {/* Concentric orbital paths */}
        {ORBIT_NODES.map((node) => {
          const isActive = activeWorkspaceId === node.id;
          return (
            <g key={`orbit-${node.id}`}>
              <circle
                cx={center}
                cy={center}
                r={node.radius}
                fill="none"
                stroke={isActive ? 'rgba(6, 182, 212, 0.45)' : 'rgba(82, 82, 91, 0.25)'}
                strokeWidth={isActive ? 1.5 : 0.75}
                strokeDasharray={isActive ? '4 2' : '2 4'}
              />
              {/* Scientific angle markers */}
              <text
                x={center + node.radius + 4}
                y={center - 3}
                fill="rgba(113, 113, 122, 0.6)"
                fontSize="8"
                fontFamily="monospace"
              >
                {node.radius} AU
              </text>
            </g>
          );
        })}
      </svg>

      {/* Central Primary Star (The Project Singularity / Star Core) */}
      <div
        className="absolute z-20 flex flex-col items-center justify-center rounded-full transition-all duration-500"
        style={{
          width: 72,
          height: 72,
          boxShadow: '0 0 45px rgba(6, 182, 212, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.6)',
          background: 'radial-gradient(circle, #ffffff 0%, #38bdf8 45%, #0369a1 85%, #082f49 100%)',
        }}
      >
        <div className="text-[9px] font-mono font-bold text-zinc-950 uppercase tracking-tighter text-center leading-none px-1">
          PROJECT
        </div>
        <div className="text-[7px] font-mono text-cyan-950 uppercase tracking-widest mt-0.5">
          CORE
        </div>
      </div>

      {/* Orbiting Planetary Nodes */}
      {ORBIT_NODES.map((node, index) => {
        const isActive = activeWorkspaceId === node.id;
        const isHovered = hoveredNode?.id === node.id;

        // Spread initial phase angles so planets don't bunch up
        const initialAngle = (index * (360 / ORBIT_NODES.length) * Math.PI) / 180;

        return (
          <div
            key={node.id}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="absolute pointer-events-auto"
              style={{
                animation: `orbitSpin ${node.speed}s linear infinite`,
                width: node.radius * 2,
                height: node.radius * 2,
              }}
            >
              {/* Planetary Station on Orbit Rim */}
              <div
                onClick={() => onSelectWorkspace && onSelectWorkspace(node.id)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group flex items-center justify-center ${
                  isActive ? 'scale-125 z-30' : 'hover:scale-125 z-20'
                }`}
                style={{
                  width: node.size * 2,
                  height: node.size * 2,
                }}
              >
                {/* Planet Body */}
                <div
                  className="rounded-full transition-all duration-300 shadow-md"
                  style={{
                    width: node.size,
                    height: node.size,
                    backgroundColor: node.color,
                    boxShadow: isActive
                      ? `0 0 12px ${node.color}, 0 0 4px #ffffff`
                      : isHovered
                      ? `0 0 8px ${node.color}`
                      : 'none',
                  }}
                />

                {/* Planetary Ring for selected larger nodes */}
                {node.size >= 10 && (
                  <div
                    className="absolute rounded-full border border-cyan-400/40 pointer-events-none"
                    style={{
                      width: node.size * 2.2,
                      height: node.size * 0.9,
                      transform: 'rotate(-25deg)',
                    }}
                  />
                )}

                {/* Node Label Tooltip on Hover or Active */}
                {(isHovered || isActive) && (
                  <div
                    className="absolute -top-7 whitespace-nowrap px-2 py-0.5 rounded bg-zinc-950/90 border border-zinc-700/80 text-[10px] font-mono shadow-xl z-40 flex items-center gap-1.5"
                    style={{
                      borderColor: isActive ? '#06b6d4' : undefined,
                      animation: 'none',
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                    <span className="text-zinc-200 font-bold">{node.label}</span>
                    <span className="text-zinc-500 text-[9px] font-mono">
                      #{node.phaseOrder}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Orbit Animation Keyframes inline styles */}
      <style>{`
        @keyframes orbitSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
