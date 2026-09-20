/**
 * DARK MATTER LAB — AI Orchestrator Layer
 * Phase 2: Central AI Orchestration Engine
 * 
 * Strict Principle:
 * All workspaces communicate through this orchestrator.
 * Single gateway for model routing, context injection, prompt resolution,
 * Zod validation, retry policies, and telemetry attachment.
 */

import {
  AIRequest,
  AIResult,
  IAIProvider,
  NormalizedAIRequest,
  AIErrorClassification,
  AIMetadata,
} from '../types.ts';
import { PromptRegistry } from '../prompts/promptRegistry.ts';
import { ContextSelector } from '../context/contextSelector.ts';
import { validateStructuredData } from '../schemas/aiSchemas.ts';
import { IJobManager } from '../../jobs/jobManager.ts';

export class AIOrchestrator {
  constructor(
    private provider: IAIProvider,
    private promptRegistry: PromptRegistry,
    private contextSelector: ContextSelector
  ) {}

  /**
   * Primary unified generation entrypoint
   */
  async generate<T = any>(request: AIRequest): Promise<AIResult<T>> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const startTime = Date.now();

    // 1. Resolve Prompt Template (if promptKey specified)
    let finalPrompt = request.prompt;
    let finalSystemInstruction = request.systemInstruction || '';
    let responseFormat = request.responseFormat || 'text';
    let schemaKey = request.schemaKey;
    let taskType = request.taskType || 'default';

    if (request.promptKey) {
      const template = this.promptRegistry.get(request.promptKey);
      if (!template) {
        return this.buildErrorResult(
          {
            code: 'INVALID_REQUEST',
            message: `Prompt template '${request.promptKey}' not found in registry.`,
            retryable: false,
            statusCode: 400,
            provider: this.provider.name,
          },
          requestId,
          startTime,
          'unknown',
          taskType,
          request.promptKey
        );
      }

      finalPrompt = template.renderPrompt(request.metadata?.variables || {});
      finalSystemInstruction = [template.systemInstruction, request.systemInstruction]
        .filter(Boolean)
        .join('\n\n');
      responseFormat = request.responseFormat || template.responseFormat;
      schemaKey = request.schemaKey || template.schemaKey;
      taskType = request.taskType || template.taskType;
    }

    // 2. Context Injection
    if (request.contextSlice) {
      const formattedContext = this.contextSelector.formatContextForPrompt(request.contextSlice);
      if (formattedContext) {
        finalSystemInstruction = finalSystemInstruction
          ? `${finalSystemInstruction}\n\n${formattedContext}`
          : formattedContext;
      }
    }

    // 3. Prompt Validation
    if (!finalPrompt || !finalPrompt.trim()) {
      return this.buildErrorResult(
        {
          code: 'INVALID_REQUEST',
          message: 'Prompt content is empty. Provide either prompt or promptKey with valid parameters.',
          retryable: false,
          statusCode: 400,
          provider: this.provider.name,
        },
        requestId,
        startTime,
        'unknown',
        taskType,
        request.promptKey
      );
    }

    // 4. Model Resolution
    const resolvedModel = this.provider.resolveModel(taskType, request.model);

    // 5. Normalized Request Preparation
    const normalizedReq: NormalizedAIRequest = {
      model: resolvedModel,
      contents: finalPrompt.trim(),
      systemInstruction: finalSystemInstruction.trim() || undefined,
      temperature: request.temperature,
      maxOutputTokens: request.maxTokens,
      responseMimeType: responseFormat === 'json' ? 'application/json' : undefined,
      requestId,
    };

    // 5. Execute with Exponential Backoff Retry for transient errors
    let attempt = 0;
    const maxRetries = 2;
    let lastError: any = null;

