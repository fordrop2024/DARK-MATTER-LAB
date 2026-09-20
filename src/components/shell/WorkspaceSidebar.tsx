/**
 * DARK MATTER LAB — Workspace Navigation Sidebar
 * Section 14: Spacecraft & Observatory Control Rail
 * 
 * Features:
 * - High-end spacecraft control deck vertical rail
 * - Grouped by 4 core operational phases: PRE-PRODUCTION, PRODUCTION, POST-PRODUCTION, DISTRIBUTION
 * - Cosmic active indicators with subtle orbital luminescence
 * - Clear readability with generous touch targets and keyboard accessibility
 */

import React from 'react';
import {
  TrendingUp,
  BookOpen,
  Lightbulb,
  Compass,
  FileText,
  Layers,
  Film,
  Headphones,
  Clapperboard,
  Scissors,
  SlidersHorizontal,
  Image,
  Search,
  Youtube,
  BarChart3,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { WORKSPACES } from '../../types/constants.ts';
import { WorkspaceId, WorkspaceConfig } from '../../types/domain.ts';
import { useMasterProjectContext } from '../../core/context/MasterProjectContext.tsx';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  TrendingUp,
  BookOpen,
  Lightbulb,
  Compass,
  FileText,
  Layers,
  Film,
  Headphones,
  Clapperboard,
  Scissors,
  SlidersHorizontal,
  Image,
  Search,
  Youtube,
  BarChart3,
};

export const WorkspaceSidebar: React.FC = () => {
  const { activeWorkspace, setActiveWorkspace, activeProject, artifacts } = useMasterProjectContext();

  const categories = ['PRE-PRODUCTION', 'PRODUCTION', 'POST-PRODUCTION', 'DISTRIBUTION'] as const;

  return (
    <aside className="w-64 bg-zinc-950/70 backdrop-blur-xl border-r border-zinc-800/80 flex flex-col justify-between shrink-0 select-none z-20 shadow-2xl">
      {/* Control Rail Header */}
      <div className="h-10 px-3.5 border-b border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900/30">
        <span className="flex items-center gap-1.5 text-zinc-300 font-bold">
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>WORKSTATION RAIL</span>
        </span>
        <span className="text-zinc-500">15 LABS</span>
      </div>

      {/* Workspaces Scrollable List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 custom-scrollbar">
        {categories.map((category) => {
          const categoryWorkspaces = WORKSPACES.filter((w) => w.category === category);

          return (
            <div key={category} className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-mono tracking-wider text-zinc-500 font-bold uppercase flex items-center justify-between">
                <span>{category}</span>
                <span className="text-[9px] text-zinc-600 font-mono">
                  {categoryWorkspaces.length}
                </span>
              </div>

              <div className="space-y-0.5">
                {categoryWorkspaces.map((ws: WorkspaceConfig) => {
                  const Icon = ICON_MAP[ws.iconName] || FileText;
                  const isActive = activeWorkspace === ws.id;

                  // Check if workspace has produced artifacts in this project
                  const hasOutputs = artifacts.some((a) =>
                    ws.outputsProduced.some((o) =>
                      a.name.toLowerCase().includes(o.slice(0, 5).toLowerCase())
                    )
                  );

                  return (
                    <button
                      key={ws.id}
                      onClick={() => setActiveWorkspace(ws.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-md flex items-center justify-between transition text-xs font-medium group relative ${
                        isActive
                          ? 'bg-cyan-950/40 border border-cyan-500/50 text-cyan-200 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border border-transparent'
                      }`}
                    >
                      {/* Active Orbital Marker */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-400 rounded-r shadow-[0_0_10px_rgba(6,182,212,0.9)]" />
                      )}

                      <div className="flex items-center gap-2.5 truncate mr-1.5">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition ${
                            isActive
                              ? 'text-cyan-400'
                              : 'text-zinc-500 group-hover:text-zinc-300'
                          }`}
                        />
                        <span className="truncate">{ws.name}</span>
                      </div>

                      {/* Right Status Dot */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasOutputs && (
                          <span
                            title="Artifacts locked"
                            className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                          />
                        )}
                        {isActive && (
                          <ChevronRight className="w-3 h-3 text-cyan-400/70 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer System Meta */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/80 text-zinc-400 text-[11px] font-mono space-y-1">
        <div className="flex justify-between items-center text-zinc-400">
          <span>COSMIC ORBIT</span>
          <span className="text-cyan-400 font-bold">13 PHASES</span>
        </div>
        <div className="text-[10px] text-zinc-500 truncate">
          Target Phase: {activeProject?.activePhase.toUpperCase() || 'STORY'}
        </div>
      </div>
    </aside>
  );
};
