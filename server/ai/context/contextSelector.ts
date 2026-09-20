/**
 * DARK MATTER LAB — Context Selector Foundation
 * Phase 2: Lightweight Context Selection
 * 
 * Strict Principle:
 * Never inject raw binaries, huge logs, or unbounded history into prompts.
 * Pull only normalized metadata pointers, summaries, and relevant state slices.
 */

import { IProjectRepository } from '../../repositories/projectRepository.ts';
import { AIContextSlice } from '../types.ts';

export class ContextSelector {
  constructor(private projectRepo: IProjectRepository) {}

  /**
   * Builds a lightweight context slice from a project ID
   */
  async buildProjectContextSlice(projectId: string, activeWorkspace?: string): Promise<AIContextSlice> {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      return {
        projectId,
        summary: 'Project context not found',
      };
    }

    const artifacts = await this.projectRepo.getArtifacts(projectId);
    const artifactSummaries = artifacts.slice(0, 8).map((art) => ({
      id: art.id,
      type: art.type,
      name: art.name,
      summary: art.summary || `Version ${art.version} (${art.status})`,
    }));

    return {
      projectId: project.id,
      projectName: project.name,
      projectMode: project.mode,
      activePhase: project.activePhase,
      activeWorkspace: activeWorkspace || project.activeWorkspace,
      summary: project.summary || project.description,
      artifactSummaries,
    };
  }

  /**
   * Serializes an AIContextSlice into a clean, compact system prompt header
   */
  formatContextForPrompt(slice?: AIContextSlice): string {
    if (!slice) return '';

    const lines: string[] = ['[PROJECT CONTEXT]'];
    if (slice.projectName) lines.push(`Project: ${slice.projectName}`);
    if (slice.projectMode) lines.push(`Mode: ${slice.projectMode}`);
    if (slice.activePhase) lines.push(`Current Phase: ${slice.activePhase}`);
    if (slice.activeWorkspace) lines.push(`Workspace: ${slice.activeWorkspace}`);
    if (slice.narrativeTone) lines.push(`Tone: ${slice.narrativeTone}`);
    if (slice.targetAudience) lines.push(`Target Audience: ${slice.targetAudience}`);
    if (slice.summary) lines.push(`Project Summary: ${slice.summary}`);

    if (slice.artifactSummaries && slice.artifactSummaries.length > 0) {
      lines.push('Key Artifact References:');
      for (const art of slice.artifactSummaries) {
        lines.push(`- [${art.type}] ${art.name || art.id}: ${art.summary || 'Recorded'}`);
      }
    }

    lines.push('[END CONTEXT]');
    return lines.join('\n');
  }
}
