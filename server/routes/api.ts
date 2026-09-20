/**
 * DARK MATTER LAB — API Foundation Router
 * Section 11: API Foundation
 * 
 * Keep route handlers thin. Business logic resides in repository,
 * job manager, and storage abstractions.
 */

import { Router, Request, Response } from 'express';
import { IProjectRepository } from '../repositories/projectRepository.ts';
import { IJobManager } from '../jobs/jobManager.ts';
import { IStorageAdapter } from '../storage/storageAdapter.ts';
import { MasterProjectManifest } from '../../src/types/domain.ts';
import { AIOrchestrator } from '../ai/orchestrator/aiOrchestrator.ts';
import { createAiRouter } from './aiRouter.ts';

export function createApiRouter(
  projectRepo: IProjectRepository,
  jobManager: IJobManager,
  storageAdapter: IStorageAdapter,
  aiOrchestrator?: AIOrchestrator
): Router {
  const router = Router();

  // 0. AI Gateway Mount
  if (aiOrchestrator) {
    router.use('/ai', createAiRouter(aiOrchestrator, jobManager));
  }

  // 1. Health Endpoint
  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'DARK MATTER LAB KERNEL',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      kernel: 'online',
    });
  });

  // 2. Projects Endpoints
  router.get('/projects', async (_req: Request, res: Response) => {
    try {
      const projects = await projectRepo.findAll();
      res.json({ success: true, data: projects });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to list projects' });
    }
  });

  router.post('/projects', async (req: Request, res: Response) => {
    try {
      const { name, description, mode } = req.body;
      if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(400).json({ success: false, error: 'Project name is required and must be a valid string.' });
        return;
      }

      const created = await projectRepo.create({
        name: name.trim(),
        description: typeof description === 'string' ? description.trim() : '',
        mode: mode === 'movie_explainer' ? 'movie_explainer' : 'standard',
        status: 'active',
        activePhase: 'trend',
        activeWorkspace: 'trend',
      });

      res.status(201).json({ success: true, data: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to create project' });
    }
  });

  router.get('/projects/:id', async (req: Request, res: Response) => {
    try {
      const project = await projectRepo.findById(req.params.id);
      if (!project) {
        res.status(404).json({ success: false, error: `Project not found: ${req.params.id}` });
        return;
      }
      res.json({ success: true, data: project });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.patch('/projects/:id', async (req: Request, res: Response) => {
    try {
      const allowedKeys = ['name', 'description', 'status', 'activePhase', 'activeWorkspace', 'summary'];
      const patch: Record<string, any> = {};

      for (const key of allowedKeys) {
        if (req.body[key] !== undefined) {
          patch[key] = req.body[key];
        }
      }

      const updated = await projectRepo.update(req.params.id, patch);
      if (!updated) {
        res.status(404).json({ success: false, error: `Project not found: ${req.params.id}` });
        return;
      }

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Lightweight Master Project Manifest
  router.get('/projects/:id/manifest', async (req: Request, res: Response) => {
    try {
      const project = await projectRepo.findById(req.params.id);
      if (!project) {
        res.status(404).json({ success: false, error: 'Project not found' });
        return;
      }

      const artifacts = await projectRepo.getArtifacts(project.id);
      const assets = storageAdapter.listProjectAssets(project.id);
      const jobs = jobManager.listProjectJobs(project.id);

      const manifest: MasterProjectManifest = {
        projectId: project.id,
        name: project.name,
        mode: project.mode,
        status: project.status,
        activePhase: project.activePhase,
        activeWorkspace: project.activeWorkspace,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        artifactPointers: artifacts.map((a) => ({
          id: a.id,
          type: a.type,
          version: a.version,
          status: a.status,
        })),
        assetPointers: assets.map((s) => ({
          id: s.id,
          label: s.label,
          mimeType: s.mimeType,
          byteSize: s.byteSize,
        })),
        activeJobPointers: jobs.map((j) => ({
          id: j.id,
          title: j.title,
          status: j.status,
          progress: j.progress,
        })),
      };

      res.json({ success: true, data: manifest });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.get('/projects/:id/artifacts', async (req: Request, res: Response) => {
    try {
      const artifacts = await projectRepo.getArtifacts(req.params.id);
      res.json({ success: true, data: artifacts });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.get('/projects/:id/assets', (req: Request, res: Response) => {
    try {
      const assets = storageAdapter.listProjectAssets(req.params.id);
      res.json({ success: true, data: assets });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.post('/projects/:id/assets', (req: Request, res: Response) => {
    try {
      const { label, mimeType, byteSize, duration, resolution, storageKey } = req.body;
      if (!label || !mimeType || !storageKey) {
        res.status(400).json({ success: false, error: 'label, mimeType, and storageKey are required' });
        return;
      }

      const asset = storageAdapter.registerAsset(req.params.id, {
        label,
        mimeType,
        byteSize: Number(byteSize) || 0,
        duration: duration ? Number(duration) : undefined,
        resolution,
        storageKey,
      });

      res.status(201).json({ success: true, data: asset });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.get('/projects/:id/jobs', (req: Request, res: Response) => {
    try {
      const jobs = jobManager.listProjectJobs(req.params.id);
      res.json({ success: true, data: jobs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Job Endpoints
  router.get('/jobs/:id', (req: Request, res: Response) => {
    const job = jobManager.getJob(req.params.id);
    if (!job) {
      res.status(404).json({ success: false, error: `Job not found: ${req.params.id}` });
      return;
    }
    res.json({ success: true, data: job });
  });

  router.post('/jobs', (req: Request, res: Response) => {
    try {
      const { projectId, type, title, autoSimulate } = req.body;
      if (!projectId || !type || !title) {
        res.status(400).json({ success: false, error: 'projectId, type, and title are required.' });
        return;
      }

      const job = jobManager.createJob(projectId, type, title);

      // Controlled simulation for test verification
      if (autoSimulate !== false) {
        jobManager.simulateExecution(job.id);
      }

      res.status(201).json({ success: true, data: job });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.post('/jobs/:id/cancel', (req: Request, res: Response) => {
    const cancelled = jobManager.cancelJob(req.params.id);
    if (!cancelled) {
      res.status(404).json({ success: false, error: 'Job not found' });
      return;
    }
    res.json({ success: true, data: cancelled });
  });

  return router;
}
