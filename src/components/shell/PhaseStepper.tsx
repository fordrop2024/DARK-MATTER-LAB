/**
 * DARK MATTER LAB — Master Production Cosmic Pipeline Stepper
 * Section 18: Master Pipeline Celestial Trajectory
 * 
 * Visual Language:
 * - Completed stages: subtle stable glow (emerald star beacon)
 * - Current stage: active orbital energy with celestial pulse
 * - Future stages: dimmed celestial coordinates
 * - Seamless handoffs between fixed pipeline phases
 */

import React from 'react';
import { ChevronRight, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { PRODUCTION_PHASES } from '../../types/constants.ts';
import { PhaseId } from '../../types/domain.ts';
import { useMasterProjectContext } from '../../core/context/MasterProjectContext.tsx';

export const PhaseStepper: React.FC = () => {
  const { activePhase, setActivePhase, setActiveWorkspace } = useMasterProjectContext();

  const currentPhaseIndex = PRODUCTION_PHASES.findIndex((p) => p.id === activePhase);

  const handlePhaseClick = (phaseId: PhaseId, primaryWorkspace: any) => {
    setActivePhase(phaseId);
    if (primaryWorkspace) {
      setActiveWorkspace(primaryWorkspace);
    }
  };

  return (
    <nav
      aria-label="Cosmic Production Trajectory"
      className="h-10 bg-zinc-950/75 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center overflow-x-auto select-none no-scrollbar shrink-0 z-20"
    >
      <div className="flex items-center gap-2 min-w-max">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold mr-1 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>TRAJECTORY:</span>
        </span>

        {PRODUCTION_PHASES.map((phase, index) => {
          const isActive = phase.id === activePhase;
          const isPassed = index < currentPhaseIndex;
          const isUpcoming = index > currentPhaseIndex;

          return (
            <React.Fragment key={phase.id}>
              <button
                onClick={() => handlePhaseClick(phase.id, phase.primaryWorkspace)}
                title={`${phase.label} (${phase.description})`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition group relative ${
                  isActive
                    ? 'bg-cyan-950/70 border border-cyan-500/70 text-cyan-200 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : isPassed
                    ? 'bg-zinc-900/50 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700'
                    : 'bg-transparent border border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {/* Active Orbital Energy Indicator */}
                {isActive ? (
                  <span className="relative flex h-2 w-2 mr-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                  </span>
                ) : isPassed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400/90 shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                ) : (
                  <Circle className="w-2.5 h-2.5 text-zinc-600 shrink-0" />
                )}

                <span className="tracking-tight whitespace-nowrap">
                  {phase.label}
                </span>

                <span
                  className={`text-[9px] font-mono ml-0.5 ${
                    isActive ? 'text-cyan-400' : 'text-zinc-500'
                  }`}
                >
                  {phase.order.toString().padStart(2, '0')}
                </span>
              </button>

              {/* Trajectory Vector Separator */}
              {index < PRODUCTION_PHASES.length - 1 && (
                <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
