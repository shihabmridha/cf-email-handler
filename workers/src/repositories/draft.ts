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

  async create(user: DraftEntity): Promise<boolean> {
    const response = await this.DB.prepare(`INSERT INTO drafts (userId, recipients, cc, subject, body) VALUES (?, ?, ?, ?, ?)`)
      .bind(user.userId, user.recipients, user.cc, user.subject, user.body)
      .run();

    return response.success;
  }

  async update(id: number, user: DraftEntity): Promise<boolean> {
    const response = await this.DB.prepare(`UPDATE drafts SET recipients = ?, cc = ?, subject = ?, body = ? WHERE id = ?`)
      .bind(user.recipients, user.cc, user.subject, user.body, id)
      .run();

    return response.success;
  }
}
