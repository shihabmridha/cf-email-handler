import { IDatabase } from "../interfaces/database";
import { BaseRepository } from "./base";
import { IIncomingHistoryRepository } from "../interfaces/repositories/incoming-history";
import { IncomingHistoryEntity } from "../entities/incoming-history";

export class IncomingHistoryRepository extends BaseRepository<IncomingHistoryEntity> implements IIncomingHistoryRepository {
  constructor(private readonly db: IDatabase) {
    super(db);
  }

  protected get tableName(): string {
    return 'incoming_history';
  }

  async create(data: IncomingHistoryEntity): Promise<void> {
    const sql = `INSERT INTO ${this.tableName} (fromEmail, toEmail, subject, destination, emailClass, summary) VALUES (?, ?, ?, ?, ?, ?)`;
    const response = await this._db.prepare(sql)
      .bind(data.fromEmail, data.toEmail, data.subject, data.destination, data.emailClass, data.summary)
      .run();

    if (!response.success) {
      throw new Error('Failed to create incoming history record');
    }
  }

  async update(id: number, data: IncomingHistoryEntity): Promise<void> {
    const sql = `UPDATE ${this.tableName} SET fromEmail = ?, toEmail = ?, subject = ?, destination = ?, emailClass = ?, summary = ? WHERE id = ?`;
    const response = await this._db.prepare(sql)
      .bind(data.fromEmail, data.toEmail, data.subject, data.destination, data.emailClass, data.summary, id)
      .run();

    if (!response.success) {
      throw new Error('Failed to update incoming history record');
    }
  }

  async delete(id: number): Promise<boolean> {
    const response = await this._db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
      .bind(id)
      .run();

    return response.success;
  }

  async getByPage(page: number): Promise<IncomingHistoryEntity[]> {
    const limit = 10;
    const offset = (page - 1) * limit;

    const response = await this._db.prepare(`SELECT * FROM ${this.tableName} LIMIT ? OFFSET ? ORDER BY createdAt DESC`)
      .bind(limit, offset)
      .all<IncomingHistoryEntity>();

    if (!response.success) {
      throw new Error('Failed to get incoming history records');
    }

    return response.results;
  }

  async getByToEmail(email: string): Promise<IncomingHistoryEntity[] | null> {
    const response = await this._db.prepare(`SELECT * FROM ${this.tableName} WHERE toEmail = ?`)
      .bind(email)
      .all<IncomingHistoryEntity>();

    if (!response.success) {
      throw new Error('Failed to get incoming history records');
    }

    return response.results;
  }

  async getByDestinationEmail(email: string): Promise<IncomingHistoryEntity[] | null> {
    const response = await this._db.prepare(`SELECT * FROM ${this.tableName} WHERE destination = ?`)
      .bind(email)
      .all<IncomingHistoryEntity>();

    if (!response.success) {
      throw new Error('Failed to get incoming history records');
    }

    return response.results;
  }
}
