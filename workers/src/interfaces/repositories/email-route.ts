import { IBaseRepository } from './base';
import { EmailClass } from '@/enums/email-class';
import { EmailRouteEntity } from '../../entities/email-route';

export interface IEmailRouteRepository<T> extends IBaseRepository<T> {
  create(route: EmailRouteEntity): Promise<void>;
  update(id: number, route: EmailRouteEntity): Promise<void>;
  delete(id: number): Promise<boolean>;
  getByEmailAndType(email: string, type: EmailClass): Promise<T | null>;
  incrementReceived(email: string): Promise<void>;
  incrementSent(email: string): Promise<void>;
}
