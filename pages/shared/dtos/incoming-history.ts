import { EmailClass } from "@/enums/email-class";
import { BaseDto } from "./base";

export class IncomingHistoryDto extends BaseDto {
  fromEmail: string = "";
  toEmail: string = "";
  subject: string = "";
  destination?: string;
  emailClass: EmailClass = EmailClass.UNKNOWN;
  summary: string = "";
}
