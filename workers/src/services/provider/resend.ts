import {TransportApiConfig, TransportContent, TransportSmtpConfig} from "@/shared/dtos/transport";
import {ApiTransportPayload, BaseProviderService} from "./base";

export class ResendProviderService extends BaseProviderService {
  constructor(smtpConfig?: TransportSmtpConfig, apiConfig?: TransportApiConfig) {
    super(smtpConfig, apiConfig);
  }

  createApiPayload(content: TransportContent): ApiTransportPayload {
    return {
      from: {email: content.from, name: content.fromName},
      to: content.to.map(e => ({email: e})),
      cc: content.cc.map(e => ({email: e})),
      subject: content.subject,
      text: content.text,
      html: content.html,
    };
  }
}
