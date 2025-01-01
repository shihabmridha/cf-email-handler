export interface ProviderSmtpCredentials {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
}

export interface ProviderApiCredentials {
  token: string;
  host: string;
}
