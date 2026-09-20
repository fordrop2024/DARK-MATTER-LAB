/**
 * DARK MATTER LAB — AI Orchestrator & Gateway Domain Contracts
 * Phase 2: Central AI Orchestration Layer
 * 
 * Strict Principle:
 * Server-Side Execution Only.
 * Normalized request/response contracts for all future AI workspaces.
 */

export type AITaskType = 'fast' | 'reasoning' | 'creative' | 'structured' | 'default';

export type AIErrorCode =
  | 'AUTH_ERROR'
  | 'RATE_LIMIT'
  | 'VALIDATION_ERROR'
  | 'PROVIDER_UNAVAILABLE'
  | 'INVALID_REQUEST'
  | 'TIMEOUT'
  | 'UNKNOWN_ERROR';

export interface AIErrorClassification {
  code: AIErrorCode;
  message: string;
  retryable: boolean;
  statusCode: number;
  provider?: string;
  details?: any;
}

export interface AIContextSlice {
  projectId?: string;
  projectName?: string;
  projectMode?: string;
  activePhase?: string;
  activeWorkspace?: string;
  narrativeTone?: string;
  targetAudience?: string;
  summary?: string;
  artifactSummaries?: {
    id: string;
    type: string;
    name?: string;
    summary?: string;
  }[];
  customContext?: Record<string, any>;
}

export interface AIRequest {
  promptKey?: string;
  systemInstruction?: string;
  prompt?: string;
  model?: string;
  taskType?: AITaskType;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'json' | 'text';
  schemaKey?: string;
  contextSlice?: AIContextSlice;
  projectId?: string;
  workspaceId?: string;
  metadata?: Record<string, any>;
}

export interface NormalizedAIRequest {
  model: string;
  contents: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  requestId: string;
}

export interface NormalizedAIResponse {
  rawText: string;
  finishReason?: string;
  tokenUsage?: {
    promptTokens?: number;
    candidatesTokens?: number;
    totalTokens?: number;
  };
}

export interface AIMetadata {
  requestId: string;
  timestamp: string;
  model: string;
  provider: string;
  latencyMs: number;
  finishReason?: string;
  tokenUsage?: {
    promptTokens?: number;
    candidatesTokens?: number;
    totalTokens?: number;
  };
  promptKey?: string;
  taskType?: AITaskType;
  cached?: boolean;
}

export interface AIResult<T = any> {
  success: boolean;
  data?: T;
  rawText: string;
  metadata: AIMetadata;
  error?: AIErrorClassification;
}

export interface AIProviderHealth {
  provider: string;
  configured: boolean;
  status: 'online' | 'unconfigured' | 'error';
  availableModels: string[];
  latencyMs?: number;
  message?: string;
}

export interface IAIProvider {
  readonly name: string;
  generate(request: NormalizedAIRequest): Promise<NormalizedAIResponse>;
  supportsModel(modelId: string): boolean;
  checkHealth(): Promise<AIProviderHealth>;
  resolveModel(taskType?: AITaskType, requestedModel?: string): string;
}
