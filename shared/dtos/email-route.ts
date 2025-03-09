import { EmailType } from "../enums/email-type";
import { BaseDto } from "./base";

export class EmailRouteDto extends BaseDto {
  userId: number = 0;
  email: string = '';
  destination: string = '';
  type: EmailType = EmailType.UNKNOWN;
  enabled: boolean = true;
}
