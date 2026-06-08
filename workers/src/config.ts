import { LlmProvider } from './enums/llm-provider';

export class Configuration {
  public readonly discordHookUrl: string;
  public readonly emailForwardTo: string;
  public readonly deepseekApiKey: string;
  public readonly llmProvider: LlmProvider;
  public readonly llmModel: string;
  public readonly jwtSecret: string;
  public readonly adminEmail: string;
  public readonly adminPassword: string;

  constructor(env: Env) {
    this.discordHookUrl = env.DISCORD_HOOK_URL;
    this.emailForwardTo = env.EMAIL_FORWARD_TO;
    this.deepseekApiKey = env.DEEPSEEK_API_KEY;
    this.llmProvider = (env.LLM_PROVIDER as LlmProvider) || LlmProvider.DEEPSEEK;
    this.llmModel = env.LLM_MODEL || 'deepseek-v4-flash';
    this.jwtSecret = env.JWT_SECRET;
    this.adminEmail = env.ADMIN_EMAIL;
    this.adminPassword = env.ADMIN_PASSWORD;
  }
}
