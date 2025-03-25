import { TransportContent } from "@/dtos/transport";

export interface Provider<TPayload> {
  createApiPayload(content: TransportContent): TPayload;
  sendByApi(payload: TransportContent): Promise<boolean>;
  sendBySmtp(payload: TransportContent): Promise<boolean>;
}
