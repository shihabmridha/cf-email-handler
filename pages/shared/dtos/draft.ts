import {BaseDto} from "./base";

export class DraftDto extends BaseDto {
  userId: number = 0;
  sender?: string;
  recipients?: string[];
  cc?: string;
  subject: string = '';
  body?: string;
}
