import {BaseEntity} from "./base";
import {Expose, Transform} from "class-transformer";

export class ProviderEntity extends BaseEntity {
  @Expose()
  userId: number = 0;

  @Expose()
  @Transform(({value}) => !value ? null : JSON.stringify(value))
  smtp?: string; // Stored as JSON

  @Expose()
  @Transform(({value}) => !value ? null : JSON.stringify(value))
  api?: string; // Stored as JSON
}
