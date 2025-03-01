import { EmailRouteEntity } from "../entities/email-route";

export class EmailRouteRepository {
	private readonly DB: D1Database;

	constructor(db: D1Database) {
		this.DB = db;
	}

  async getAll(): Promise<EmailRouteEntity[]> {
    const response = await this.DB.prepare('SELECT * FROM email_routes')
      .all<EmailRouteEntity>();

    return response.results;
  }

  async getByEmail(email: string): Promise<EmailRouteEntity | null> {
    const response = await this.DB.prepare('SELECT * FROM email_routes WHERE email =?')
     .bind(email)
     .first<EmailRouteEntity>();

    return response;
  }

  async create(route: EmailRouteEntity): Promise<void> {
    const sql = `INSERT INTO email_routes (userId, email, destination, enabled) VALUES (?, ?, ?, ?)`;
    const response = await this.DB.prepare(sql)
      .bind(route.userId, route.email, route.destination, route.enabled)
      .run();

    if (!response.success) {
      throw new Error('Failed to create new provider');
    }
  }

  async update(id: number, route: EmailRouteEntity): Promise<void> {
    const sql = `UPDATE email_routes SET email = ?, destination = ?, enabled = ? WHERE id = ?`;
    const response = await this.DB.prepare(sql)
      .bind(route.email, route.destination, route.enabled, id)
      .run();

    if (!response.success) {
      throw new Error('Failed to update provider');
    }
  }

  async delete(id: number): Promise<boolean> {
    const response = await this.DB.prepare('DELETE FROM email_routes WHERE id = ?')
      .bind(id)
      .run();

    return response.success;
  }
}
