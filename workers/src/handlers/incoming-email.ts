import PostalMime from 'postal-mime';
import { EmailClass } from '@/enums/email-class';
import { Container } from '../container';
import { cleanHtml } from '../lib/utils';

export async function parseEmail(message: ForwardableEmailMessage) {
  const rawMessage = await PostalMime.parse(message.raw);
  const content = rawMessage.html
    ? await cleanHtml(rawMessage.html)
    : rawMessage.text ?? '';

  console.log('Raw to: ', JSON.stringify(rawMessage.to, null, 2));
  console.log('Raw cc: ', JSON.stringify(rawMessage.cc, null, 2));

  return {
    content,
    from: message.from,
    to: rawMessage.to?.[0]?.address ?? '',
    subject: message.headers.get('subject') ?? '',
    forward: message.forward.bind(message),
    drop: () => {
      console.log('Dropping email from', message.from, 'to', message.to);
      return Promise.resolve();
    },
  };
}

export async function processEmail(
  parsedEmail: ReturnType<typeof parseEmail> extends Promise<infer T> ? T : never,
  container: Container
) {
  const { content, from, subject, forward, drop } = parsedEmail;
  let { to } = parsedEmail;

  if (to === '') to = 'Unknown';

  console.log(`Received email from ${from} to ${to} with subject ${subject}`);

  const predict = container.getPredictionService();
  const emailData = await predict.extractEmailClassAndData(content);

  if (!emailData.class) {
    return;
  }

  const emailType = EmailClass[emailData.class as keyof typeof EmailClass];

  const emailRouteService = container.getEmailRouteService();
  const discordService = container.getDiscordService();
  const incomingHistoryService = container.getIncomingHistoryService();

  const actions = [
    discordService.sendMessage(from, subject, emailData.summary),
    emailRouteService.incrementReceived(to, emailType),
  ];

  const destination = await emailRouteService.getDestination(to, emailType);
  console.log('Destination:', destination);

  if (destination) {
    actions.push(forward(destination));
  } else {
    actions.push(drop());
  }

  actions.push(incomingHistoryService.create({
    id: 0,
    fromEmail: from,
    toEmail: to,
    subject,
    destination: destination || undefined,
    emailClass: emailType,
    summary: emailData.summary,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  await Promise.allSettled(actions);
}
