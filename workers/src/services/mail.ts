import { ProviderFactory } from "./provider/factory";
import { ProviderConfigService } from "./provider/config";
import { SendMailDto } from "@/shared/dtos/mail";

export class MailService {
  private readonly _providerConfigService: ProviderConfigService;

  constructor(providerConfigService: ProviderConfigService) {
    this._providerConfigService = providerConfigService;
  }

  async send(payload: SendMailDto): Promise<boolean> {
    const providerConfig = await this._providerConfigService.getById(payload.providerConfigId);
    if (!providerConfig) {
      throw new Error(`Provider config ${payload.providerConfigId} not found`);
    }

    const provider = ProviderFactory.getProvider(providerConfig.type, providerConfig.smtp, providerConfig.api);
    if (providerConfig.smtp) {
      return provider.sendBySmtp(payload.content);
    }

    if (providerConfig.api) {
      return provider.sendByApi(payload.content);
    }

    return false;
  }
}
