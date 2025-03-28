import { Expose, Transform } from 'class-transformer';
import { BaseEntity } from './base';
import { EmailClass } from '@/enums/email-class';

export class IncomingHistoryEntity extends BaseEntity {
  @Expose()
  fromEmail: string = "";

  @Expose()
  toEmail: string = "";

  @Expose()
  subject: string = "";

  @Expose()
  destination?: string; // null if email was dropped

  @Expose()
  @Transform(({ value }) => EmailClass[value as keyof typeof EmailClass])
  emailClass: EmailClass = EmailClass.UNKNOWN;

  @Expose()
  summary: string = "";
}
