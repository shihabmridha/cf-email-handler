import {BaseEntity} from "./base";
import {Expose, Transform} from "class-transformer";

export class DraftEntity extends BaseEntity {
  @Expose()
  userId: number = 0;

  @Expose()
  @Transform(({value}) => !value ? null : value)
  sender?: string;

  @Expose()
  @Transform(({value}) => !value ? null : JSON.stringify(value))
  recipients?: string; // Stored as JSON array

  @Expose()
  @Transform(({value}) => !value ? null : value)
  cc?: string;

  @Expose()
  subject: string = '';

  @Expose()
  @Transform(({value}) => !value ? null : value)
  body?: string;
}

