import {TransportContent} from "@/shared/dtos/transport";

export interface Transport {
  send<T extends TransportContent>(payload: T): Promise<boolean>;
}
