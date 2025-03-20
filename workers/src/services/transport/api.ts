import { TransportApiConfig } from "@/dtos/transport";
import { Transport } from "../../interfaces/transport";

export class ApiTransport implements Transport {
  private readonly _config: TransportApiConfig;
  constructor(config: TransportApiConfig) {
    this._config = config;
  }

  async send<T>(payload: T): Promise<boolean> {
    const url = this._config.host;
    const token = this._config.token;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const json = await response.json();
        console.error(JSON.stringify(json));

        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
    }

    return false;
  }
}
