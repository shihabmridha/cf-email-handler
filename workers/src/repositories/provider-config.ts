import {ProviderConfigEntity} from "../entities/provider-config";

export class ProviderConfigRepository {
  private readonly DB: D1Database;

  constructor(db: D1Database) {
    this.DB = db;
  }

  async getAll(): Promise<ProviderConfigEntity[]> {
    const response = await this.DB.prepare('SELECT * FROM provider_configs')
      .all<ProviderConfigEntity>();

    return response.results;
  }

  async getById(id: number): Promise<ProviderConfigEntity | null> {
    const response = await this.DB.prepare('SELECT * FROM provider_configs WHERE id = ?')
      .bind(id)
      .first<ProviderConfigEntity>();

    return response ?? null;
  }

  async create(provider: ProviderConfigEntity): Promise<ProviderConfigEntity> {
    const sql = `INSERT INTO provider_configs (name, userId, type, enabled, domain, smtp, api) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const response = await this.DB.prepare(sql)
      .bind(provider.name, provider.userId, provider.type, provider.enabled, provider.domain, provider.smtp, provider.api)
      .run();

    if (!response.success) {
      throw new Error('Failed to create new provider');
    }

    return {...provider, id: response.meta.last_row_id};
  }

  async update(id: number, provider: ProviderConfigEntity): Promise<ProviderConfigEntity> {
    const sql = `UPDATE provider_configs SET smtp = ?, api = ?, domain = ? WHERE id = ?`;
    const response = await this.DB.prepare(sql)
      .bind(provider.smtp, provider.api, provider.domain, id)
      .run();

    if (!response.success) {
      throw new Error('Failed to update provider');
    }

    return {...provider, id};
  }

  async delete(id: number): Promise<boolean> {
    const response = await this.DB.prepare('DELETE FROM provider_configs WHERE id = ?')
      .bind(id)
      .run();

    return response.success;
  }
}
