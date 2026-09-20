/**
 * DARK MATTER LAB — Master Project Context
 * Section 8: Master Project Context
 * 
 * Strict Principle:
 * Lightweight Master Manifest. Contains IDs, metadata, and status references.
 * Never stores raw video, audio streams, or heavy documents.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Project,
  WorkspaceId,
  PhaseId,
  ArtifactRecord,
  AssetReference,
  JobRecord,
  ProjectMode,
  MasterProjectManifest,
} from '../../types/domain.ts';
import { fetchProjectJobs, createKernelJob } from '../jobs/jobClient.ts';
import { fetchProjectAssets } from '../assets/assetClient.ts';

export interface MasterProjectContextValue {
  // State
  projects: Project[];
  activeProject: Project | null;
  activeWorkspace: WorkspaceId;
  activePhase: PhaseId;
  artifacts: ArtifactRecord[];
  assets: AssetReference[];
  jobs: JobRecord[];
  manifest: MasterProjectManifest | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  selectProject: (projectId: string) => Promise<void>;
  createProject: (data: { name: string; description: string; mode: ProjectMode }) => Promise<Project | null>;
  updateActiveProject: (patch: Partial<Project>) => Promise<void>;
  setActiveWorkspace: (workspaceId: WorkspaceId) => void;
  setActivePhase: (phaseId: PhaseId) => Promise<void>;
  refreshContext: () => Promise<void>;
  triggerTestJob: (title?: string) => Promise<JobRecord | null>;
}

const MasterProjectContext = createContext<MasterProjectContextValue | undefined>(undefined);

export function MasterProjectContextProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeWorkspace, setActiveWorkspaceState] = useState<WorkspaceId>('story');
  const [activePhase, setActivePhaseState] = useState<PhaseId>('story');
  const [artifacts, setArtifacts] = useState<ArtifactRecord[]>([]);
  const [assets, setAssets] = useState<AssetReference[]>([]);
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [manifest, setManifest] = useState<MasterProjectManifest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch lightweight metadata & references for active project
  const loadProjectReferences = useCallback(async (projectId: string) => {
    try {
      const [artRes, assetData, jobData, manRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/artifacts`).then((r) => r.ok ? r.json() : { data: [] }),
        fetchProjectAssets(projectId),
        fetchProjectJobs(projectId),
        fetch(`/api/projects/${projectId}/manifest`).then((r) => r.ok ? r.json() : { data: null }),
      ]);

      setArtifacts(artRes.data || []);
      setAssets(assetData || []);
      setJobs(jobData || []);
      setManifest(manRes.data || null);
    } catch (err: any) {
      console.error('[MasterContext] Failed to load project references:', err);
    }
  }, []);

  // 2. Initial load: fetch all projects and select the first active project
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) {
        throw new Error(`API error ${res.status}: Failed to load projects`);
      }
      const json = await res.json();
      const loadedProjects: Project[] = json.data || [];
      setProjects(loadedProjects);

      if (loadedProjects.length > 0) {
        const initial = loadedProjects[0];
        setActiveProject(initial);
        setActiveWorkspaceState(initial.activeWorkspace);
        setActivePhaseState(initial.activePhase);
        await loadProjectReferences(initial.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Dark Matter Lab Kernel');
    } finally {
      setIsLoading(false);
    }
  }, [loadProjectReferences]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // 3. Select Project by ID
  const selectProject = useCallback(async (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    setActiveProject(target);
    setActiveWorkspaceState(target.activeWorkspace);
    setActivePhaseState(target.activePhase);
    await loadProjectReferences(target.id);
  }, [projects, loadProjectReferences]);

  // 4. Create New Project
  const createProject = useCallback(async (data: { name: string; description: string; mode: ProjectMode }): Promise<Project | null> => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to create project');
      }

      const json = await res.json();
      const created: Project = json.data;

      setProjects((prev) => [created, ...prev]);
      setActiveProject(created);
      setActiveWorkspaceState(created.activeWorkspace);
      setActivePhaseState(created.activePhase);
      await loadProjectReferences(created.id);
      return created;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [loadProjectReferences]);

  // 5. Update Project Metadata
  const updateActiveProject = useCallback(async (patch: Partial<Project>) => {
    if (!activeProject) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });

      if (!res.ok) throw new Error('Failed to update project');
      const json = await res.json();
      const updated: Project = json.data;

      setActiveProject(updated);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [activeProject]);

  // 6. Set Active Workspace (client-side workspace tab switch)
  const setActiveWorkspace = useCallback((workspaceId: WorkspaceId) => {
    setActiveWorkspaceState(workspaceId);
    if (activeProject && activeProject.activeWorkspace !== workspaceId) {
      updateActiveProject({ activeWorkspace: workspaceId });
    }
  }, [activeProject, updateActiveProject]);

  // 7. Set Active Phase (pipeline handoff)
  const setActivePhase = useCallback(async (phaseId: PhaseId) => {
    setActivePhaseState(phaseId);
    if (activeProject && activeProject.activePhase !== phaseId) {
      await updateActiveProject({ activePhase: phaseId });
    }
  }, [activeProject, updateActiveProject]);

  // 8. Refresh Context
  const refreshContext = useCallback(async () => {
    if (!activeProject) return;
    await loadProjectReferences(activeProject.id);
  }, [activeProject, loadProjectReferences]);

  // 9. Trigger Asynchronous Test Job
  const triggerTestJob = useCallback(async (title?: string): Promise<JobRecord | null> => {
    if (!activeProject) return null;
    const jobTitle = title || `Kernel Verification: ${activeWorkspace.toUpperCase()} Pipeline Test`;
    const newJob = await createKernelJob(activeProject.id, 'KERNEL_TEST', jobTitle);
    if (newJob) {
      setJobs((prev) => [newJob, ...prev]);
      // Poll progress every 500ms until complete
      const interval = setInterval(async () => {
        const updated = await fetch(`/api/jobs/${newJob.id}`).then((r) => r.ok ? r.json() : null);
        if (updated?.data) {
          setJobs((prev) => prev.map((j) => (j.id === newJob.id ? updated.data : j)));
          if (updated.data.status === 'COMPLETED' || updated.data.status === 'FAILED' || updated.data.status === 'CANCELLED') {
            clearInterval(interval);
            refreshContext();
          }
        }
      }, 500);
    }
    return newJob;
  }, [activeProject, activeWorkspace, refreshContext]);

  const value: MasterProjectContextValue = {
    projects,
    activeProject,
    activeWorkspace,
    activePhase,
    artifacts,
    assets,
    jobs,
    manifest,
    isLoading,
    isSaving,
    error,
    selectProject,
    createProject,
    updateActiveProject,
    setActiveWorkspace,
    setActivePhase,
    refreshContext,
    triggerTestJob,
  };

  return (
    <MasterProjectContext.Provider value={value}>
      {children}
    </MasterProjectContext.Provider>
  );
}

export function useMasterProjectContext(): MasterProjectContextValue {
  const context = useContext(MasterProjectContext);
  if (!context) {
    throw new Error('useMasterProjectContext must be used within MasterProjectContextProvider');
  }
  return context;
}
