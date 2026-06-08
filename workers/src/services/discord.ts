import { Configuration } from "../config";
import { EmailClass } from "@/enums/email-class";

export class DiscordService {
  private readonly _config: Configuration;

  constructor(config: Configuration) {
    this._config = config;
  }

  async sendMessage(
    from: string,
    subject: string,
    summary: string,
    emailClass?: string,
    otp?: string
  ): Promise<void> {
    let content = `From: ${from}.\nSubject: ${subject}.\nSummary: ${summary ?? 'Could not generate summary.'}`;

    if (emailClass === EmailClass.OTP && otp) {
      content += `\nOTP: ${otp}`;
    }

    const message = {
      username: "Robot",
      content,
    };

    const response = await fetch(this._config.discordHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed with status ${response.status}`);
    }
  }
}
