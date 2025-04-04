import { Expose } from 'class-transformer';
import { BaseEntity } from './base';

export class SettingsEntity extends BaseEntity {
  @Expose()
  key: string = "";

  @Expose()
  value: string = "";

  @Expose()
  description: string = "";
}
