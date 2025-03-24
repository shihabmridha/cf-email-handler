import { TransportApiConfig, TransportContent, TransportSmtpConfig } from "@/dtos/transport";
import { BaseProviderService } from "./base";

interface MailTrapApiPayload {
  from: { email: string; name: string };
  to: { email: string }[];
  cc: { email: string }[];
  subject: string;
  text: string;
  html?: string;
  category?: string;
}

export class MailTrapProviderService extends BaseProviderService<MailTrapApiPayload> {
  constructor(smtpConfig?: TransportSmtpConfig, apiConfig?: TransportApiConfig) {
    super(smtpConfig, apiConfig);
  }

  createApiPayload(content: TransportContent): MailTrapApiPayload {
    return {
      from: { email: content.from, name: content.fromName },
      to: content.to.map(e => ({ email: e })),
      cc: content.cc?.map(e => ({ email: e })),
      subject: content.subject,
      text: content.text,
      html: content?.html,
      category: "cf-email-personal", // TODO: handle category better
    };
  }
}
