import { ProviderFactory } from "./provider/factory";
import { ProviderConfigService } from "./provider/config";
import { SendMailDto } from "@/dtos/mail";

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

    let sent = false;
    if (providerConfig.smtp) {
      sent = await provider.sendBySmtp(payload.content);
    }

    if (providerConfig.api) {
      sent = await provider.sendByApi(payload.content);
    }

    return sent;
  }
}
