/**
 * DARK MATTER LAB — New Project Modal
 * Section 17: Project Selector & Creation Foundation
 */

import React, { useState } from 'react';
import { X, Plus, Sparkles, Film, Compass, Zap } from 'lucide-react';
import { ProjectMode } from '../../types/domain.ts';
import { useMasterProjectContext } from '../../core/context/MasterProjectContext.tsx';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject, isSaving } = useMasterProjectContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<ProjectMode>('standard');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Project name is required.');
      return;
    }

    setValidationError(null);
    const created = await createProject({
      name: name.trim(),
      description: description.trim(),
      mode,
    });

    if (created) {
      setName('');
      setDescription('');
      setMode('standard');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-lg bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-cyan-950/80 border border-cyan-600/80 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
              INITIALIZE PROJECT ENTITY • COMMAND KERNEL
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          {validationError && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300">
              {validationError}
            </div>
          )}

          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-zinc-400 uppercase">PROJECT NAME *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Quantum Enigma: The Deep Horizon"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-cyan-500 focus:outline-none text-zinc-100 placeholder-zinc-600 transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-zinc-400 uppercase">PROJECT BRIEF / LOGLINE</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of narrative hypothesis, target scope, or premise..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-900/90 border border-zinc-800 focus:border-cyan-500 focus:outline-none text-zinc-100 placeholder-zinc-600 transition resize-none"
            />
          </div>

          {/* Architecture Pipeline Mode */}
          <div className="space-y-1.5">
            <label className="text-zinc-400 uppercase">PIPELINE ARCHITECTURE MODE</label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Standard Mode */}
              <button
                type="button"
                onClick={() => setMode('standard')}
                className={`p-3.5 rounded-lg text-left border transition flex flex-col justify-between ${
                  mode === 'standard'
                    ? 'bg-cyan-950/50 border-cyan-500/80 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-xs text-zinc-200">STANDARD</span>
                </div>
                <div className="text-[10px] text-zinc-400 leading-tight">
                  13-phase script, research, voice & AI assembly flow.
                </div>
              </button>

              {/* Movie Explainer Mode */}
              <button
                type="button"
                onClick={() => setMode('movie_explainer')}
                className={`p-3.5 rounded-lg text-left border transition flex flex-col justify-between ${
                  mode === 'movie_explainer'
                    ? 'bg-purple-950/50 border-purple-500/80 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Film className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-xs text-zinc-200">MOVIE EXPLAINER</span>
                </div>
                <div className="text-[10px] text-zinc-400 leading-tight">
                  Film ingestion, shot detection, timeline sync & breakdown.
                </div>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSaving || !name.trim()}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black font-bold tracking-wider uppercase transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              {isSaving ? 'INITIALIZING...' : 'INITIALIZE PROJECT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
