import { createDeepSeek } from '@ai-sdk/deepseek';
import type { LanguageModel } from 'ai';
import { LlmProvider } from '@/enums/llm-provider';
import { Configuration } from '../../config';

export class LlmFactory {
  static createModel(config: Configuration): LanguageModel {
    switch (config.llmProvider) {
      case LlmProvider.DEEPSEEK:
        return createDeepSeek({ apiKey: config.deepseekApiKey })(config.llmModel);
      default:
        throw new Error(`LLM provider ${config.llmProvider} not found`);
    }
  }
}
