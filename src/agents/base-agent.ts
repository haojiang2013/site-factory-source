import { aiCall, AIProvider } from '../lib/ai-client';

export interface AgentConfig {
  name: string;
  provider: AIProvider;
  model?: string;
  systemPrompt: string;
  maxRetries?: number;
}

export abstract class BaseAgent {
  constructor(protected config: AgentConfig) {}

  /** Call the AI model. Auto-retries + provider fallback handled by ai-client. */
  protected async think(userMessage: string, maxTokens?: number): Promise<string> {
    let lastError: Error | null = null;
    const maxRetries = this.config.maxRetries || 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await aiCall({
          provider: this.config.provider,
          model: this.config.model,
          systemPrompt: this.config.systemPrompt,
          userMessage,
          temperature: 0.7,
          maxTokens: maxTokens || 4096,
        });
      } catch (e) {
        lastError = e as Error;
        if (attempt < maxRetries - 1) {
          console.warn(
            `[${this.config.name}] Attempt ${attempt + 1} failed: ${lastError.message}. Retrying in ${(attempt + 1) * 2}s...`
          );
          await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        }
      }
    }
    throw new Error(
      `[${this.config.name}] All ${maxRetries} attempts exhausted. Last error: ${lastError?.message}`
    );
  }

  /** Subclasses implement their specific logic here. */
  abstract execute(input: unknown): Promise<unknown>;
}
