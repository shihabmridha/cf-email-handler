import { IBaseRepository } from './base';
import { UserEntity } from '../../entities/user';

export interface IUserRepository<T> extends IBaseRepository<T> {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<void>;
}
