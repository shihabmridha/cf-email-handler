import { Expose, Transform } from "class-transformer";
import { BaseEntity } from "./base";
import { EmailType } from "@/shared/enums/email-type";

export class EmailRouteEntity extends BaseEntity {
  @Expose()
  userId: number = 0;

  @Expose()
  email: string = "";

  @Expose()
  destination: string = "";

  @Expose()
  @Transform(({ value }) => EmailType[value as keyof typeof EmailType])
  type: EmailType = EmailType.UNKNOWN;

  @Expose()
  enabled: boolean = true;
}
