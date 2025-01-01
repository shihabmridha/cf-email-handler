import {BaseDto} from "./base";
import {ProviderApiCredentials, ProviderSmtpCredentials} from "../interface/provider";

export class ProviderSmtpDto implements ProviderSmtpCredentials{
  host: string = '';
  port: number = 587;
  secure: boolean = false;
  username: string;
  password: string;
}

export class ProviderApiDto implements ProviderApiCredentials{
  token: string = '';
  host: string = '';
}

export class ProviderDto extends BaseDto {
  userId: number = 0;
  smtp?: ProviderSmtpDto;
  api?: ProviderApiDto;
}
