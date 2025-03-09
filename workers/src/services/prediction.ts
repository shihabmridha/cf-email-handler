import { LlmService } from "../interfaces/llm";

export class VerificationData {
  class?: string | null;
  otp?: string | null;
  summary?: string | null;
}

export class PredictionService {
  private readonly llm: LlmService;
  constructor(llm: LlmService) {
    this.llm = llm;
  }

  async extractEmailTypeAndData(emailContent: string): Promise<VerificationData> {
    const prompt = `
      Analyze the following email content and extract key information:
      1. If the email contains an OTP/verification code, extract ONLY the numeric or alphanumeric code.
      2. If the email contains a verification or login link, extract ONLY the complete URL.
      3. If the email is invoice/payment slip, answer "INVOICE".
      4. If the email is promotional/marketing, answer "PROMOTIONAL".
      5. Provide a one-sentence summary of the email's purpose.
      Format your response exactly as follows, with NO additional text:
      {"class": "OTP/INVOICE/PROMOTIONAL", "otp": "CODE_HERE_OR_EMPTY/URL_HERE_OR_EMPTY", "summary": "BRIEF_SUMMARY_HERE"}

      Email content:
      ${emailContent}\n
    `;

    const response = await this.llm.ask(prompt);
    const result = new VerificationData();
    try {
      const json = JSON.parse(response);
      result.class = json.class || null;
      result.otp = json.otp || null;
      result.summary = json.summary || null;
    } catch (_err) {
      console.error('Error parsing JSON. Data:', response);
    }

    return result;
  }

  async isInvoice(emailContent: string): Promise<boolean> {
    const prompt = `
      Analyze the following email content and check if the email is invoice/payment slip.
      You only answer with true or false.
      Here is the email content: "${emailContent}"\n
    `;

    const response = await this.llm.ask(prompt);
    return response.toLowerCase().includes('true');
  }

  async isPromotion(emailContent: string): Promise<boolean> {
    const prompt = `
      Analyze the following email content and check if the email is promotional/marketing related.
      You only answer with true or false.
      Here is the email content: "${emailContent}"\n
    `;

    const response = await this.llm.ask(prompt);
    return response.toLowerCase().includes('true');
  }
}
