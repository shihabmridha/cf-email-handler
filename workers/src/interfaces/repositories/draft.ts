import { IBaseRepository } from './base';
import { DraftEntity } from '../../entities/draft';

export interface IDraftRepository extends IBaseRepository<DraftEntity> {
  create(user: DraftEntity): Promise<DraftEntity>;
  update(id: number, user: DraftEntity): Promise<DraftEntity>;
  delete(id: number): Promise<boolean>;
}
