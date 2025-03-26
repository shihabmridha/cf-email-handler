import { EmailClass } from "@/enums/email-class";
import { LlmService } from "../interfaces/llm";

export class VerificationData {
  class: string = '';
  otp: string = '';
  summary: string = '';
}

export class PredictionService {
  private readonly llm: LlmService;
  private readonly maxRetries = 3;

  constructor(llm: LlmService) {
    this.llm = llm;
  }

  private cleanupLLMResponse(response: string): string {
    return response.replace(/^```json\n/, '').replace(/\n```$/, '');
  }

  private validateResponse(json: VerificationData): boolean {
    if (!json || typeof json !== 'object') return false;

    switch (json.class) {
      case EmailClass.INVOICE:
        return Boolean(json.summary && /\d+(\.\d+)?/.test(json.summary));

      case EmailClass.OTP: {
        const hasValidClass = json.class === EmailClass.OTP;
        const hasValidOtp = Boolean(json.otp && json.otp.length > 0);
        const hasValidSummary = Boolean(json.summary && (
          json.summary.toLowerCase().includes(json.otp.toLowerCase())
        ));

        return hasValidClass && hasValidOtp && hasValidSummary;
      }

      case EmailClass.PROMOTIONAL:
        return Boolean(json.summary && json.summary.length > 0);

      case EmailClass.UNKNOWN: {
        const hasOtp = Boolean(json.otp && (json.otp.length > 0 || !json.otp.includes('EMPTY')));
        const hasSummary = Boolean(json.summary && json.summary.length > 0);
        return !hasOtp && hasSummary;
      }

      default:
        return false;
    }
  }

  async extractEmailClassAndData(emailContent: string): Promise<VerificationData> {
    const prompt = `
      Analyze the following email content and extract key information:
      1. Create a one-sentence summary of the email's purpose.
      2. If the email contains an OTP or verification code, extract ONLY the numeric or alphanumeric code and set it to OTP property and set class to OTP and summary must include the OTP.
      3. If the email contains a verification or login link, extract ONLY the complete URL and set it to OTP property and set class to OTP and summary must include the URL.
      4. If the email is invoice or payment slip set class to "INVOICE" and summary must include the amount.
      5. If the email is promotional/marketing set class to "PROMOTIONAL".

      Format your response exactly as follows, with NO additional text:
      {"class": "OTP/INVOICE/PROMOTIONAL/UNKNOWN", "otp": "CODE_HERE_OR_EMPTY/URL_HERE_OR_EMPTY", "summary": "BRIEF_SUMMARY_HERE"}

      Email content:
      ${emailContent}\n
    `;

    let lastError: Error | null = null;
    let lastValidResponse: VerificationData | null = null;
    const result = new VerificationData();

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const response = await this.llm.ask(prompt);
      const cleanedResponse = this.cleanupLLMResponse(response);
      console.log(`Prediction response (attempt ${attempt + 1}):`, cleanedResponse);

      try {
        const json = JSON.parse(cleanedResponse);

        if (this.validateResponse(json)) {
          result.class = json.class || EmailClass.UNKNOWN;
          result.otp = json.otp || '';
          result.summary = json.summary || '';
          return result;
        }

        lastValidResponse = new VerificationData();
        lastValidResponse.class = json.class || EmailClass.UNKNOWN;
        lastValidResponse.otp = json.otp || '';
        lastValidResponse.summary = json.summary || '';

        console.error('Response validation failed');
        lastError = new Error('Response validation failed');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Attempt ${attempt + 1} failed:`, lastError);
      }

      if (attempt < this.maxRetries) {
        console.log('Retrying due to invalid response format or missing required data...');
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }

    console.error('All attempts failed. Returning last received response.');
    if (lastValidResponse) {
      return lastValidResponse;
    }

    result.class = EmailClass.UNKNOWN;
    result.summary = 'Failed to analyze email content';
    return result;
  }
}
