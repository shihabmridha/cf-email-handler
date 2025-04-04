import { IDatabase } from "../interfaces/database";
import { BaseRepository } from "./base";
import { ISettingsRepository } from "../interfaces/repositories/settings";
import { SettingsEntity } from "../entities/settings.entity";

export class SettingsRepository extends BaseRepository<SettingsEntity> implements ISettingsRepository {
  constructor(db: IDatabase) {
    super(db);
  }

  protected get tableName(): string {
    return 'settings';
  }

  async getByKey(key: string): Promise<SettingsEntity | null> {
    const response = await this._db.prepare(`SELECT * FROM ${this.tableName} WHERE key = ?;`)
      .bind(key)
      .first<SettingsEntity>();

    return response ?? null;
  }

  async create(data: SettingsEntity): Promise<void> {
    const sql = `INSERT INTO ${this.tableName} (key, value, description) VALUES (?, ?, ?);`;
    const response = await this._db.prepare(sql)
      .bind(data.key, data.value, data.description)
      .run();

    if (!response.success) {
      throw new Error('Failed to create setting');
    }
  }

  async update(key: string, data: SettingsEntity): Promise<void> {
    const sql = `UPDATE ${this.tableName} SET value = ?, description = ? WHERE key = ?;`;
    const response = await this._db.prepare(sql)
      .bind(data.value, data.description, key)
      .run();

    if (!response.success) {
      throw new Error('Failed to update setting');
    }
  }

  async delete(key: string): Promise<boolean> {
    const response = await this._db.prepare(`DELETE FROM ${this.tableName} WHERE key = ?;`)
      .bind(key)
      .run();

    return response.success;
  }
}
