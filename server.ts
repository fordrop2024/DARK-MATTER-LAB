/**
 * DARK MATTER LAB — Server Entry Point
 * Section 4: Server Foundation
 * 
 * Express + Vite Full-Stack Runtime
 * Binds on 0.0.0.0:3000
 * Handles API routes first, then passes through to Vite middleware or static dist.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { InMemoryProjectRepository } from './server/repositories/projectRepository.ts';
import { InMemoryJobManager } from './server/jobs/jobManager.ts';
import { LocalStorageAdapter } from './server/storage/storageAdapter.ts';
import { createApiRouter } from './server/routes/api.ts';
import { GeminiProvider } from './server/ai/providers/geminiProvider.ts';
import { PromptRegistry } from './server/ai/prompts/promptRegistry.ts';
import { ContextSelector } from './server/ai/context/contextSelector.ts';
import { AIOrchestrator } from './server/ai/orchestrator/aiOrchestrator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const HOST = '0.0.0.0';

  // 1. Core Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. Foundation Services (Dependency Injected)
  const projectRepo = new InMemoryProjectRepository();
  const jobManager = new InMemoryJobManager();
  const storageAdapter = new LocalStorageAdapter();

  // 3. Central AI Orchestration Layer (Phase 2)
  const geminiProvider = new GeminiProvider();
  const promptRegistry = new PromptRegistry();
  const contextSelector = new ContextSelector(projectRepo);
  const aiOrchestrator = new AIOrchestrator(geminiProvider, promptRegistry, contextSelector);

  // 4. API Routes mounted FIRST
  const apiRouter = createApiRouter(projectRepo, jobManager, storageAdapter, aiOrchestrator);
  app.use('/api', apiRouter);

  // 4. Vite Middleware (Dev) or Static File Server (Prod)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Dark Matter Lab] Vite development middleware mounted');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Dark Matter Lab] Serving production bundle from dist/');
  }

  // 5. Port Binding
  app.listen(PORT, HOST, () => {
    console.log(`[Dark Matter Lab] Kernel initialized and listening on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Dark Matter Lab] Fatal startup error:', err);
  process.exit(1);
});
