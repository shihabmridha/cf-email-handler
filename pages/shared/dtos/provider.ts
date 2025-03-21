import { ProviderType } from '../enums/provider';

export interface BaseDto {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
}

export interface ApiConfig {
  token: string;
  host: string;
}

export interface ProviderConfigDto extends BaseDto {
  name: string;
  userId: number;
  type: ProviderType;
  domain: string;
  smtp?: SmtpConfig;
  api?: ApiConfig;
  enabled?: boolean;
}
