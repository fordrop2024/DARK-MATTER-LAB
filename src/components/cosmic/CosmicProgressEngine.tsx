/**
 * DARK MATTER LAB — CosmicProgressEngine
 * Section 10 & 11: Light-Speed Warp & Job Processing Visual Engine
 * 
 * Features:
 * - Relativistic Data Space Warp HUD
 * - Real job progress tracking with cosmic telemetry
 * - Distinct visual states: QUEUED, RUNNING (Warp speed), COMPLETED, FAILED, CANCELLED
 * - Displays "TRAVELING THROUGH DATA SPACE" / "PROCESSING COSMIC SIGNAL"
 * - Does not fake numbers: uses actual JobRecord progress or indeterminate scanner
 */

import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Clock, Zap } from 'lucide-react';
import { JobRecord } from '../../types/domain.ts';

interface CosmicProgressEngineProps {
  job: JobRecord | null;
  onCancel?: (jobId: string) => void;
  className?: string;
}

export const CosmicProgressEngine: React.FC<CosmicProgressEngineProps> = ({
  job,
  onCancel,
  className = '',
}) => {
  if (!job) return null;

  const isRunning = job.status === 'RUNNING';
  const isQueued = job.status === 'QUEUED';
  const isCompleted = job.status === 'COMPLETED';
  const isFailed = job.status === 'FAILED';
  const isCancelled = job.status === 'CANCELLED';

  return (
    <div
      className={`relative overflow-hidden rounded-lg border transition-all duration-500 backdrop-blur-md ${
        isRunning
          ? 'bg-zinc-950/80 border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
          : isCompleted
          ? 'bg-zinc-950/70 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
          : isFailed
          ? 'bg-zinc-950/80 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
          : 'bg-zinc-950/60 border-zinc-800'
      } ${className}`}
    >
      {/* Light-Speed Scanline Effect when Running */}
      {isRunning && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-full left-0 right-0 h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-scan" />
        </div>
      )}

      {/* Main Container */}
      <div className="p-4.5 space-y-3.5 relative z-10 font-mono">
        {/* Telemetry Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-1.5 rounded flex items-center justify-center ${
                isRunning
                  ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800 animate-pulse'
                  : isCompleted
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : isFailed
                  ? 'bg-red-950/80 text-red-400 border border-red-800'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              {isRunning && <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />}
              {isQueued && <Clock className="w-4 h-4 text-amber-400" />}
              {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isFailed && <AlertTriangle className="w-4 h-4 text-red-400" />}
              {isCancelled && <XCircle className="w-4 h-4 text-zinc-400" />}
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <span>
                  {isRunning
                    ? 'TRAVELING THROUGH DATA SPACE'
                    : isCompleted
                    ? 'COSMIC HARVEST COMPLETE'
                    : isFailed
                    ? 'RELATIVISTIC TRAJECTORY ANOMALY'
                    : 'COSMIC SIGNAL BUFFERED'}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-cyan-400/80">JOB #{job.id.slice(0, 16)}</span>
              </div>
              <div className="text-sm font-bold text-zinc-100 tracking-tight flex items-center gap-2 mt-0.5">
                <span>{job.title}</span>
                <span className="text-xs text-zinc-500">({job.type})</span>
              </div>
            </div>
          </div>

          {/* Right Status Badge */}
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                isRunning
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : isCompleted
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/80'
                  : isFailed
                  ? 'bg-red-950/80 text-red-300 border border-red-700/80'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {job.status}
            </span>

            {isRunning && onCancel && (
              <button
                onClick={() => onCancel(job.id)}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-red-950/50 border border-zinc-800 hover:border-red-700/80 text-zinc-400 hover:text-red-300 text-[10px] transition"
              >
                ABORT
              </button>
            )}
          </div>
        </div>

        {/* Progress HUD Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>PROPULSION FLUX</span>
            </span>
            <span className="text-cyan-300 font-bold text-xs">{job.progress}%</span>
          </div>

          <div className="w-full bg-zinc-900 border border-zinc-800 rounded-full h-2.5 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : isFailed
                  ? 'bg-red-500'
                  : 'bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-400 shadow-[0_0_15px_rgba(6,182,212,0.7)]'
              }`}
              style={{ width: `${Math.max(job.progress, 5)}%` }}
            />
          </div>
        </div>

        {/* Telemetry Output Reference */}
        {job.outputRef && (
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="text-zinc-500">IMMUTABLE POINTER:</span>
            <span className="text-cyan-400 truncate max-w-md font-mono">{job.outputRef}</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
