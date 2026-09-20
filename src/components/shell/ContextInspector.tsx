/**
 * DARK MATTER LAB — Context / Manifest Inspector
 * Section 18 & 19: Technical Mission Control Telemetry Drawer
 * 
 * Strict Principle:
 * Lightweight developer/creator visibility tool for the Master Project Context.
 * Shows reference graph and IDs ONLY. Never displays raw binaries or massive transcripts.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Layers2,
  Copy,
  Check,
  FileCode2,
  Database,
  Activity,
  ShieldCheck,
  Sparkles,
  Cpu,
  Zap,
  RefreshCw,
  Server,
  KeyRound,
  Terminal,
} from 'lucide-react';
import { useMasterProjectContext } from '../../core/context/MasterProjectContext.tsx';

interface ContextInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'overview' | 'artifacts' | 'assets' | 'jobs' | 'ai' | 'raw';
}

export const ContextInspector: React.FC<ContextInspectorProps> = ({ isOpen, onClose, initialTab = 'overview' }) => {
  const {
    activeProject,
    activeWorkspace,
    activePhase,
    artifacts,
    assets,
    jobs,
    manifest,
    refreshContext,
  } = useMasterProjectContext();

  const [activeTab, setActiveTab] = useState<'overview' | 'artifacts' | 'assets' | 'jobs' | 'ai' | 'raw'>(initialTab);
  const [copied, setCopied] = useState(false);

  // AI Gateway Diagnostic State
  const [aiHealth, setAiHealth] = useState<any>(null);
  const [loadingAiHealth, setLoadingAiHealth] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testingAi, setTestingAi] = useState(false);
  const [asyncJobTriggered, setAsyncJobTriggered] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'ai') {
      fetchAiHealth();
    }
  }, [isOpen, activeTab]);

  const fetchAiHealth = async () => {
    setLoadingAiHealth(true);
    try {
      const res = await fetch('/api/ai/health');
      const data = await res.json();
      if (data.success) {
        setAiHealth(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch AI health', e);
    } finally {
      setLoadingAiHealth(false);
    }
  };

  const handleTriggerTelemetryPulse = async () => {
    setTestingAi(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'structured', seed: 'cosmic-ui-pulse' }),
      });
      const data = await res.json();
      setTestResult(data);
      fetchAiHealth();
    } catch (err: any) {
      setTestResult({ testStatus: 'FAIL', error: err.message });
    } finally {
      setTestingAi(false);
    }
  };

  const handleDispatchTestJob = async () => {
    if (!activeProject) return;
    try {
      const res = await fetch('/api/ai/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          title: 'Orchestrator Warp Ingestion & Validation',
          jobType: 'KERNEL_TEST',
          request: {
            promptKey: 'core.test_structured',
            taskType: 'structured',
            metadata: {
              variables: { testId: `job_pulse_${Date.now()}` },
            },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAsyncJobTriggered(data.data.id);
        refreshContext();
        setTimeout(() => refreshContext(), 1000);
        setTimeout(() => refreshContext(), 2500);
      }
    } catch (e) {
      console.error('Failed to dispatch AI job', e);
    }
  };

  if (!isOpen) return null;

  const handleCopyManifest = () => {
    if (manifest) {
      navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside className="w-96 bg-zinc-950/85 backdrop-blur-2xl border-l border-zinc-800/80 flex flex-col shrink-0 z-40 select-none shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="h-14 px-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <Layers2 className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100">
            MISSION CONTROL TELEMETRY
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800 text-[11px] font-mono px-2 bg-zinc-900/60">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-2.5 py-2 border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          OVERVIEW
        </button>
        <button
          onClick={() => setActiveTab('artifacts')}
          className={`px-2.5 py-2 border-b-2 transition ${
            activeTab === 'artifacts'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          ARTIFACTS ({artifacts.length})
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`px-2.5 py-2 border-b-2 transition ${
            activeTab === 'assets'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          ASSETS ({assets.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-2.5 py-2 border-b-2 transition ${
            activeTab === 'jobs'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          JOBS ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-2.5 py-2 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'ai'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>AI GATEWAY</span>
          {aiHealth?.configured && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`px-2.5 py-2 border-b-2 transition ${
            activeTab === 'raw'
              ? 'border-cyan-400 text-cyan-300 font-bold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          RAW JSON
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 text-xs">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="text-[10px] font-mono uppercase text-zinc-400">ACTIVE PROJECT ID</div>
              <div className="font-mono text-cyan-300 font-semibold break-all">
                {activeProject?.id || 'NO PROJECT BOUND'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">MODE</div>
                <div className="font-mono text-zinc-200 mt-1 uppercase font-bold text-xs">
                  {activeProject?.mode || 'N/A'}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">STATUS</div>
                <div className="font-mono text-emerald-400 mt-1 uppercase font-bold text-xs">
                  {activeProject?.status || 'N/A'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">ACTIVE PHASE</div>
                <div className="font-mono text-cyan-400 mt-1 uppercase font-bold text-xs">
                  {activePhase}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">ACTIVE LAB</div>
                <div className="font-mono text-zinc-200 mt-1 uppercase font-bold text-xs">
                  {activeWorkspace}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">PROJECT SUMMARY</div>
              <p className="text-zinc-300 text-xs leading-relaxed">
                {activeProject?.summary || 'No project summary available.'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 text-[11px] font-mono text-zinc-400 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>REFERENCE INTEGRITY</span>
              </div>
              <div>Artifact Pointers: {artifacts.length}</div>
              <div>Asset Registry Pointers: {assets.length}</div>
              <div>Async Job Queue Pointers: {jobs.length}</div>
            </div>
          </div>
        )}

        {/* TAB 2: ARTIFACTS */}
        {activeTab === 'artifacts' && (
          <div className="space-y-3">
            {artifacts.length === 0 ? (
              <div className="text-zinc-500 font-mono text-center py-6">
                No artifacts generated yet.
              </div>
            ) : (
              artifacts.map((art) => (
                <div
                  key={art.id}
                  className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1.5"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-semibold text-zinc-200 text-xs truncate max-w-[200px]">
                      {art.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-cyan-400">
                      v{art.version} • {art.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">ID: {art.id}</div>
                  <div className="text-[10px] font-mono text-zinc-400">Type: {art.type}</div>
                  {art.storageRef && (
                    <div className="text-[10px] font-mono text-cyan-400 truncate">
                      Ref: {art.storageRef}
                    </div>
                  )}
                  {art.summary && (
                    <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                      {art.summary}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: ASSETS */}
        {activeTab === 'assets' && (
          <div className="space-y-3">
            {assets.length === 0 ? (
              <div className="text-zinc-500 font-mono text-center py-6">
                No asset references registered.
              </div>
            ) : (
              assets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1.5"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-semibold text-zinc-200 text-xs">
                      {asset.label}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-emerald-400">
                      {(asset.byteSize / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">ID: {asset.id}</div>
                  <div className="text-[10px] font-mono text-zinc-400">MIME: {asset.mimeType}</div>
                  <div className="text-[10px] font-mono text-cyan-400 truncate">
                    Storage: {asset.storageKey}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: JOBS */}
        {activeTab === 'jobs' && (
          <div className="space-y-3">
            {jobs.length === 0 ? (
              <div className="text-zinc-500 font-mono text-center py-6">
                No jobs registered.
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-semibold text-zinc-200 text-xs">
                      {job.title}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-cyan-400">
                      {job.status} ({job.progress}%)
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">ID: {job.id}</div>
                  <div className="text-[10px] font-mono text-zinc-400">Type: {job.type}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB: AI GATEWAY (PHASE 2) */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            {/* 1. Gateway Status Header */}
            <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-zinc-400">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GEMINI GATEWAY STATUS</span>
                </div>
                <button
                  onClick={fetchAiHealth}
                  disabled={loadingAiHealth}
                  className="p-1 rounded text-zinc-400 hover:text-cyan-300 transition"
                  title="Refresh Gateway Health"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingAiHealth ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      aiHealth?.configured
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                        : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    }`}
                  />
                  <span className="font-mono text-xs font-bold text-zinc-100 uppercase">
                    {aiHealth?.provider || 'Google Gemini'}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    aiHealth?.configured
                      ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300'
                      : 'bg-amber-950/80 border border-amber-700 text-amber-300'
                  }`}
                >
                  {aiHealth?.configured ? 'ONLINE' : 'DEV GATEWAY'}
                </span>
              </div>

              <div className="text-[11px] font-mono text-zinc-400 leading-relaxed pt-1">
                {aiHealth?.configured
                  ? 'Server-side Gemini provider is verified and listening. Model routing: gemini-3.8-flash & gemini-3.1-pro-preview.'
                  : 'Central orchestrator & Zod validation active. GEMINI_API_KEY can be added in Settings.'}
              </div>
            </div>

            {/* 2. Architecture Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>DEFAULT MODEL</span>
                </div>
                <div className="font-mono text-cyan-300 mt-1 font-bold text-[11px] truncate">
                  gemini-3.8-flash
                </div>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>VALIDATOR</span>
                </div>
                <div className="font-mono text-emerald-300 mt-1 font-bold text-[11px]">
                  Zod Engine
                </div>
              </div>
            </div>

            {/* 3. Interactive Diagnostic Suite */}
            <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-zinc-400">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>ORCHESTRATOR DIAGNOSTICS</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleTriggerTelemetryPulse}
                  disabled={testingAi}
                  className="w-full py-2 px-3 rounded bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-600/80 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-[0_0_15px_rgba(6,182,212,0.15)] disabled:opacity-50"
                >
                  {testingAi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>VALIDATING SCHEMA...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>SEND TELEMETRY PULSE</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDispatchTestJob}
                  className="w-full py-1.5 px-3 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-mono font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                >
                  <Activity className="w-3 h-3 text-amber-400" />
                  <span>DISPATCH ASYNC AI JOB</span>
                </button>
              </div>

              {asyncJobTriggered && (
                <div className="p-2 rounded bg-amber-950/40 border border-amber-800/60 text-[10px] font-mono text-amber-300 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 animate-spin text-amber-400" />
                  <span>Job queued & executing: {asyncJobTriggered}</span>
                </div>
              )}

              {/* Diagnostic Test Output Display */}
              {testResult && (
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-400">STATUS:</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded ${
                        testResult.testStatus === 'PASS' || testResult.testStatus === 'PASS_SIMULATED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {testResult.testStatus}
                    </span>
                  </div>

                  {testResult.result?.metadata && (
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-zinc-400">
                      <div>Latency: {testResult.result.metadata.latencyMs}ms</div>
                      <div className="truncate">Model: {testResult.result.metadata.model}</div>
                    </div>
                  )}

                  <pre className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80 text-[10px] font-mono text-zinc-300 overflow-x-auto max-h-48 custom-scrollbar">
                    {JSON.stringify(testResult.result?.data || testResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* 4. Prompt Registry Catalog */}
            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between">
                <span>REGISTERED PROMPT TEMPLATES</span>
                <span className="text-cyan-400 font-bold">4 REGISTERED</span>
              </div>
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="p-1.5 rounded bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
                  <span className="text-cyan-300">core.ping</span>
                  <span className="text-[9px] text-zinc-500 uppercase">FAST / TEXT</span>
                </div>
                <div className="p-1.5 rounded bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
                  <span className="text-cyan-300">core.test_structured</span>
                  <span className="text-[9px] text-zinc-500 uppercase">ZOD / JSON</span>
                </div>
                <div className="p-1.5 rounded bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
                  <span className="text-cyan-300">project.synthesize_brief</span>
                  <span className="text-[9px] text-zinc-500 uppercase">CREATIVE / JSON</span>
                </div>
                <div className="p-1.5 rounded bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
                  <span className="text-cyan-300">trend.seed_concepts</span>
                  <span className="text-[9px] text-zinc-500 uppercase">REASONING / JSON</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RAW JSON */}
        {activeTab === 'raw' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center pb-2">
              <span className="text-[10px] font-mono text-zinc-500">LIGHTWEIGHT MANIFEST</span>
              <button
                onClick={handleCopyManifest}
                className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'COPIED' : 'COPY JSON'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-300 overflow-x-auto custom-scrollbar">
              {JSON.stringify(manifest || activeProject, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </aside>
  );
};
