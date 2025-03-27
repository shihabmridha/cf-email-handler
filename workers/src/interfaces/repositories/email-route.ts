import { IBaseRepository } from './base';
import { EmailRouteEntity } from '../../entities/email-route';

export interface IEmailRouteRepository extends IBaseRepository<EmailRouteEntity> {
  create(route: EmailRouteEntity): Promise<void>;
  update(id: number, route: EmailRouteEntity): Promise<void>;
  delete(id: number): Promise<boolean>;
  getByEmail(email: string): Promise<EmailRouteEntity[] | null>;
  incrementReceived(email: string): Promise<void>;
  incrementSent(email: string): Promise<void>;
}
