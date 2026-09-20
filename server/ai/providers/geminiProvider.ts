/**
 * DARK MATTER LAB — Gemini AI Provider
 * Phase 2: Server-Side Gemini Gateway Adapter
 * 
 * Strict Principle:
 * Server-Side Only. Never expose GEMINI_API_KEY to browser.
 * Uses modern @google/genai TypeScript SDK.
 * Lazy initialization ensures server boots even if API key is not yet configured.
 */

import { GoogleGenAI } from '@google/genai';
import {
  IAIProvider,
  NormalizedAIRequest,
  NormalizedAIResponse,
  AIProviderHealth,
  AITaskType,
  AIErrorClassification,
} from '../types.ts';

export class GeminiProvider implements IAIProvider {
  readonly name = 'Google Gemini';
  private client: GoogleGenAI | null = null;

  // Model hierarchy
  public static readonly MODEL_FLASH = 'gemini-3.6-flash';
  public static readonly MODEL_PRO = 'gemini-3.1-pro-preview';
  public static readonly MODEL_LITE = 'gemini-3.1-flash-lite';

  private supportedModels = [
    GeminiProvider.MODEL_FLASH,
    GeminiProvider.MODEL_PRO,
    GeminiProvider.MODEL_LITE,
  ];

  private cachedHealth: { status: AIProviderHealth; timestamp: number } | null = null;

  /**
   * Safe lazy initialization of GoogleGenAI client
   */
  private getClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
      const authErr: AIErrorClassification = {
        code: 'AUTH_ERROR',
        message: 'GEMINI_API_KEY is not configured on the server. Please provide a valid Gemini API key in Settings.',
        retryable: false,
        statusCode: 401,
        provider: this.name,
      };
      throw authErr;
    }

    if (!this.client) {
      this.client = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }

    return this.client;
  }

  /**
   * Maps task archetype to recommended model
   */
  resolveModel(taskType?: AITaskType, requestedModel?: string): string {
    if (requestedModel && requestedModel.trim()) {
      return requestedModel.trim();
    }

    switch (taskType) {
      case 'reasoning':
        return GeminiProvider.MODEL_PRO;
      case 'fast':
      case 'creative':
      case 'structured':
      case 'default':
      default:
        return GeminiProvider.MODEL_FLASH;
    }
  }

  supportsModel(modelId: string): boolean {
    return this.supportedModels.includes(modelId) || modelId.startsWith('gemini-');
  }

  /**
   * Executes normalized AI generation
   */
  async generate(request: NormalizedAIRequest): Promise<NormalizedAIResponse> {
    const client = this.getClient();

    try {
      const config: Record<string, any> = {};

      if (request.systemInstruction) {
        config.systemInstruction = request.systemInstruction;
      }
      if (typeof request.temperature === 'number') {
        config.temperature = request.temperature;
      }
      if (typeof request.maxOutputTokens === 'number') {
        config.maxOutputTokens = request.maxOutputTokens;
      }
      if (request.responseMimeType) {
        config.responseMimeType = request.responseMimeType;
      }

      const response = await client.models.generateContent({
        model: request.model,
        contents: request.contents,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      const rawText = response.text || '';

      const usageMetadata = response.usageMetadata;
      const tokenUsage = usageMetadata
        ? {
            promptTokens: usageMetadata.promptTokenCount,
            candidatesTokens: usageMetadata.candidatesTokenCount,
            totalTokens: usageMetadata.totalTokenCount,
          }
        : undefined;

      const finishReason = response.candidates?.[0]?.finishReason || undefined;

      return {
        rawText,
        finishReason,
        tokenUsage,
      };
    } catch (err: any) {
      throw this.classifyError(err);
    }
  }

  /**
   * Health and capability probe
   */
  async checkHealth(): Promise<AIProviderHealth> {
    const apiKey = process.env.GEMINI_API_KEY;
    const isConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY');

    if (!isConfigured) {
      return {
        provider: this.name,
        configured: false,
        status: 'unconfigured',
        availableModels: this.supportedModels,
        message: 'GEMINI_API_KEY is not configured in server environment.',
      };
    }

    // Return cached health if fresh (< 60s)
    if (this.cachedHealth && Date.now() - this.cachedHealth.timestamp < 60000) {
      return this.cachedHealth.status;
    }

    const startTime = Date.now();
    try {
      // Fast diagnostic ping
      const client = this.getClient();
      const test = await client.models.generateContent({
        model: GeminiProvider.MODEL_FLASH,
        contents: 'ping',
        config: {
          maxOutputTokens: 5,
        },
      });

      const latencyMs = Date.now() - startTime;
      const status: AIProviderHealth = {
        provider: this.name,
        configured: true,
        status: 'online',
        availableModels: this.supportedModels,
        latencyMs,
        message: `Gemini Gateway active. Response: ${test.text?.slice(0, 20) || 'OK'}`,
      };

      this.cachedHealth = { status, timestamp: Date.now() };
      return status;
    } catch (err: any) {
      const classified = this.classifyError(err);
      return {
        provider: this.name,
        configured: true,
        status: 'error',
        availableModels: this.supportedModels,
        latencyMs: Date.now() - startTime,
        message: classified.message,
      };
    }
  }

  /**
   * Classifies low-level Gemini API errors into clean, normalized domain errors
   */
  private classifyError(err: any): AIErrorClassification {
    const msg = (err?.message || String(err)).toLowerCase();
    const status = err?.status || err?.statusCode || 500;

    // Check for auth issues
    if (msg.includes('api_key') || msg.includes('api key') || status === 401 || status === 403) {
      return {
        code: 'AUTH_ERROR',
        message: 'Invalid or missing Gemini API credentials.',
        retryable: false,
        statusCode: 401,
        provider: this.name,
      };
    }

    // Check for rate limit / quota
    if (msg.includes('quota') || msg.includes('resource_exhausted') || status === 429) {
      return {
        code: 'RATE_LIMIT',
        message: 'Gemini rate limit or quota exceeded. Please retry momentarily.',
        retryable: true,
        statusCode: 429,
        provider: this.name,
      };
    }

    // Check for server / unavailable
    if (status === 503 || msg.includes('unavailable') || msg.includes('overloaded')) {
      return {
        code: 'PROVIDER_UNAVAILABLE',
        message: 'Gemini service is temporarily unavailable. Retryable.',
        retryable: true,
        statusCode: 503,
        provider: this.name,
      };
    }

    // Check for invalid arguments / token limits
    if (status === 400 || msg.includes('invalid') || msg.includes('unsupported')) {
      return {
        code: 'INVALID_REQUEST',
        message: `Invalid AI generation parameters: ${err.message || 'Check request payload'}`,
        retryable: false,
        statusCode: 400,
        provider: this.name,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: err.message || 'An unexpected error occurred in the Gemini gateway.',
      retryable: false,
      statusCode: 500,
      provider: this.name,
    };
  }
}
