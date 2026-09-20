/**
 * DARK MATTER LAB — Application Shell
 * Section 12 & 13: UI Structure & Shell with Cosmic Environment Layer
 * 
 * Cinematic, restrained sci-fi, high-end creative software interface.
 */

import React, { useState } from 'react';
import { TopBar } from './TopBar.tsx';
import { PhaseStepper } from './PhaseStepper.tsx';
import { WorkspaceSidebar } from './WorkspaceSidebar.tsx';
import { WorkspaceViewport } from './WorkspaceViewport.tsx';
import { ContextInspector } from './ContextInspector.tsx';
import { NewProjectModal } from './NewProjectModal.tsx';
import { CosmicBackground } from '../cosmic/CosmicBackground.tsx';
import { useMasterProjectContext } from '../../core/context/MasterProjectContext.tsx';
import { AlertTriangle, RefreshCw, Cpu, Orbit } from 'lucide-react';

export const AppShell: React.FC = () => {
  const { isLoading, error, refreshContext, activeWorkspace } = useMasterProjectContext();
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030508] flex flex-col items-center justify-center text-zinc-100 font-mono select-none relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-cyan-950/20 via-transparent to-black pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-xl bg-zinc-900/90 border border-cyan-500/60 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.35)] mb-5">
            <Orbit className="w-7 h-7 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="text-base font-bold tracking-widest text-zinc-100 uppercase">
            DARK MATTER LAB
          </div>
          <div className="text-xs font-mono text-cyan-400/80 tracking-wider mt-1">
            INITIALIZING COSMIC COMMAND ENVIRONMENT...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030508] flex flex-col items-center justify-center p-6 text-zinc-100 font-mono select-none">
        <div className="max-w-md w-full p-6 rounded-xl bg-zinc-900/90 border border-red-800/80 shadow-[0_0_40px_rgba(239,68,68,0.2)] text-center space-y-4 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-700 mx-auto flex items-center justify-center text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold uppercase text-red-300">
            KERNEL PROPULSION ANOMALY
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">{error}</p>
          <button
            onClick={() => refreshContext()}
            className="w-full py-2 px-4 rounded-lg bg-red-900/40 hover:bg-red-900/60 border border-red-700 text-red-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RECONNECT TO KERNEL</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <CosmicBackground activeWorkspace={activeWorkspace}>
      {/* 1. Global Top Command Bar */}
      <TopBar
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
        isInspectorOpen={isInspectorOpen}
      />

      {/* 2. Cosmic Pipeline Trajectory Stepper */}
      <PhaseStepper />

      {/* 3. Main Workspace & Stage Environment */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: 15-module Workspace Control Rail */}
        <WorkspaceSidebar />

        {/* Center: Active Workspace Viewport / Project Command Deck */}
        <WorkspaceViewport />

        {/* Right: Collapsible Mission Control Telemetry Drawer */}
        <ContextInspector
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
        />
      </div>

      {/* 4. Modals */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </CosmicBackground>
  );
};
