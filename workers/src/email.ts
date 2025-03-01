import PostalMime from 'postal-mime';
import { EmailSummaryService } from './services/email-summary';
import { GeminiService } from './services/llm/gemini';

export default {
  async email(message: ForwardableEmailMessage, env: CloudflareBindings, _ctx: ExecutionContext) {
    const url = env.DISCORD_HOOK_URL;

    const rawMessage = await PostalMime.parse(message.raw);
    const emailText = rawMessage.text;

    console.log('email text', emailText);

    let summary: string | null = null;
    if (emailText) {
      const llmService = new GeminiService(env.GEMINI_KEY);
      const summarizer = new EmailSummaryService(llmService);
      summary = await summarizer.summarize(emailText);

      console.log('summary', summary);
    }

    const params = {
      username: "Robot",
      content: summary ?? `Got an email from ${message.from}.\nSubject: ${message.headers.get('subject')}.`
    };

    const discordMessageRequest = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    await Promise.allSettled([
      discordMessageRequest,
      message.forward(env.EMAIL_FORWARD_TO),
    ]);
  }
};
