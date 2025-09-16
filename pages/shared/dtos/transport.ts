export class TransportSmtpConfig {
  host: string = '';
  port: number = 587;
  secure: boolean = false;
  username: string = '';
  password: string = '';
}

export class TransportApiConfig {
  token: string = '';
  host: string = '';
}

export class TransportContent{
  from: string = '';
  fromName: string = '';
  to: string[] = [];
  cc: string[] = [];
  subject: string = '';
  text: string = '';
  html: string = '';
}
