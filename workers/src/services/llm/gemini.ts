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

export class GeminiService implements LlmService{
  private readonly key: string;
  constructor(key: string) {
    this.key = key;
  }

  async ask(prompt: string): Promise<string> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.key}`, {
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

    const data = await response.json<GeminiResponse>();
    return data.candidates[0].content.parts[0].text;
  }
}
