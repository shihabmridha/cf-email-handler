import { Configuration } from './config';
import { UserRepository } from './repositories/user';
import { AuthService } from './services/auth';
import { DiscordService } from './services/discord';
import { PredictionService } from './services/prediction';
import { GeminiService } from './services/llm/gemini';
import { LlmService } from './interfaces/llm';
import { DraftService } from './services/draft';
import { DraftRepository } from './repositories/draft';
import { EmailRouteRepository } from './repositories/email-route';
import { IDatabase } from './interfaces/database';
import { Database } from './database';
import { ProviderConfigRepository } from './repositories/provider-config';
import { EmailRouteService } from './services/email-route';
import { MailService } from './services/mail';
import { ProviderConfigService } from './services/provider/config';
import { IncomingHistoryRepository } from './repositories/incoming-history';
import { IncomingHistoryService } from './services/incoming-history';
import { SettingsRepository } from './repositories/settings';
import { SettingsService } from './services/settings';

export class Container {
  private readonly _config: Configuration;
  private readonly _db: IDatabase;
  private readonly instances: Map<string, object>;

  constructor(env: Env) {
    this._config = new Configuration(env);
    this._db = new Database(env.DB);
    this.instances = new Map();
  }

  get<T>(key: string, factory: (container: Container) => object): T {
    if (!this.instances.has(key)) {
      this.instances.set(key, factory(this));
    }
    return this.instances.get(key) as T;
  }

  getConfig() {
    return this._config;
  }

  getUserRepository(): UserRepository {
    return this.get('userRepository', () => new UserRepository(this._db));
  }

  getDraftRepository(): DraftRepository {
    return this.get('draftRepository', () => new DraftRepository(this._db));
  }

  getEmailRouteRepository(): EmailRouteRepository {
    return this.get('emailRouteRepository', () => new EmailRouteRepository(this._db));
  }

  getProviderConfigRepository(): ProviderConfigRepository {
    return this.get('providerConfigRepository', () => new ProviderConfigRepository(this._db));
  }

  getSettingsRepository(): SettingsRepository {
    return this.get('settingsRepository', () => new SettingsRepository(this._db));
  }

  getMailService(): MailService {
    return this.get('mailService', () => new MailService(this.getProviderConfigService()));
  }

  getAuthService(): AuthService {
    return this.get('authService', () => new AuthService(this.getUserRepository(), this._config));
  }

  getLlmService(): LlmService {
    return this.get('llmService', () => new GeminiService(this._config));
  }

  getPredictionService(): PredictionService {
    return this.get('predictionService', () => new PredictionService(this.getLlmService()));
  }

  getDiscordService(): DiscordService {
    return this.get('discordService', () => new DiscordService(this._config));
  }

  getDraftService(): DraftService {
    return this.get('draftService', () => new DraftService(this.getDraftRepository()));
  }

  getProviderConfigService(): ProviderConfigService {
    return this.get('providerConfigService', () => new ProviderConfigService(this.getProviderConfigRepository()));
  }

  getEmailRouteService(): EmailRouteService {
    return this.get('emailRouteService', () => new EmailRouteService(this.getEmailRouteRepository(), this.getSettingsRepository()));
  }

  getIncomingHistoryRepository(): IncomingHistoryRepository {
    return this.get('incomingHistoryRepository', () => new IncomingHistoryRepository(this._db));
  }

  getIncomingHistoryService(): IncomingHistoryService {
    return this.get('incomingHistoryService', () => new IncomingHistoryService(this.getIncomingHistoryRepository()));
  }

  getSettingsService(): SettingsService {
    return this.get('settingsService', () => new SettingsService(this.getSettingsRepository()));
  }
}
