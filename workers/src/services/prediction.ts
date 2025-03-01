import { LlmService } from "../interfaces/llm";

export class PredictionService {
  private readonly llm: LlmService;
  constructor(llm: LlmService) {
    this.llm = llm;
  }

  async isOtp(emailContent: string): Promise<boolean> {
    const prompt = `
      You are an smart agent who can understand if an email content is promotional/marketing related or OTP.
      You only answer with true or false.
      Here is the email content: "${emailContent}"\n
      Is the above email content promotional?
    `;

    const response = await this.llm.ask(prompt);
    return response.toLowerCase().includes('true');
  }
}
