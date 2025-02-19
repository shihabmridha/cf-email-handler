import { TransportContent } from "@/shared/dtos/transport";
import {ApiTransportPayload} from "../services/provider/base";

export interface Provider {
  createApiPayload(content: TransportContent): ApiTransportPayload;
  sendByApi(payload: TransportContent): Promise<boolean>;
  sendBySmtp(payload: TransportContent): Promise<boolean>;
}
