import { IBaseRepository } from './base';
import { EmailType } from '@/enums/email-type';
import { EmailRouteEntity } from '../../entities/email-route';

export interface IEmailRouteRepository<T> extends IBaseRepository<T> {
  getByEmailAndType(email: string, type: EmailType): Promise<EmailRouteEntity | null>;
  create(route: EmailRouteEntity): Promise<void>;
  update(id: number, route: EmailRouteEntity): Promise<void>;
  delete(id: number): Promise<boolean>;
}
