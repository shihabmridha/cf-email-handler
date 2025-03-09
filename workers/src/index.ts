import PostalMime from 'postal-mime';
import { cleanHtml } from './lib/utils';
import httpHandler from './api';
import { EmailType } from '@/shared/enums/email-type';
import { Container } from './container';

// Email handler
async function email(message: ForwardableEmailMessage, env: CloudflareBindings, _ctx: ExecutionContext) {
  const rawMessage = await PostalMime.parse(message.raw);
  const content = rawMessage.html
    ? await cleanHtml(rawMessage.html)
    : rawMessage.text ?? '';

  if (!rawMessage.to) return;

  const container = new Container(env);
  const predict = container.getPredictionService();
  const emailData = await predict.extractEmailTypeAndData(content);
  if (!emailData.class) {
    return;
  }

  const config = container.getConfig();
  const emailRouteService = container.getEmailRouteService();
  const discordService = container.getDiscordService();

  const emailType = EmailType[emailData.class as keyof typeof EmailType];
  const to = rawMessage.to[0]?.address ?? config.emailForwardTo;
  const destination = await emailRouteService.getDestination(to, emailType);

  await Promise.allSettled([
    discordService.sendMessage(message.from, message.headers.get('subject') ?? '', content),
    message.forward(destination),
  ]);
}

// Export the http and email handler for Cloudflare Workers
export default {
  ...httpHandler,
  email,
};
