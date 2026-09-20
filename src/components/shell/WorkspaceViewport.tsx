/**
 * DARK MATTER LAB — Workspace Viewport & Project Command Deck
 * Sections 10, 11, 15, 16, & 17: Creative Command Center Stage
 * 
 * Strict Adherence:
 * - No fake implementations. Clearly identify placeholder state.
 * - Dual Stage Views:
 *   1. WORKSPACE LAB VIEW: Workspace-specific cosmic atmosphere, handoff prerequisites, locked deliverables, and async kernel jobs.
 *   2. PROJECT ORBIT / COMMAND DECK VIEW: Interactive scientific StarSystemVisual mapping the 15 workspaces orbiting the project core.
 * - Real integration with CosmicProgressEngine and StarField light-speed warp speed on job run.
 */

import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe2,
  SlidersHorizontal,
  Compass,
  Sparkles,
  Radio,
  FileCode2,
} from 'lucide-react';
import { WORKSPACES, PRODUCTION_PHASES } from '../../types/constants.ts';
import { useMasterProjectContext } from '../../core/context/MasterProjectContext.tsx';
import { useCosmicEffects } from '../../core/cosmic/CosmicEffectsContext.tsx';
import { StarSystemVisual } from '../cosmic/StarSystemVisual.tsx';
import { BlackHoleVisual } from '../cosmic/BlackHoleVisual.tsx';
import { CosmicProgressEngine } from '../cosmic/CosmicProgressEngine.tsx';

