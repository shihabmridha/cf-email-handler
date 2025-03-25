import { Expose, Transform } from "class-transformer";
import { BaseEntity } from "./base";
import { ProviderType } from "@/enums/provider";

export class ProviderConfigEntity extends BaseEntity {
  @Expose()
  name: string = '';

  @Expose()
  type: ProviderType = ProviderType.UNKNOWN;

  @Expose()
  userId: number = 0;

  @Expose()
  domain: string = '';

  @Expose()
  @Transform(({ value }) => !value ? null : JSON.stringify(value))
  smtp?: string; // Stored as JSON

  @Expose()
  @Transform(({ value }) => !value ? null : JSON.stringify(value))
  api?: string; // Stored as JSON

  @Expose()
  @Transform(({ value }) => !value ? false : value)
  enabled: boolean = false;
}
