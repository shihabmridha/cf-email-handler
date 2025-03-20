import { Configuration } from "../config";

export class DiscordService {
  private readonly _config: Configuration;

  constructor(config: Configuration) {
    this._config = config;
  }

  async sendMessage(from: string, subject: string, summary: string): Promise<void> {
    const message = {
      username: "Robot",
      content: `From: ${from}.\nSubject: ${subject}.\nSummary: ${summary ?? 'Could not generate summary.'}`,
    };

    await fetch(this._config.discordHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
  }
}
