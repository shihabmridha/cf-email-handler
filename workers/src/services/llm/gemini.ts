import { Configuration } from "../../config";
import { LlmService } from "../../interfaces/llm";

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string
      }[]
    }
  }[]
}

export class GeminiService implements LlmService {
  private readonly url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private readonly key: string;
  private readonly maxRetries = 3;
  private readonly delayInMs = 500;

  constructor(config: Configuration) {
    this.key = config.geminiKey;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ask(prompt: string): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.url}?key=${this.key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json<GeminiResponse>();
        return data.candidates[0].content.parts[0].text;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Attempt ${attempt + 1} failed:`, lastError);

        if (attempt < this.maxRetries) {
          console.log(`Retrying in ${this.delayInMs}ms...`);
          await this.delay(this.delayInMs);
        }
      }
    }

    throw new Error(`Failed after ${this.maxRetries + 1} attempts. Last error: ${lastError?.message}`);
  }
}
