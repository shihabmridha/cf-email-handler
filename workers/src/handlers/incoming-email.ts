import PostalMime from 'postal-mime';
import { EmailClass } from '@/enums/email-class';
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
    // @ts-expect-error - to ignore the lint error
    subject: message.headers.get('subject') ?? '',
    forward: message.forward.bind(message),
    drop: () => {
      console.log('Dropping email from', message.from, 'to', message.to);
    },
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

  console.log(`Received email from ${from} to ${to} with subject ${subject}`);

  const predict = container.getPredictionService();
  const emailData = await predict.extractEmailClassAndData(content);
  console.log('Email data:', JSON.stringify(emailData, null, 2));

  if (!emailData.class) {
    return;
  }

  const emailRouteService = container.getEmailRouteService();
  const discordService = container.getDiscordService();

  const emailType = EmailClass[emailData.class as keyof typeof EmailClass];
  console.log('Email type:', emailType);

  const destination = await emailRouteService.getDestination(to, emailType);
  console.log('Destination:', destination);

  await Promise.allSettled([
    discordService.sendMessage(from, subject, emailData.summary),
    forward(destination),
  ]);
}
