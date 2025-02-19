export interface LlmService {
  ask(prompt: string): Promise<string>
}
