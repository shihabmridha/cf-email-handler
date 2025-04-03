import { TransportContent } from "./transport";

export class SendMailDto {
  providerConfigId: number = 0;
  content: TransportContent = new TransportContent();
}
