/**
 * DARK MATTER LAB — Prompt Registry Infrastructure
 * Phase 2: Central Prompt Template Registry
 * 
 * Strict Principle:
 * Workspaces do not build ad-hoc uncontrolled strings.
 * All prompt archetypes are versioned, documented, and paired with structured schemas.
 */

import { AITaskType } from '../types.ts';

export interface PromptTemplate {
  key: string;
  version: string;
  description: string;
  taskType: AITaskType;
  defaultModel?: string;
  responseFormat: 'json' | 'text';
  schemaKey?: string;
  systemInstruction: string;
  renderPrompt: (variables: Record<string, any>) => string;
}

export class PromptRegistry {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.registerDefaults();
  }

  register(template: PromptTemplate) {
    this.templates.set(template.key, template);
  }

  get(key: string): PromptTemplate | undefined {
    return this.templates.get(key);
  }

  list(): Array<Omit<PromptTemplate, 'renderPrompt'>> {
    return Array.from(this.templates.values()).map(({ key, version, description, taskType, defaultModel, responseFormat, schemaKey, systemInstruction }) => ({
      key,
      version,
      description,
      taskType,
      defaultModel,
      responseFormat,
      schemaKey,
      systemInstruction,
    }));
  }

  private registerDefaults() {
    // 1. Core Health / Handshake Ping
    this.register({
      key: 'core.ping',
      version: '1.0.0',
      description: 'Ultra-fast gateway handshake test',
      taskType: 'fast',
      responseFormat: 'text',
      systemInstruction: 'You are the core diagnostic sub-kernel of Dark Matter Lab. Respond concisely.',
      renderPrompt: (vars) => `Acknowledge telemetry ping with ID: ${vars.pingId || 'DARK_MATTER_PING_DEFAULT'}. Output status: OK.`,
    });

    // 2. Structured Gateway Telemetry Test
    this.register({
      key: 'core.test_structured',
      version: '1.0.0',
      description: 'Structured output validation handshake for Gemini Gateway',
      taskType: 'structured',
      responseFormat: 'json',
      schemaKey: 'test_structured',
      systemInstruction: `You are the Dark Matter Lab Telemetry & AI Gateway engine.
Output strictly valid JSON matching this schema:
{
  "testId": string,
  "service": "DARK MATTER LAB AI GATEWAY",
  "status": "HEALTHY" | "DEGRADED" | "OPTIMAL",
  "cosmicEnginePhase": string,
  "gatewayLatencyRating": string,
  "telemetrySummary": string,
  "signalConfidence": number between 0.0 and 1.0,
  "tags": string[]
}`,
      renderPrompt: (vars) => `Execute telemetry test. Test ID: ${vars.testId || `pulse_${Date.now()}`}. Environment: ${vars.env || 'production'}. Seed: ${vars.seed || 'cosmic-kernel'}.`,
    });

    // 3. Project Brief Synthesizer
    this.register({
      key: 'project.synthesize_brief',
      version: '1.0.0',
      description: 'Synthesizes high-level project direction and narrative parameters',
      taskType: 'creative',
      responseFormat: 'json',
      schemaKey: 'project_brief',
      systemInstruction: `You are the lead narrative architect of Dark Matter Lab.
Given project details and constraints, return a structured JSON project brief:
{
  "title": string,
  "logline": string,
  "narrativeTone": string,
  "targetAudience": string,
  "coreConflict": string,
  "keyThemes": string[],
  "recommendedPhases": string[],
  "cosmicPacingScore": number between 1 and 10
}`,
      renderPrompt: (vars) => `Analyze project name: "${vars.projectName || 'Untitled'}" with description: "${vars.description || 'Modern AI video production'}".`,
    });

    // 4. Trend Concept Evaluation
    this.register({
      key: 'trend.seed_concepts',
      version: '1.0.0',
      description: 'Evaluates viral and cinematic potential of an incoming topic',
      taskType: 'reasoning',
      responseFormat: 'json',
      schemaKey: 'trend_evaluation',
      systemInstruction: `You are Dark Matter Lab's Trend Intelligence analyst.
Evaluate the incoming topic and return valid JSON:
{
  "topic": string,
  "viralityIndex": number (0-100),
  "audienceResonance": string,
  "cinematicAngles": string[],
  "factCheckingPriority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}`,
      renderPrompt: (vars) => `Evaluate trend topic: "${vars.topic || 'Breakthroughs in Deep Space Exploration'}" for a 10-15 minute high-production YouTube video.`,
    });
  }
}
