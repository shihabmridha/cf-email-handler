import { LlmService } from "../interfaces/llm";

export class EmailSummaryAiService {
  private readonly llm: LlmService;
  constructor(llm: LlmService) {
    this.llm = llm;
  }

  summarize(emailContent: string): Promise<string> {
    const prompt = `
      ${emailContent}\n
      Summarize the email content above in one short sentence
      and must include the important part like otp code, login link, verify link etc.
    `;

    return this.llm.ask(prompt);
  }
}
