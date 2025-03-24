import { TransportApiConfig, TransportSmtpConfig, TransportContent } from "@/dtos/transport";
import { Provider } from "../../interfaces/provider";
import { SmtpTransport } from "../transport/smtp";
import { ApiTransport } from "../transport/api";

export abstract class BaseProviderService<TPayload> implements Provider<TPayload> {
  private readonly _smtpTransport?: SmtpTransport;
  private readonly _apiTransport?: ApiTransport;

  protected constructor(smtpConfig?: TransportSmtpConfig, apiConfig?: TransportApiConfig) {
    if (!smtpConfig && !apiConfig)
      throw new Error("Empty provider config");

    if (smtpConfig)
      this._smtpTransport = new SmtpTransport(smtpConfig);

    if (apiConfig)
      this._apiTransport = new ApiTransport(apiConfig);
  }

  abstract createApiPayload(content: TransportContent): TPayload;

  async sendByApi(content: TransportContent): Promise<boolean> {
    if (!this._apiTransport)
      throw new Error("Could not initialize api transport");

    const payload = this.createApiPayload(content);
    return this._apiTransport.send(payload);
  }

  async sendBySmtp(payload: TransportContent): Promise<boolean> {
    if (!this._smtpTransport)
      throw new Error("Could not instantiate smtp transport");

    return this._smtpTransport.send(payload);
  }
}
