import { IBaseRepository } from './base';
import { ProviderConfigEntity } from '../../entities/provider-config';

export interface IProviderConfigRepository extends IBaseRepository<ProviderConfigEntity> {
  create(provider: ProviderConfigEntity): Promise<ProviderConfigEntity>;
  update(id: number, provider: ProviderConfigEntity): Promise<ProviderConfigEntity>;
  delete(id: number): Promise<boolean>;
}
