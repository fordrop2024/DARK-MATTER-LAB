/**
 * DARK MATTER LAB — Job Manager Abstraction
 * Section 10: Job System Foundation
 * 
 * Manages asynchronous operations with strict states:
 * QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED.
 * Designed to be backed by in-memory queue initially,
 * and replaceable by persistent workers (BullMQ / Cloud Tasks) in later phases.
 */

import { JobRecord, JobStatus, JobType } from '../../src/types/domain.ts';

export interface IJobManager {
  createJob(projectId: string, type: JobType, title: string): JobRecord;
  getJob(id: string): JobRecord | null;
  listProjectJobs(projectId: string): JobRecord[];
  updateProgress(id: string, progress: number): JobRecord | null;
  markCompleted(id: string, outputRef?: string): JobRecord | null;
  markFailed(id: string, error: string): JobRecord | null;
  cancelJob(id: string): JobRecord | null;
  simulateExecution(jobId: string): void;
}

export class InMemoryJobManager implements IJobManager {
  private jobs: Map<string, JobRecord> = new Map();

  constructor() {
    this.seedSampleJob();
  }

  private seedSampleJob() {
    const defaultProjectId = 'proj_dark_matter_core';
    const sampleJob: JobRecord = {
      id: 'job_init_transcription_01',
      projectId: defaultProjectId,
      type: 'METADATA_EXTRACT',
      title: 'Archival Waveform & Telemetry Ingestion',
      status: 'COMPLETED',
      progress: 100,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      startedAt: new Date(Date.now() - 3590000).toISOString(),
      completedAt: new Date(Date.now() - 3500000).toISOString(),
      outputRef: 'storage://metadata/telemetry_analysis.json',
    };
    this.jobs.set(sampleJob.id, sampleJob);
  }

  createJob(projectId: string, type: JobType, title: string): JobRecord {
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const job: JobRecord = {
      id,
      projectId,
      type,
      title,
      status: 'QUEUED',
      progress: 0,
      createdAt: now,
    };

    this.jobs.set(id, job);
    return job;
  }

  getJob(id: string): JobRecord | null {
    return this.jobs.get(id) || null;
  }

  listProjectJobs(projectId: string): JobRecord[] {
    return Array.from(this.jobs.values())
      .filter((j) => j.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  updateProgress(id: string, progress: number): JobRecord | null {
    const job = this.jobs.get(id);
    if (!job || job.status === 'CANCELLED' || job.status === 'COMPLETED' || job.status === 'FAILED') {
      return job || null;
    }

    job.status = 'RUNNING';
    job.progress = Math.min(100, Math.max(0, progress));
    if (!job.startedAt) {
      job.startedAt = new Date().toISOString();
    }
    this.jobs.set(id, job);
    return job;
  }

  markCompleted(id: string, outputRef?: string): JobRecord | null {
    const job = this.jobs.get(id);
    if (!job || job.status === 'CANCELLED') return job || null;

    job.status = 'COMPLETED';
    job.progress = 100;
    job.completedAt = new Date().toISOString();
    if (outputRef) job.outputRef = outputRef;

    this.jobs.set(id, job);
    return job;
  }

  markFailed(id: string, error: string): JobRecord | null {
    const job = this.jobs.get(id);
    if (!job || job.status === 'CANCELLED') return job || null;

    job.status = 'FAILED';
    job.completedAt = new Date().toISOString();
    job.error = error;

    this.jobs.set(id, job);
    return job;
  }

  cancelJob(id: string): JobRecord | null {
    const job = this.jobs.get(id);
    if (!job) return null;

    if (job.status === 'COMPLETED') return job;

    job.status = 'CANCELLED';
    job.completedAt = new Date().toISOString();
    job.error = 'Job cancelled by user or operator.';

    this.jobs.set(id, job);
    return job;
  }

  /**
   * Controlled simulation for validating the asynchronous job loop in Phase 1
   * without incurring external model or compute costs.
   */
  simulateExecution(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    let progress = 10;
    this.updateProgress(jobId, progress);

    const interval = setInterval(() => {
      const current = this.jobs.get(jobId);
      if (!current || current.status === 'CANCELLED') {
        clearInterval(interval);
        return;
      }

      progress += 25;
      if (progress >= 100) {
        clearInterval(interval);
        this.markCompleted(jobId, `storage://artifacts/job_result_${jobId}.json`);
      } else {
        this.updateProgress(jobId, progress);
      }
    }, 600);
  }
}
