import PostalMime from 'postal-mime';
import { EmailType } from '@/shared/enums/email-type';
import { Container } from '../container';
import { cleanHtml } from '../lib/utils';

export async function parseEmail(message: ForwardableEmailMessage) {
  const rawMessage = await PostalMime.parse(message.raw);
  const content = rawMessage.html
    ? await cleanHtml(rawMessage.html)
    : rawMessage.text ?? '';

  return {
    content,
    from: message.from,
    to: rawMessage.to?.[0]?.address ?? '',
    subject: message.headers.get('subject') ?? '',
    forward: message.forward.bind(message)
  };
}

export async function processEmail(
  parsedEmail: ReturnType<typeof parseEmail> extends Promise<infer T> ? T : never,
  container: Container
) {
  const { content, from, subject, forward } = parsedEmail;
  let { to } = parsedEmail;

  const config = container.getConfig();

  if (to === '') to = config.emailForwardTo;

  const predict = container.getPredictionService();
  const emailData = await predict.extractEmailTypeAndData(content);

  if (!emailData.class) {
    return;
  }

  const emailRouteService = container.getEmailRouteService();
  const discordService = container.getDiscordService();

  const emailType = EmailType[emailData.class as keyof typeof EmailType];
  const destination = await emailRouteService.getDestination(to, emailType);

  await Promise.allSettled([
    discordService.sendMessage(from, subject, emailData.summary),
    forward(destination),
  ]);
}
