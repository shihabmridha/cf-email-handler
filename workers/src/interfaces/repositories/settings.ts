import { SettingsEntity } from '../../entities/settings';
import { IBaseRepository } from './base';

export interface ISettingsRepository extends IBaseRepository<SettingsEntity> {
  getByKey(key: string): Promise<SettingsEntity | null>;
  create(data: SettingsEntity): Promise<void>;
  update(key: string, data: SettingsEntity): Promise<void>;
  delete(key: string): Promise<boolean>;
}
