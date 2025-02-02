export interface EmailProvider {
  sendByApi(payload: object): Promise<boolean>;
  sendBySmtp(payload: object): Promise<boolean>;
}
