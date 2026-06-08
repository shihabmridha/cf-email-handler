import { generateText, Output, NoObjectGeneratedError } from 'ai';
import type { DeepSeekLanguageModelOptions } from '@ai-sdk/deepseek';
import type { LanguageModel } from 'ai';
import { z } from 'zod';
import { EmailClass } from '@/enums/email-class';

export class VerificationData {
  class: string = '';
  otp: string = '';
  summary: string = '';
}

const verificationSchema = z.object({
  class: z.nativeEnum(EmailClass),
  otp: z.string().describe('OTP code or verification URL, or empty string'),
  summary: z.string().describe('One-sentence summary of the email purpose'),
});

export class PredictionService {
  private readonly _model: LanguageModel;
  private readonly maxRetries = 3;

  constructor(model: LanguageModel) {
    this._model = model;
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

  private buildPrompt(emailContent: string): string {
    return `
      Analyze the following email content and extract key information:
      1. Create a one-sentence summary of the email's purpose.
      2. If the email contains an OTP or verification code, extract ONLY the numeric or alphanumeric code and set it to OTP property and set class to OTP and summary must include the OTP.
      3. If the email contains a verification or login link, extract ONLY the complete URL and set it to OTP property and set class to OTP and summary must include the URL.
      4. If the email is invoice or payment slip set class to "INVOICE" and summary must include the amount.
      5. If the email is promotional/marketing set class to "PROMOTIONAL".

      Email content:
      ${emailContent}
    `;
  }

  private toVerificationData(output: z.infer<typeof verificationSchema>): VerificationData {
    const result = new VerificationData();
    result.class = output.class || EmailClass.UNKNOWN;
    result.otp = output.otp || '';
    result.summary = output.summary || '';
    return result;
  }

  async extractEmailClassAndData(emailContent: string): Promise<VerificationData> {
    let lastValidResponse: VerificationData | null = null;
    const result = new VerificationData();

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const { output } = await generateText({
          model: this._model,
          output: Output.object({ schema: verificationSchema }),
          providerOptions: {
            deepseek: {
              thinking: { type: 'disabled' },
            } satisfies DeepSeekLanguageModelOptions,
          },
          prompt: this.buildPrompt(emailContent),
        });

        if (!output) {
          throw new Error('No structured output returned');
        }

        const json = this.toVerificationData(output);
        console.log(`Prediction response (attempt ${attempt + 1}):`, JSON.stringify(json));

        if (this.validateResponse(json)) {
          return json;
        }

        lastValidResponse = json;
        console.error('Response validation failed');
      } catch (error) {
        if (NoObjectGeneratedError.isInstance(error)) {
          console.error(`Attempt ${attempt + 1} failed: NoObjectGeneratedError`, error.text);
        } else {
          const lastError = error instanceof Error ? error : new Error(String(error));
          console.error(`Attempt ${attempt + 1} failed:`, lastError);
        }
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
