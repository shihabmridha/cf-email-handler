import { BaseDto } from "./base";
import { EmailClass } from "@/enums/email-class";

export class EmailRouteDto extends BaseDto {
  userId: number = 0;
  email: string = "";
  destination: string = "";
  type: EmailClass = EmailClass.UNKNOWN;
  enabled: boolean = true;
  drop: boolean = false;
  received: number = 0;
  sent: number = 0;
}
