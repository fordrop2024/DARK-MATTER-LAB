/**
 * DARK MATTER LAB — Project Repository
 * Section 7: Project Persistence Foundation
 * 
 * Business logic depends on the IProjectRepository interface,
 * enabling seamless replacement with Firestore or Cloud SQL in future phases.
 */

import { Project, ArtifactRecord, AssetReference } from '../../src/types/domain.ts';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'artifactIds' | 'assetIds' | 'jobIds'> & Partial<Project>): Promise<Project>;
  update(id: string, patch: Partial<Project>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
  getArtifacts(projectId: string): Promise<ArtifactRecord[]>;
  getAssets(projectId: string): Promise<AssetReference[]>;
}

export class InMemoryProjectRepository implements IProjectRepository {
  private projects: Map<string, Project> = new Map();
  private artifacts: Map<string, ArtifactRecord[]> = new Map();
  private assets: Map<string, AssetReference[]> = new Map();

  constructor() {
    this.seedInitialProject();
  }

  private seedInitialProject() {
    const defaultProjectId = 'proj_dark_matter_core';
    const now = new Date().toISOString();

    const sampleProject: Project = {
      id: defaultProjectId,
      name: 'Dark Matter: The Void Signal',
      description: 'Flagship speculative documentary investigating anomalous radio emissions, dark matter candidates, and interstellar exploration.',
      mode: 'standard',
      status: 'active',
      activePhase: 'story',
      activeWorkspace: 'story',
      createdAt: now,
      updatedAt: now,
      artifactIds: ['art_trend_01', 'art_research_01'],
      assetIds: ['asset_radio_signal_01', 'asset_void_concept_01'],
      jobIds: ['job_init_transcription_01'],
      summary: 'Trend & Fact Lock dossiers locked. Story beat structure currently in draft.',
    };

    this.projects.set(defaultProjectId, sampleProject);

    this.artifacts.set(defaultProjectId, [
      {
        id: 'art_trend_01',
        projectId: defaultProjectId,
        type: 'trend_report',
        name: 'Deep Space Anomaly Trend Velocity Dossier',
        version: 1,
        status: 'locked',
        createdAt: now,
        updatedAt: now,
        storageRef: 'storage://artifacts/trend_01.json',
        checksum: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        summary: 'Identified 340% surge in James Webb interstellar dark matter queries across science feeds.',
      },
      {
        id: 'art_research_01',
        projectId: defaultProjectId,
        type: 'research_factpack',
        name: 'Astrophysics Verified Claims & Fact Lock',
        version: 1,
        status: 'locked',
        createdAt: now,
        updatedAt: now,
        storageRef: 'storage://artifacts/factpack_01.json',
        checksum: 'sha256:9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72',
        summary: 'Locked 12 empirical astrophysics facts citing NASA and ESA observational papers.',
      },
    ]);

    this.assets.set(defaultProjectId, [
      {
        id: 'asset_radio_signal_01',
        projectId: defaultProjectId,
        label: 'Raw Audio: Wow Signal Archival Telemetry',
        mimeType: 'audio/wav',
        byteSize: 14285700,
        duration: 184,
        storageProvider: 'local',
        storageKey: '/assets/raw/wow_signal_1977.wav',
        createdAt: now,
        proxyReferences: {
          audio_preview: '/assets/proxies/wow_signal_128k.mp3',
        },
      },
      {
        id: 'asset_void_concept_01',
        projectId: defaultProjectId,
        label: 'Visual Concept: Event Horizon Shadow',
        mimeType: 'image/png',
        byteSize: 4528100,
        resolution: '3840x2160',
        storageProvider: 'local',
        storageKey: '/assets/visuals/event_horizon_concept.png',
        createdAt: now,
      },
    ]);
  }

  async findAll(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async findById(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'artifactIds' | 'assetIds' | 'jobIds'> & Partial<Project>): Promise<Project> {
    const id = data.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newProject: Project = {
      id,
      name: data.name.trim(),
      description: data.description?.trim() || '',
      mode: data.mode || 'standard',
      status: data.status || 'draft',
      activePhase: data.activePhase || 'trend',
      activeWorkspace: data.activeWorkspace || 'trend',
      createdAt: now,
      updatedAt: now,
      artifactIds: data.artifactIds || [],
      assetIds: data.assetIds || [],
      jobIds: data.jobIds || [],
      summary: data.summary || 'Project initialized in Dark Matter Lab.',
    };

    this.projects.set(id, newProject);
    this.artifacts.set(id, []);
    this.assets.set(id, []);

    return newProject;
  }

  async update(id: string, patch: Partial<Project>): Promise<Project | null> {
    const existing = this.projects.get(id);
    if (!existing) return null;

    const updated: Project = {
      ...existing,
      ...patch,
      id: existing.id, // Immutable ID
      createdAt: existing.createdAt, // Immutable creation date
      updatedAt: new Date().toISOString(),
    };

    this.projects.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const existed = this.projects.delete(id);
    this.artifacts.delete(id);
    this.assets.delete(id);
    return existed;
  }

  async getArtifacts(projectId: string): Promise<ArtifactRecord[]> {
    return this.artifacts.get(projectId) || [];
  }

  async getAssets(projectId: string): Promise<AssetReference[]> {
    return this.assets.get(projectId) || [];
  }
}
