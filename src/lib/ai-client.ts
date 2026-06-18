import OpenAI from 'openai';

export type AIProvider = 'deepseek' | 'openai' | 'gemini';

export interface AICallOptions {
  provider?: AIProvider;
  model?: string;
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
}

// ── Lazy init ──
let _deepseek: OpenAI | null = null;
let _openai: OpenAI | null = null;
let _gemini: OpenAI | null = null;

function getDeepSeek(): OpenAI {
  if (!_deepseek) {
    _deepseek = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || 'sk-xxx',
      baseURL: 'https://api.deepseek.com/v1',
    });
  }
  return _deepseek;
}

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

function getGemini(): OpenAI {
  if (!_gemini) {
    _gemini = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY || 'sk-xxx',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });
  }
  return _gemini;
}

// Fallback order: primary → the other
const FALLBACK_MAP: Record<AIProvider, AIProvider> = {
  deepseek: 'gemini',
  gemini: 'deepseek',
  openai: 'gemini',
};

// Provider → default model
const DEFAULT_MODELS: Record<AIProvider, string> = {
  deepseek: 'deepseek-v4-flash',
  openai: 'gpt-4o-mini',
  gemini: 'gemini-1.5-flash',
};

export async function aiCall(options: AICallOptions): Promise<string> {
  const primary = options.provider || 'deepseek';
  const fallback = FALLBACK_MAP[primary];
  const model = options.model || DEFAULT_MODELS[primary];

  const providers = [primary, fallback];
  const errors: Error[] = [];

  for (const p of providers) {
    try {
      if (p === 'gemini') {
        const client = getGemini();
        const res = await client.chat.completions.create({
          model: model.startsWith('gemini') ? model : 'gemini-1.5-flash',
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature ?? 0.7,
          messages: [
            { role: 'system', content: options.systemPrompt },
            { role: 'user', content: options.userMessage },
          ],
        });
        const text = res.choices[0]?.message?.content || '';
        if (text) return text;
        throw new Error('Empty Gemini response');
      } else if (p === 'deepseek') {
        const client = getDeepSeek();
        const res = await client.chat.completions.create({
          model: model.startsWith('deepseek') ? model : 'deepseek-v4-flash',
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature ?? 0.7,
          messages: [
            { role: 'system', content: options.systemPrompt },
            { role: 'user', content: options.userMessage },
          ],
        });
        const text = res.choices[0]?.message?.content || '';
        if (text) return text;
        throw new Error('Empty DeepSeek response');
      } else {
        const client = getOpenAI();
        const res = await client.chat.completions.create({
          model: model.startsWith('gpt') ? model : 'gpt-4o-mini',
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature ?? 0.7,
          messages: [
            { role: 'system', content: options.systemPrompt },
            { role: 'user', content: options.userMessage },
          ],
        });
        const text = res.choices[0]?.message?.content || '';
        if (text) return text;
        throw new Error('Empty OpenAI response');
      }
    } catch (e) {
      errors.push(e as Error);
      if (errors.length >= providers.length) {
        console.error(
          `[aiCall] All providers failed:`,
          errors.map(e => e.message).join(' | ')
        );
        throw errors[0];
      }
      console.warn(`[aiCall] ${p} failed, falling back... (${(e as Error).message.slice(0, 80)})`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw errors[0];
}
