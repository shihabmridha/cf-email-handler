import { IBaseRepository } from './base';
import { ProviderConfigEntity } from '../../entities/provider-config';

export interface IProviderConfigRepository<T> extends IBaseRepository<T> {
  getById(id: number): Promise<ProviderConfigEntity | null>;
  create(provider: ProviderConfigEntity): Promise<ProviderConfigEntity>;
  update(id: number, provider: ProviderConfigEntity): Promise<ProviderConfigEntity>;
  delete(id: number): Promise<boolean>;
}
