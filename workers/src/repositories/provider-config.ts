import { ProviderConfigEntity } from "../entities/provider-config";
import { BaseRepository } from './base';
import { IDatabase } from '../interfaces/database';
import { IProviderConfigRepository } from '../interfaces/repositories/provider-config';

export class ProviderConfigRepository extends BaseRepository<ProviderConfigEntity> implements IProviderConfigRepository {

  constructor(db: IDatabase) {
    super(db);
  }

  protected get tableName() {
    return 'provider_configs';
  }

  async create(provider: ProviderConfigEntity): Promise<ProviderConfigEntity> {
    const sql = `INSERT INTO ${this.tableName} (name, userId, type, enabled, domain, smtp, api) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const response = await this._db.prepare(sql)
      .bind(provider.name, provider.userId, provider.type, provider.enabled, provider.domain, provider.smtp, provider.api)
      .run();

    if (!response.success) {
      throw new Error('Failed to create new provider');
    }

    return { ...provider, id: response.meta.last_row_id };
  }

  async update(id: number, provider: ProviderConfigEntity): Promise<ProviderConfigEntity> {
    const sql = `UPDATE ${this.tableName} SET name = ?, smtp = ?, api = ?, domain = ? WHERE id = ?`;
    const response = await this._db.prepare(sql)
      .bind(provider.name, provider.smtp, provider.api, provider.domain, id)
      .run();

    if (!response.success) {
      throw new Error('Failed to update provider');
    }

    return { ...provider, id };
  }

  async delete(id: number): Promise<boolean> {
    const response = await this._db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
      .bind(id)
      .run();

    return response.success;
  }
}
