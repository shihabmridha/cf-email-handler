import { Expose, Transform } from "class-transformer";
import { BaseEntity } from "./base";
import { EmailClass } from "@/enums/email-class";

export class EmailRouteEntity extends BaseEntity {
  @Expose()
  userId: number = 0;

  @Expose()
  email: string = "";

  @Expose()
  destination: string = "";

  @Expose()
  @Transform(({ value }) => EmailClass[value as keyof typeof EmailClass])
  type: EmailClass = EmailClass.UNKNOWN;

  @Expose()
  enabled: boolean = true;

  @Expose()
  drop: boolean = false;

  received: number = 0;
  sent: number = 0;
}
