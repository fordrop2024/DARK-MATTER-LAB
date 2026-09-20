/**
 * DARK MATTER LAB — Top Command Bar
 * Section 13 & 34: Space Observatory & AI Command Center Header
 * 
 * Features:
 * - Official Branding: DARK MATTER LAB • AI CONTENT PRODUCTION OS
 * - Project Repository Selector & Quick Initialization
 * - Active Workspace & Pipeline Phase Telemetry Badges
 * - Kernel Save & Synchronization Telemetry
 * - Active Asynchronous Job Counter with Warp Indicator
 * - Cosmic Visual Effects Controller (Cinematic Mode, Starfield, Warp Speed)
 * - Lightweight Manifest / Context Inspector Toggle
 */

import React, { useState } from 'react';
import {
  Cpu,
  ChevronDown,
  Plus,
  Activity,
  Layers2,
  Check,
  Sliders,
  Eye,
  EyeOff,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useMasterProjectContext } from '../../core/context/MasterProjectContext.tsx';
import { useCosmicEffects } from '../../core/cosmic/CosmicEffectsContext.tsx';
import { WORKSPACES, PRODUCTION_PHASES } from '../../types/constants.ts';

interface TopBarProps {
  onOpenNewProject: () => void;
  onToggleInspector: () => void;
  isInspectorOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenNewProject,
  onToggleInspector,
  isInspectorOpen,
}) => {
  const {
    projects,
    activeProject,
    activeWorkspace,
    activePhase,
    isSaving,
    selectProject,
    artifacts,
    assets,
    jobs,
  } = useMasterProjectContext();

  const {
    cinematicMode,
    toggleCinematic,
    starField,
    toggleStarField,
    milkyWay,
    toggleMilkyWay,
    quality,
    setQuality,
    warpSpeed,
    triggerWarp,
  } = useCosmicEffects();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEffectsMenuOpen, setIsEffectsMenuOpen] = useState(false);

  const currentWorkspaceConfig = WORKSPACES.find((w) => w.id === activeWorkspace);
  const currentPhaseConfig = PRODUCTION_PHASES.find((p) => p.id === activePhase);

  const activeJobsCount = jobs.filter((j) => j.status === 'RUNNING' || j.status === 'QUEUED').length;

  return (
    <header className="h-14 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between text-zinc-100 select-none z-30 shrink-0 shadow-lg">
      {/* 1. Brand & Project Selector */}
      <div className="flex items-center gap-4">
        {/* Official Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded bg-zinc-900/90 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <div className="absolute -inset-0.5 rounded bg-cyan-400/20 blur-[3px] pointer-events-none -z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider uppercase text-zinc-100 font-mono">
                DARK MATTER LAB
              </span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 font-bold tracking-wider">
                AI OS
              </span>
            </div>
            <div className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase leading-none">
              AI CONTENT PRODUCTION OS
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-zinc-800" />

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 transition text-xs font-medium text-zinc-200"
          >
            <span className="text-zinc-400 font-mono text-[10px]">PROJECT:</span>
            <span className="max-w-[180px] truncate font-semibold text-zinc-100 font-mono">
              {activeProject ? activeProject.name : 'No Project Selected'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-1" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-76 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-md shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800 flex justify-between items-center">
                <span>PROJECT REPOSITORY</span>
                <span>{projects.length} Total</span>
              </div>
              <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      selectProject(proj.id);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-zinc-800/80 transition"
                  >
                    <div className="truncate mr-2">
                      <div className="font-medium text-zinc-200 truncate">{proj.name}</div>
                      <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-2 mt-0.5">
                        <span className="uppercase text-cyan-400">{proj.mode}</span>
                        <span>•</span>
                        <span>Phase: {proj.activePhase}</span>
                      </div>
                    </div>
                    {activeProject?.id === proj.id && (
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-zinc-800">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenNewProject();
                  }}
                  className="w-full py-1.5 px-3 rounded bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>INITIALIZE NEW PROJECT</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick New Project Button */}
        <button
          onClick={onOpenNewProject}
          title="Initialize New Project Entity"
          className="p-1.5 rounded bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Active Phase & Workspace Badges */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900/70 border border-zinc-800/80 text-xs font-mono">
          <span className="text-zinc-400 text-[10px] uppercase">ACTIVE LAB:</span>
          <span className="text-cyan-400 font-semibold">{currentWorkspaceConfig?.name || activeWorkspace}</span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900/70 border border-zinc-800/80 text-xs font-mono">
          <span className="text-zinc-400 text-[10px] uppercase">ORBIT PHASE:</span>
          <span className="text-emerald-400 font-semibold">{currentPhaseConfig?.label || activePhase}</span>
        </div>

        {activeProject?.mode === 'movie_explainer' && (
          <span className="px-2 py-0.5 rounded bg-purple-950/50 border border-purple-800/60 text-purple-300 text-[10px] font-mono uppercase tracking-wider">
            MOVIE EXPLAINER
          </span>
        )}
      </div>

      {/* 3. System Status, Cosmic Effects Controls & Inspector */}
      <div className="flex items-center gap-3">
        {/* Cosmic Effects Configuration Menu */}
        <div className="relative">
          <button
            onClick={() => setIsEffectsMenuOpen((prev) => !prev)}
            title="Cosmic Environment Settings"
            className={`p-1.5 rounded text-xs font-mono transition border flex items-center gap-1.5 ${
              isEffectsMenuOpen || !cinematicMode
                ? 'bg-zinc-800 border-zinc-700 text-cyan-300'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] uppercase font-semibold">COSMIC FX</span>
          </button>

          {isEffectsMenuOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-64 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-md shadow-2xl p-3 z-50 space-y-3 font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-800 pb-1.5 flex items-center justify-between">
                <span>ENVIRONMENT RENDERER</span>
                <span className="text-cyan-400">{quality.toUpperCase()}</span>
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                <button
                  onClick={toggleCinematic}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 transition text-[11px]"
                >
                  <span>Cinematic Atmosphere</span>
                  <span className={cinematicMode ? 'text-cyan-400' : 'text-zinc-600'}>
                    {cinematicMode ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={toggleStarField}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 transition text-[11px]"
                >
                  <span>Star Field Engine</span>
                  <span className={starField ? 'text-cyan-400' : 'text-zinc-600'}>
                    {starField ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={toggleMilkyWay}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 transition text-[11px]"
                >
                  <span>Milky Way Flow</span>
                  <span className={milkyWay ? 'text-cyan-400' : 'text-zinc-600'}>
                    {milkyWay ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>

              {/* Quality Preset */}
              <div className="space-y-1 pt-1 border-t border-zinc-800/80">
                <div className="text-[10px] text-zinc-500 uppercase">GPU Profile</div>
                <div className="grid grid-cols-3 gap-1">
                  {(['high', 'medium', 'low'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`px-2 py-1 rounded text-[10px] uppercase transition font-bold ${
                        quality === q
                          ? 'bg-cyan-950/80 border border-cyan-500 text-cyan-300'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Warp Trigger */}
              <div className="pt-2 border-t border-zinc-800/80">
                <button
                  onClick={() => {
                    triggerWarp(3000);
                    setIsEffectsMenuOpen(false);
                  }}
                  className="w-full py-1.5 px-2 rounded bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                >
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>ENGAGE LIGHT-SPEED WARP</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Telemetry Indicator */}
        <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          {isSaving ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>SYNCING...</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-zinc-400">KERNEL ONLINE</span>
            </>
          )}
        </div>

        {/* AI Gateway Status Indicator */}
        <button
          onClick={onToggleInspector}
          className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900/90 border border-cyan-800/40 hover:border-cyan-500/70 text-cyan-300 text-[10px] font-mono uppercase tracking-wider transition"
          title="Server-Side Gemini AI Gateway & Orchestrator"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>AI GATEWAY</span>
        </button>

        {/* Active Jobs Pill */}
        {activeJobsCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-700/80 text-cyan-300 text-[11px] font-mono shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <Activity className="w-3 h-3 animate-spin text-cyan-400" />
            <span>{activeJobsCount} WARP JOB</span>
          </div>
        )}

        <div className="h-5 w-px bg-zinc-800" />

        {/* Manifest / Context Inspector Toggle */}
        <button
          onClick={onToggleInspector}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition border ${
            isInspectorOpen
              ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
              : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700'
          }`}
        >
          <Layers2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>MANIFEST</span>
          <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] text-zinc-300 font-semibold">
            {artifacts.length + assets.length}
          </span>
        </button>
      </div>
    </header>
  );
};
