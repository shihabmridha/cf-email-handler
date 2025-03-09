import { DraftEntity } from '../entities/draft';
import { IDatabase } from '../interfaces/database';
import { BaseRepository } from './base';
import { IDraftRepository } from '../interfaces/repositories/draft';

export class DraftRepository extends BaseRepository<DraftEntity> implements IDraftRepository<DraftEntity>{
  constructor(db: IDatabase) {
    super(db);
  }

  protected get tableName(): string {
    return 'drafts';
  }

  async create(user: DraftEntity): Promise<DraftEntity> {
    const sql = `INSERT INTO ${this.tableName} (userId, recipients, cc, subject, body)
                 VALUES (?, ?, ?, ?, ?)`;

    const response = await this._db.prepare(sql)
      .bind(user.userId, user.recipients, user.cc, user.subject, user.body)
      .run();

    if (!response.success) {
      throw new Error('Failed to create draft');
    }

    return { ...user, id: response.meta.last_row_id };
  }

  async update(id: number, user: DraftEntity): Promise<DraftEntity> {
    const sql = `UPDATE drafts
                 SET recipients = ?,
                     cc         = ?,
                     subject    = ?,
                     body       = ?
                 WHERE id = ?`;
    const response = await this._db.prepare(sql)
      .bind(user.recipients, user.cc, user.subject, user.body, id)
      .run();

    if (!response.success) {
      throw new Error('Failed to update draft');
    }

    return { ...user, id };
  }

  async delete(id: number): Promise<boolean> {
    const response = await this._db.prepare('DELETE FROM drafts WHERE id = ?')
      .bind(id)
      .run();

    return response.success;
  }
}
