import { IBaseRepository } from './base';
import { IncomingHistoryEntity } from '../../entities/incoming-history';

export interface IIncomingHistoryRepository extends IBaseRepository<IncomingHistoryEntity> {
  create(route: IncomingHistoryEntity): Promise<void>;
  update(id: number, route: IncomingHistoryEntity): Promise<void>;
  delete(id: number): Promise<boolean>;
  getByToEmail(email: string): Promise<IncomingHistoryEntity[] | null>;
  getByDestinationEmail(email: string): Promise<IncomingHistoryEntity[] | null>;
  getByPage(page: number): Promise<IncomingHistoryEntity[] | null>;
}
