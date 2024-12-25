import {UserEntity} from "../entities/user";

export class UserRepository {
  private readonly DB: D1Database;

  constructor(db: D1Database) {
    this.DB = db;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.DB.prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first<UserEntity>();
  }

  async create(user: UserEntity): Promise<void> {
    await this.DB.prepare('INSERT INTO users (email, password, salt) VALUES (?, ?, ?)')
      .bind(user.email, user.password, user.salt)
      .run();
  }
}
