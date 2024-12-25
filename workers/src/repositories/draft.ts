import {DraftEntity} from "../entities/draft";

export class DraftRepository {
  private readonly DB: D1Database;

  constructor(db: D1Database) {
    this.DB = db;
  }

  async getAll(): Promise<DraftEntity[]> {
    const response = await this.DB.prepare('SELECT * FROM drafts')
      .all<DraftEntity>();

    return response.results;
  }

  async create(user: DraftEntity): Promise<DraftEntity> {
    const sql = `INSERT INTO drafts (userId, recipients, cc, subject, body)
                 VALUES (?, ?, ?, ?, ?)`;

    const response = await this.DB.prepare(sql)
      .bind(user.userId, user.recipients, user.cc, user.subject, user.body)
      .run();

    if (!response.success) {
      throw new Error('Failed to create draft');
    }

    return {...user, id: response.meta.last_row_id};
  }

  async update(id: number, user: DraftEntity): Promise<DraftEntity> {
    const sql = `UPDATE drafts SET recipients = ?, cc = ?, subject = ?, body = ? WHERE id = ?`;
    const response = await this.DB.prepare(sql)
      .bind(user.recipients, user.cc, user.subject, user.body, id)
      .run();

    if (!response.success) {
      throw new Error('Failed to update draft');
    }

    return {...user, id};
  }

  async delete(id: number): Promise<boolean> {
    const response = await this.DB.prepare('DELETE FROM drafts WHERE id = ?')
      .bind(id)
      .run();

    return response.success;
  }
}
