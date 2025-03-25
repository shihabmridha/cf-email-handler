import { TransportApiConfig, TransportContent, TransportSmtpConfig } from "@/dtos/transport";
import { BaseProviderService } from "./base";

interface ResendApiPayload {
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  text: string;
  html?: string;
  category?: string;
}

export class ResendProviderService extends BaseProviderService<ResendApiPayload> {
  constructor(smtpConfig?: TransportSmtpConfig, apiConfig?: TransportApiConfig) {
    super(smtpConfig, apiConfig);
  }

  createApiPayload(content: TransportContent): ResendApiPayload {
    return {
      from: `${content.from} <${content.from}>`,
      to: content.to,
      cc: content.cc,
      subject: content.subject,
      text: content.text,
      html: content?.html,
    };
  }
}
