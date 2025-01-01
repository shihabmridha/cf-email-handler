import {ProviderEntity} from "../entities/provider";

export class ProviderRepository {
  private readonly DB: D1Database;

  constructor(db: D1Database) {
    this.DB = db;
  }

  async getAll(): Promise<ProviderEntity[]> {
    const response = await this.DB.prepare('SELECT * FROM providers')
      .all<ProviderEntity>();

    return response.results;
  }

  async create(provider: ProviderEntity): Promise<ProviderEntity> {
    const sql = `INSERT INTO providers (userId, smtp, api) VALUES (?, ?, ?)`;
    const response = await this.DB.prepare(sql)
      .bind(provider.userId, provider.smtp, provider.api)
      .run();

    if (!response.success) {
      throw new Error('Failed to create new provider');
    }

    return {...provider, id: response.meta.last_row_id};
  }

  async update(id: number, provider: ProviderEntity): Promise<ProviderEntity> {
    const sql = `UPDATE providers SET smtp = ?, api = ? WHERE id = ?`;
    const response = await this.DB.prepare(sql)
      .bind(provider.smtp, provider.api, id)
      .run();

    if (!response.success) {
      throw new Error('Failed to update provider');
    }

    return {...provider, id};
  }

  async delete(id: number): Promise<boolean> {
    const response = await this.DB.prepare('DELETE FROM providers WHERE id = ?')
      .bind(id)
      .run();

    return response.success;
  }
}
