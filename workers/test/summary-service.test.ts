import { expect, test, describe } from "bun:test";

// @ts-expect-error Bypass error
import config from '../wrangler.toml';
import { WranglerConfig } from "../src/interfaces/wrangler-config";
const wranglerConfig = config as WranglerConfig;
const key = wranglerConfig.vars.GEMINI_KEY;
import { EmailSummaryAiService } from "../src/services/summarize";
import { GeminiService } from "../src/services/genai/gemini";

describe("Email Summary Service", () => {
  test("summary should contains OTP code", async () => {
    const llm = new GeminiService(key);
    const service = new EmailSummaryAiService(llm);
    const res = await service.summarize("This is the OTP code: 123456. Please login with this code.");
    expect(res).toBeDefined();
    expect(res).toBeString();
    expect(res).toContain("123456");
  });
});
