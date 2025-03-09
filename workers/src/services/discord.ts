import { Configuration } from "../config";
import { PredictionService } from "./prediction";

export class DiscordService {
  private readonly _config: Configuration;
  private readonly _predictionService: PredictionService;

  constructor(config: Configuration, predictionService: PredictionService) {
    this._config = config;
    this._predictionService = predictionService;
  }

  async sendMessage(from: string, subject: string, emailContent: string): Promise<void> {
    if (!emailContent) {
      return;
    }

    const summary = await this._predictionService.extractEmailTypeAndData(emailContent);;

    const params = {
      username: "Robot",
      content: summary ?? `Got an email from ${from}.\nSubject: ${subject}.`
    };

    await fetch(this._config.discordHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
  }
}
