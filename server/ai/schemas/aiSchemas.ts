/**
 * DARK MATTER LAB — AI Zod Validation Schemas
 * Phase 2: Schema-Based Structured Output & Input Validation
 */

import { z } from 'zod';

export const AIRequestInputSchema = z.object({
  promptKey: z.string().optional(),
  systemInstruction: z.string().optional(),
  prompt: z.string().optional(),
  model: z.string().optional(),
  taskType: z.enum(['fast', 'reasoning', 'creative', 'structured', 'default']).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  responseFormat: z.enum(['json', 'text']).optional(),
  schemaKey: z.string().optional(),
  projectId: z.string().optional(),
  workspaceId: z.string().optional(),
  contextSlice: z.object({
    projectId: z.string().optional(),
    projectName: z.string().optional(),
    projectMode: z.string().optional(),
    activePhase: z.string().optional(),
    activeWorkspace: z.string().optional(),
    narrativeTone: z.string().optional(),
    targetAudience: z.string().optional(),
    summary: z.string().optional(),
    artifactSummaries: z.array(
      z.object({
        id: z.string(),
        type: z.string(),
        name: z.string().optional(),
        summary: z.string().optional(),
      })
    ).optional(),
    customContext: z.record(z.string(), z.any()).optional(),
  }).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const TestStructuredOutputSchema = z.object({
  testId: z.string(),
  service: z.literal('DARK MATTER LAB AI GATEWAY'),
  status: z.enum(['HEALTHY', 'DEGRADED', 'OPTIMAL']),
  cosmicEnginePhase: z.string(),
  gatewayLatencyRating: z.string(),
  telemetrySummary: z.string(),
  signalConfidence: z.number().min(0).max(1),
  tags: z.array(z.string()),
});

export const ProjectBriefOutputSchema = z.object({
  title: z.string(),
  logline: z.string(),
  narrativeTone: z.string(),
  targetAudience: z.string(),
  coreConflict: z.string(),
  keyThemes: z.array(z.string()),
  recommendedPhases: z.array(z.string()),
  cosmicPacingScore: z.number().min(1).max(10),
});

export const TrendEvaluationOutputSchema = z.object({
  topic: z.string(),
  viralityIndex: z.number().min(0).max(100),
  audienceResonance: z.string(),
  cinematicAngles: z.array(z.string()),
  factCheckingPriority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

/**
 * Registry of schema validators accessible by schemaKey
 */
export const SchemaRegistry: Record<string, z.ZodType<any>> = {
  'test_structured': TestStructuredOutputSchema,
  'project_brief': ProjectBriefOutputSchema,
  'trend_evaluation': TrendEvaluationOutputSchema,
};

export function validateStructuredData<T>(schemaKey: string, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const schema = SchemaRegistry[schemaKey];
  if (!schema) {
    return { success: true, data: data as T };
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: `Validation failed for schema '${schemaKey}': ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`,
    };
  }

  return { success: true, data: result.data as T };
}