export const WorkspaceViewport: React.FC = () => {
  const {
    activeProject,
    activeWorkspace,
    activePhase,
    artifacts,
    assets,
    jobs,
    triggerTestJob,
    setActiveWorkspace,
  } = useMasterProjectContext();

  const { triggerWarp, warpSpeed } = useCosmicEffects();
  const [viewMode, setViewMode] = useState<'workspace' | 'orbit'>('workspace');

  const currentWorkspace = WORKSPACES.find((w) => w.id === activeWorkspace) || WORKSPACES[0];
  const currentPhase = PRODUCTION_PHASES.find((p) => p.id === activePhase);

  // Filter jobs relevant to active project
  const projectJobs = jobs.filter((j) => j.projectId === activeProject?.id);
  const activeRunningJob = projectJobs.find((j) => j.status === 'RUNNING') || projectJobs[0] || null;

  const handleTestJob = async () => {
    // Trigger visual light-speed warp travel
    triggerWarp(3500);
    await triggerTestJob();
  };

  return (
    <main className="flex-1 bg-zinc-950/40 backdrop-blur-sm overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar select-none relative z-10">
      {/* Viewport Control Mode Switcher */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="flex rounded-md bg-zinc-900/90 border border-zinc-800 p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('workspace')}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                viewMode === 'workspace'
                  ? 'bg-cyan-950/80 border border-cyan-500/80 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>WORKSPACE LAB</span>
            </button>
            <button
              onClick={() => setViewMode('orbit')}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                viewMode === 'orbit'
                  ? 'bg-cyan-950/80 border border-cyan-500/80 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>PROJECT ORBIT MAP</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            CORE ID: <code className="text-cyan-400">{activeProject?.id || 'N/A'}</code>
          </span>
        </div>

        {/* Test Async Job with Light-Speed Warp Trigger */}
        <button
          onClick={handleTestJob}
          className="px-3.5 py-1.5 rounded bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-2 transition shadow-[0_0_12px_rgba(6,182,212,0.2)]"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>TEST KERNEL ASYNC JOB</span>
        </button>
      </div>

      {/* VIEW MODE 1: PROJECT ORBIT (SCIENTIFIC SOLAR SYSTEM COMMAND VIEW) */}
      {viewMode === 'orbit' ? (
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-xl p-6 shadow-2xl flex flex-col items-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between pb-4 border-b border-zinc-800/80 relative z-20">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                SYSTEM ARCHITECTURE • CELESTIAL PROJECTION
              </div>
              <h2 className="text-xl font-bold text-zinc-100 font-mono mt-0.5">
                {activeProject?.name || 'Dark Matter Project'}
              </h2>
            </div>
            <div className="text-right text-xs font-mono text-zinc-400">
              <div>MODE: <span className="text-cyan-400 uppercase font-bold">{activeProject?.mode}</span></div>
              <div className="text-[10px] text-zinc-500">CLICK ANY PLANET TO DOCK INTO LAB</div>
            </div>
          </div>

          {/* Interactive StarSystem Visual */}
          <div className="py-6 overflow-x-auto w-full flex justify-center custom-scrollbar relative">
            <StarSystemVisual
              activeWorkspaceId={activeWorkspace}
              onSelectWorkspace={(wsId) => {
                setActiveWorkspace(wsId);
                setViewMode('workspace');
              }}
            />
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: WORKSPACE LAB VIEW */
        <>
          {/* Main Lab Header Card */}
          <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-xl p-6 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Cosmic Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Embedded Visual Phenomena for Selected Workspaces (e.g. Movie, Story, Research) */}
            {(activeWorkspace === 'movie' || activeWorkspace === 'research') && (
              <div className="absolute -right-8 -bottom-8 opacity-40 pointer-events-none hidden xl:block">
                <BlackHoleVisual size={240} showParticles={true} />
              </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-400 font-bold uppercase tracking-wider">
                    {currentWorkspace.category}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">TARGET PHASE: {currentWorkspace.targetPhase.toUpperCase()}</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-mono flex items-center gap-3">
                  {currentWorkspace.name}
                </h1>

                <p className="text-sm text-zinc-400 mt-2 max-w-3xl leading-relaxed">
                  {currentWorkspace.description}
                </p>
              </div>
            </div>

            {/* Explicit Architectural Status Banner */}
            <div className="mt-6 p-4 rounded-lg bg-zinc-900/80 border border-zinc-800/90 flex items-start gap-3.5 backdrop-blur-md">
              <div className="p-2 rounded bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wide">
                  Workspace foundation ready — implementation scheduled for its dedicated phase.
                </div>
                <div className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Dark Matter Lab architectural rule: Workspaces are brought online phase-by-phase without premature mocks. 
                  The Master Project Context is actively bound to Project ID{' '}
                  <code className="text-cyan-400 font-mono px-1 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                    {activeProject?.id || 'N/A'}
                  </code>
                  .
                </div>
              </div>
            </div>
          </div>

          {/* Active Light-Speed Job Progress (Visible whenever a job is active or simulated) */}
          {activeRunningJob && (
            <CosmicProgressEngine job={activeRunningJob} />
          )}

          {/* Architectural Contract Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Input Prerequisites */}
            <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                  <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    INPUT PREREQUISITES (PHASE HANDOFF)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {currentWorkspace.inputsRequired.length} REQUIRED
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {currentWorkspace.inputsRequired.map((input, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs"
                    >
                      <span className="text-zinc-300 font-medium">{input}</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400">
                        PENDING CONTRACT
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500">
                Handoff Validation: Inputs are verified via Master Project Context before execution.
              </div>
            </div>

            {/* Right Column: Output Artifacts */}
            <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                  <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    PRODUCED ARTIFACTS (LOCKED DELIVERABLES)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {currentWorkspace.outputsProduced.length} CONTRACTED
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {currentWorkspace.outputsProduced.map((output, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs"
                    >
                      <span className="text-zinc-300 font-medium">{output}</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-cyan-400">
                        VERSIONED POINTER
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500">
                Immutable Storage: All locked deliverables generate versioned artifact IDs and checksums.
              </div>
            </div>
          </div>

          {/* Active Async Kernel Jobs Queue */}
          <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                ASYNC KERNEL JOBS QUEUE ({projectJobs.length})
              </span>
              <span className="text-[10px] font-mono text-zinc-500">LIGHT-SPEED PROPULSION</span>
            </div>

            <div className="mt-4 space-y-3">
              {projectJobs.length === 0 ? (
                <div className="text-xs font-mono text-zinc-500 py-6 text-center">
                  No asynchronous background jobs queued for this project.
                </div>
              ) : (
                projectJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-zinc-200 font-semibold">{job.title}</span>
                        <span className="text-zinc-500">({job.type})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            job.status === 'COMPLETED'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                              : job.status === 'RUNNING'
                              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 animate-pulse'
                              : job.status === 'FAILED'
                              ? 'bg-red-950/80 text-red-400 border border-red-800/80'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {job.status}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">{job.progress}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          job.status === 'COMPLETED'
                            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : job.status === 'FAILED'
                            ? 'bg-red-500'
                            : 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        }`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mt-1">
                      <span>ID: {job.id}</span>
                      {job.outputRef && (
                        <span className="text-cyan-400 truncate max-w-xs">Output: {job.outputRef}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
};
