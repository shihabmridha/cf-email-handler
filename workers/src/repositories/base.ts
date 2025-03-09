import { IDatabase } from "../interfaces/database";
import { IBaseRepository } from '../interfaces/repositories/base';

export abstract class BaseRepository<T> implements IBaseRepository<T>{
  protected readonly _db: D1Database;
  protected constructor(db: IDatabase) {
    this._db = db.instance();
  }

  protected abstract get tableName() : string;

  async getAll(): Promise<T[]> {
    const response = await this._db.prepare(`SELECT * FROM ${this.tableName}`)
      .all<T>();

    return response.results;
  }

  async getById(id: number): Promise<T | null> {
    const response = await this._db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
      .bind(id)
      .first<T>();

    return response ?? null;
  }
}