    while (attempt <= maxRetries) {
      try {
        const rawResponse = await this.provider.generate(normalizedReq);
        const latencyMs = Date.now() - startTime;

        // Structured parsing & schema validation if JSON format
        let parsedData: T | undefined = undefined;
        if (responseFormat === 'json') {
          try {
            // Strip any accidental markdown formatting if present
            const cleanedText = rawResponse.rawText
              .replace(/```json\n?/g, '')
              .replace(/```\n?/g, '')
              .trim();

            const rawJson = JSON.parse(cleanedText);

            if (schemaKey) {
              const validation = validateStructuredData<T>(schemaKey, rawJson);
              if (!validation.success) {
                return this.buildErrorResult(
                  {
                    code: 'VALIDATION_ERROR',
                    message: validation.error,
                    retryable: false,
                    statusCode: 422,
                    provider: this.provider.name,
                  },
                  requestId,
                  startTime,
                  resolvedModel,
                  taskType,
                  request.promptKey,
                  rawResponse.rawText
                );
              }
              parsedData = validation.data;
            } else {
              parsedData = rawJson as T;
            }
          } catch (jsonErr: any) {
            return this.buildErrorResult(
              {
                code: 'VALIDATION_ERROR',
                message: `Failed to parse AI output as JSON: ${jsonErr.message}`,
                retryable: false,
                statusCode: 422,
                provider: this.provider.name,
              },
              requestId,
              startTime,
              resolvedModel,
              taskType,
              request.promptKey,
              rawResponse.rawText
            );
          }
        }

        const metadata: AIMetadata = {
          requestId,
          timestamp: new Date().toISOString(),
          model: resolvedModel,
          provider: this.provider.name,
          latencyMs,
          finishReason: rawResponse.finishReason,
          tokenUsage: rawResponse.tokenUsage,
          promptKey: request.promptKey,
          taskType,
        };

        // Observability
        console.log(
          `[AIOrchestrator] ${requestId} -> ${resolvedModel} [${latencyMs}ms] OK`
        );

        return {
          success: true,
          data: parsedData,
          rawText: rawResponse.rawText,
          metadata,
        };
      } catch (err: any) {
        lastError = err;
        const isRetryable = err?.retryable === true;
        if (isRetryable && attempt < maxRetries) {
          attempt++;
          const delayMs = Math.pow(2, attempt) * 500 + Math.random() * 200;
          console.warn(
            `[AIOrchestrator] ${requestId} transient failure (${err.code}). Retrying attempt ${attempt}/${maxRetries} in ${Math.round(delayMs)}ms...`
          );
          await new Promise((r) => setTimeout(r, delayMs));
          continue;
        }
        break;
      }
    }

    // Failed after retries or non-retryable error
    const classifiedError: AIErrorClassification = lastError?.code
      ? lastError
      : {
          code: 'UNKNOWN_ERROR',
          message: lastError?.message || 'AI generation failed',
          retryable: false,
          statusCode: 500,
          provider: this.provider.name,
        };

    console.error(
      `[AIOrchestrator] ${requestId} -> ${resolvedModel} ERROR [${classifiedError.code}]: ${classifiedError.message}`
    );

    return this.buildErrorResult(
      classifiedError,
      requestId,
      startTime,
      resolvedModel,
      taskType,
      request.promptKey
    );
  }

  /**
   * Bridges long-running AI operations into the existing JobRecord system
   */
  async executeAsyncJob(
    jobId: string,
    request: AIRequest,
    jobManager: IJobManager
  ): Promise<void> {
    jobManager.updateProgress(jobId, 10);

    try {
      jobManager.updateProgress(jobId, 30);
      const result = await this.generate(request);

      if (!result.success) {
        jobManager.markFailed(jobId, result.error?.message || 'AI execution failed');
        return;
      }

      jobManager.updateProgress(jobId, 90);
      const outputRef = `ai://results/${result.metadata.requestId}.json`;
      jobManager.markCompleted(jobId, outputRef);
    } catch (err: any) {
      jobManager.markFailed(jobId, err.message || 'AI job crashed unexpectedly');
    }
  }

  /**
   * Health and capability inspector
   */
  async checkHealth() {
    const providerHealth = await this.provider.checkHealth();
    return {
      status: providerHealth.status,
      configured: providerHealth.configured,
      provider: providerHealth.provider,
      availableModels: providerHealth.availableModels,
      latencyMs: providerHealth.latencyMs,
      message: providerHealth.message,
      promptTemplatesCount: this.promptRegistry.list().length,
      timestamp: new Date().toISOString(),
    };
  }

  getPromptRegistry(): PromptRegistry {
    return this.promptRegistry;
  }

  getContextSelector(): ContextSelector {
    return this.contextSelector;
  }

  private buildErrorResult(
    error: AIErrorClassification,
    requestId: string,
    startTime: number,
    model: string,
    taskType?: any,
    promptKey?: string,
    rawText: string = ''
  ): AIResult {
    return {
      success: false,
      rawText,
      error,
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
        model,
        provider: this.provider.name,
        latencyMs: Date.now() - startTime,
        promptKey,
        taskType,
      },
    };
  }
}
