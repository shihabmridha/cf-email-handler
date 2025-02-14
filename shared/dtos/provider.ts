import { ProviderType } from "../enums/provider";
import {BaseDto} from "./base";
import {TransportSmtpConfig, TransportApiConfig} from "./transport";

export class ProviderConfigDto extends BaseDto {
  name: string = '';
  userId: number = 0;
  type: ProviderType = ProviderType.UNKNOWN;
  domain: string = '';
  smtp?: TransportSmtpConfig;
  api?: TransportApiConfig;
  enabled: boolean = true;
}
