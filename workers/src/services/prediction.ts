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
      ### Your role
      You are an expert in email classification and data extraction. You can read raw content of an email.
      You can understand the context of the email. You can classify the email confidently because you are an expert.

      ### Instructions
      You need to analyze the email content provided below and extract key information. You always return the response in following JSON format:
      {"class": "EMAIL_CLASS", "otp": "CODE_OR_URL", "summary": "BRIEF_SUMMARY_HERE"}

      Important: the response must only contain valid JSON string, nothing else.

      JSON property definition:
      - class: the type of the email (see all the email classes below)
      - otp: the OTP or verification code or login link
      - summary: a couple of sentences summary of the email's purpose

      All the email classes:
      - UNKNOWN: the email is not classified
      - OTP: the email contains an OTP or verification code (OTP code, Verification code, Login link, Verify link, etc)
      - INVOICE: the email is an invoice or payment slip (example: purchase slip, shoping invoice, etc)
      - TRANSACTIONAL: the email is a transactional email (example: bank payment, bank transfer, etc)
      - PROMOTIONAL: the email is a promotional email (example: marketing email, newsletter, offer, etc)

      ### Email content
      ${emailContent}\n

      ### Your task
      Your task is to analyze the email content, classify it, extract the OTP/Verification information if present, create short summary and
      response in the expected JSON format. Make sure to validate your response. You must not ask any question. You must response with a valid JSON.
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
