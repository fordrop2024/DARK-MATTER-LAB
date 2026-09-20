/**
 * DARK MATTER LAB — Job Client
 * Section 10: Client Job System Abstraction
 */

import { JobRecord, JobType } from '../../types/domain.ts';

export async function fetchJob(jobId: string): Promise<JobRecord | null> {
  try {
    const res = await fetch(`/api/jobs/${jobId}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`[JobClient] Failed to fetch job ${jobId}:`, err);
    return null;
  }
}

export async function fetchProjectJobs(projectId: string): Promise<JobRecord[]> {
  try {
    const res = await fetch(`/api/projects/${projectId}/jobs`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`[JobClient] Failed to fetch jobs for project ${projectId}:`, err);
    return [];
  }
}

export async function createKernelJob(
  projectId: string,
  type: JobType,
  title: string
): Promise<JobRecord | null> {
  try {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, type, title }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('[JobClient] Failed to create job:', err);
    return null;
  }
}

export async function cancelKernelJob(jobId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/jobs/${jobId}/cancel`, { method: 'POST' });
    return res.ok;
  } catch (err) {
    console.error(`[JobClient] Failed to cancel job ${jobId}:`, err);
    return false;
  }
}
