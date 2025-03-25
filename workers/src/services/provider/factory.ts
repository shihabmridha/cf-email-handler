import { ProviderType } from "@/enums/provider";
import { TransportApiConfig, TransportSmtpConfig } from "@/dtos/transport";
import { Provider } from "../../interfaces/provider";
import { ResendProviderService } from "./resend";
import { MailTrapProviderService } from "./mailtrap";

export class ProviderFactory {
  static getProvider(provider: ProviderType, smtpConfig?: TransportSmtpConfig, apiConfig?: TransportApiConfig): Provider<unknown> {
    switch (provider) {
      case ProviderType.RESEND:
        return new ResendProviderService(smtpConfig, apiConfig);
      case ProviderType.MAILTRAP:
        return new MailTrapProviderService(smtpConfig, apiConfig);
      default:
        throw new Error(`Provider ${provider} not found`);
    }
  }
}
