import { EmailRouteEntity } from "../entities/email-route";
import { IDatabase } from "../interfaces/database";
import { BaseRepository } from "./base";
import { IEmailRouteRepository } from '../interfaces/repositories/email-route';
import { EmailClass } from "@/enums/email-class";

export class EmailRouteRepository extends BaseRepository<EmailRouteEntity> implements IEmailRouteRepository {
  constructor(db: IDatabase) {
    super(db);
  }

  protected get tableName(): string {
    return 'email_routes';
  }

  async create(route: EmailRouteEntity): Promise<void> {
    const sql = `INSERT INTO ${this.tableName} (userId, email, destination, type, enabled, \`drop\`) VALUES (?, ?, ?, ?, ?, ?)`;
    const response = await this._db.prepare(sql)
      .bind(route.userId, route.email, route.destination, route.type, route.enabled, route.drop)
      .run();

    if (!response.success) {
      throw new Error('Failed to create new provider');
    }
  }

  async update(id: number, route: EmailRouteEntity): Promise<void> {
    const sql = `UPDATE ${this.tableName} SET email = ?, destination = ?, type = ?, enabled = ?, \`drop\` = ? WHERE id = ?`;
    const response = await this._db.prepare(sql)
      .bind(route.email, route.destination, route.type, route.enabled, route.drop, id)
      .run();

    if (!response.success) {
      throw new Error('Failed to update email route');
    }
  }

  async delete(id: number): Promise<boolean> {
    const response = await this._db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
      .bind(id)
      .run();

    return response.success;
  }

  async getByEmail(email: string, enabledOnly: boolean = true): Promise<EmailRouteEntity[]> {
    const sql = enabledOnly
      ? `SELECT * FROM ${this.tableName} WHERE email = ? AND enabled = 1`
      : `SELECT * FROM ${this.tableName} WHERE email = ?`;

    const result = await this._db
      .prepare(sql)
      .bind(email)
      .all<EmailRouteEntity>();

    if (!result?.success) {
      console.error('Failed to fetch routes for email:', email);
      return [];
    }

    return result?.results ?? [];
  }

  async incrementReceived(email: string, emailClass: EmailClass): Promise<void> {
    const sql = `UPDATE ${this.tableName} SET received = received + 1 WHERE email = ? AND type = ?`;
    const response = await this._db.prepare(sql)
      .bind(email, emailClass)
      .run();

    if (!response.success) {
      throw new Error('Failed to increment received');
    }
  }

  async incrementSent(email: string, emailClass: EmailClass): Promise<void> {
    const sql = `UPDATE ${this.tableName} SET sent = sent + 1 WHERE email = ? AND type = ?`;
    const response = await this._db.prepare(sql)
      .bind(email, emailClass)
      .run();

    if (!response.success) {
      throw new Error('Failed to increment sent');
    }
  }

  async incrementSentByEmail(email: string): Promise<void> {
    const sql = `UPDATE ${this.tableName} SET sent = sent + 1 WHERE email = ? AND enabled = 1`;
    const response = await this._db.prepare(sql)
      .bind(email)
      .run();

    if (!response.success) {
      throw new Error('Failed to increment sent by email');
    }
  }
}
