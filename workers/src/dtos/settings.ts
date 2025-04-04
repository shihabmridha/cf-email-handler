import { BaseDto } from "./base";

export class SettingsDto extends BaseDto {
  key: string = "";
  value: string = "";
  description: string = "";
}
