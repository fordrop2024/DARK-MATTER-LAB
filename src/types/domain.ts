/**
 * DARK MATTER LAB — Core Domain Contracts
 * Master Blueprint: Section Architecture & Domain Specifications
 * 
 * Strict Principle:
 * The Master Project Context is a lightweight reference graph.
 * It contains IDs, pointers, and metadata — NEVER raw binaries or massive payloads.
 */

export type ProjectStatus = 'draft' | 'active' | 'archived' | 'completed';
export type ProjectMode = 'standard' | 'movie_explainer';

/**
 * The 15 Specialized Workspaces in Dark Matter Lab
 */
export type WorkspaceId =
  | 'trend'
  | 'research'
  | 'idea'
  | 'story'
  | 'script'
  | 'scene_plan'
  | 'movie'
  | 'audio'
  | 'video'
  | 'first_cut'
  | 'editor'
  | 'thumbnail'
  | 'seo'
  | 'youtube'
  | 'analytics';

/**
 * The 13 Fixed Pipeline Phases
 */
export type PhaseId =
  | 'trend'
  | 'research'
  | 'idea'
  | 'story'
  | 'script'
  | 'scene_plan'
  | 'media'
  | 'first_cut'
  | 'pro_editor'
  | 'thumbnail'
  | 'seo'
  | 'youtube_studio'
  | 'analytics';

export interface WorkspaceConfig {
  id: WorkspaceId;
  name: string;
  category: 'PRE-PRODUCTION' | 'PRODUCTION' | 'POST-PRODUCTION' | 'DISTRIBUTION';
  description: string;
  targetPhase: PhaseId;
  iconName: string;
  inputsRequired: string[];
  outputsProduced: string[];
}

export interface PhaseConfig {
  id: PhaseId;
  label: string;
  order: number;
  description: string;
  primaryWorkspace: WorkspaceId;
}

export type ArtifactType =
  | 'trend_report'
  | 'research_factpack'
  | 'story_outline'
  | 'script_screenplay'
  | 'scene_breakdown'
  | 'movie_intelligence'
  | 'audio_stems'
  | 'video_renders'
  | 'timeline_sequence'
  | 'thumbnail_pack'
  | 'seo_package'
  | 'youtube_payload'
  | 'analytics_report';

export type ArtifactStatus = 'draft' | 'pending_review' | 'locked' | 'archived';

export interface ArtifactRecord {
  id: string;
  projectId: string;
  type: ArtifactType;
  name: string;
  version: number;
  status: ArtifactStatus;
  createdAt: string;
  updatedAt: string;
  storageRef?: string;
  checksum?: string;
  summary?: string;
}

export type StorageProvider = 'local' | 'gdrive' | 's3';

export interface AssetReference {
  id: string;
  projectId: string;
  label: string;
  mimeType: string;
  byteSize: number;
  duration?: number; // seconds
  resolution?: string; // e.g. "3840x2160"
  storageProvider: StorageProvider;
  storageKey: string;
  createdAt: string;
  proxyReferences?: Record<string, string>; // e.g., { audio_proxy: 'ref_123', video_720p: 'ref_456' }
}

export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type JobType =
  | 'TRANSCRIPTION'
  | 'SHOT_DETECTION'
  | 'VOICE_SYNTHESIS'
  | 'VIDEO_RENDER'
  | 'FIRST_CUT_ASSEMBLY'
  | 'METADATA_EXTRACT'
  | 'KERNEL_TEST';

export interface JobRecord {
  id: string;
  projectId: string;
  type: JobType;
  title: string;
  status: JobStatus;
  progress: number; // 0 to 100
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  outputRef?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  mode: ProjectMode;
  status: ProjectStatus;
  activePhase: PhaseId;
  activeWorkspace: WorkspaceId;
  createdAt: string;
  updatedAt: string;
  artifactIds: string[];
  assetIds: string[];
  jobIds: string[];
  summary?: string;
}

/**
 * Lightweight Master Project Context Structure
 * Strictly reference-based. No raw media, no massive prompt logs.
 */
export interface MasterProjectManifest {
  projectId: string;
  name: string;
  mode: ProjectMode;
  status: ProjectStatus;
  activePhase: PhaseId;
  activeWorkspace: WorkspaceId;
  createdAt: string;
  updatedAt: string;
  artifactPointers: { id: string; type: ArtifactType; version: number; status: ArtifactStatus }[];
  assetPointers: { id: string; label: string; mimeType: string; byteSize: number }[];
  activeJobPointers: { id: string; title: string; status: JobStatus; progress: number }[];
}
