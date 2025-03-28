import { IBaseRepository } from './base';
import { EmailRouteEntity } from '../../entities/email-route';
import { EmailClass } from '@/enums/email-class';

export interface IEmailRouteRepository extends IBaseRepository<EmailRouteEntity> {
  create(route: EmailRouteEntity): Promise<void>;
  update(id: number, route: EmailRouteEntity): Promise<void>;
  delete(id: number): Promise<boolean>;
  getByEmail(email: string): Promise<EmailRouteEntity[] | null>;
  incrementReceived(email: string, emailClass: EmailClass): Promise<void>;
  incrementSent(email: string, emailClass: EmailClass): Promise<void>;
}
