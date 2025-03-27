import { IBaseRepository } from './base';
import { UserEntity } from '../../entities/user';

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<void>;
}
