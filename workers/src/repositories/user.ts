import { UserEntity } from '../entities/user';
import { BaseRepository } from './base';
import { IDatabase } from '../interfaces/database';
import { IUserRepository } from '../interfaces/repositories/user';

export class UserRepository extends BaseRepository<UserEntity> implements IUserRepository<UserEntity> {
  constructor(db: IDatabase) {
    super(db);
  }

  protected get tableName(): string {
    return 'users';
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this._db.prepare(`SELECT *
                                   FROM ${this.tableName}
                                   WHERE email = ?`)
      .bind(email)
      .first<UserEntity>();
  }

  async create(user: UserEntity): Promise<void> {
    await this._db.prepare(`INSERT INTO ${this.tableName} (email, password, salt)
                            VALUES (?, ?, ?)`)
      .bind(user.email, user.password, user.salt)
      .run();
  }
}
