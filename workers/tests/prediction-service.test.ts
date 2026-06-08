import { expect, test, describe, mock, beforeEach } from "bun:test";
import { PredictionService, VerificationData } from "../src/services/prediction";
import { EmailClass } from "@/enums/email-class";

const mockGenerateText = mock(() => Promise.resolve({
  output: {
    class: EmailClass.OTP,
    otp: '123456',
    summary: 'Your OTP code is 123456',
  },
}));

mock.module('ai', () => ({
  generateText: mockGenerateText,
  Output: {
    object: ({ schema }: { schema: unknown }) => ({ schema }),
  },
  NoObjectGeneratedError: {
    isInstance: () => false,
  },
}));

describe("Prediction Service", () => {
  beforeEach(() => {
    mockGenerateText.mockClear();
  });

  test("Should extract OTP code and summary", async () => {
    mockGenerateText.mockImplementation(() => Promise.resolve({
      output: {
        class: EmailClass.OTP,
        otp: '123456',
        summary: 'Your OTP code is 123456',
      },
    }));

    const service = new PredictionService({} as never);
    const res = await service.extractEmailClassAndData('Your code is 123456');

    expect(res).toBeInstanceOf(VerificationData);
    expect(res.class).toBe(EmailClass.OTP);
    expect(res.otp).toBe('123456');
    expect(res.summary).toContain('123456');
  });

  test("Should identify invoice email and extract summary", async () => {
    mockGenerateText.mockImplementation(() => Promise.resolve({
      output: {
        class: EmailClass.INVOICE,
        otp: '',
        summary: 'Invoice total is $229.97',
      },
    }));

    const service = new PredictionService({} as never);
    const res = await service.extractEmailClassAndData('Invoice total $229.97');

    expect(res.class).toBe(EmailClass.INVOICE);
    expect(res.summary).toContain('$229.97');
  });

  test("Should retry when validation fails and return last valid response", async () => {
    mockGenerateText
      .mockImplementationOnce(() => Promise.resolve({
        output: {
          class: EmailClass.INVOICE,
          otp: '',
          summary: 'Invoice without amount',
        },
      }))
      .mockImplementationOnce(() => Promise.resolve({
        output: {
          class: EmailClass.INVOICE,
          otp: '',
          summary: 'Invoice total $99.00',
        },
      }));

    const service = new PredictionService({} as never);
    const res = await service.extractEmailClassAndData('Invoice content');

    expect(mockGenerateText).toHaveBeenCalledTimes(2);
    expect(res.class).toBe(EmailClass.INVOICE);
    expect(res.summary).toContain('$99.00');
  });
});

const runIntegration = process.env.DEEPSEEK_API_KEY ? describe : describe.skip;

runIntegration("Prediction Service Integration", () => {
  test("Should classify email with live DeepSeek API", async () => {
    const { LlmFactory } = await import('../src/services/llm/factory');
    const { Configuration } = await import('../src/config');

    const config = new Configuration({
      DISCORD_HOOK_URL: '',
      EMAIL_FORWARD_TO: '',
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY!,
      LLM_PROVIDER: 'deepseek',
      LLM_MODEL: process.env.LLM_MODEL || 'deepseek-v4-flash',
      JWT_SECRET: '',
      ADMIN_EMAIL: '',
      ADMIN_PASSWORD: '',
    } as unknown as Env);

    const service = new PredictionService(LlmFactory.createModel(config));
    const res = await service.extractEmailClassAndData('Your one-time password is 654321');

    expect(res.class).toBe(EmailClass.OTP);
    expect(res.otp).toContain('654321');
  });
});
