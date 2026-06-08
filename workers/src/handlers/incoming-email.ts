import PostalMime from 'postal-mime';
import { EmailClass } from '@/enums/email-class';
import { SettingKeys } from '@/enums/settings-key';
import { Container } from '../container';
import { cleanHtml } from '../lib/utils';

const VALID_EMAIL_CLASSES = Object.values(EmailClass);

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
    forward: message.forward.bind(message),
    drop: () => {
      console.log('Dropping email from', message.from, 'to', message.to);
      return Promise.resolve();
    },
  };
}

async function resolveToEmail(to: string, container: Container): Promise<string> {
  if (to !== '') {
    return to;
  }

  const settingsService = container.getSettingsService();
  const forwardSetting = await settingsService.getByKey(SettingKeys.EMAIL_FORWARD_TO);

  if (forwardSetting?.value) {
    return forwardSetting.value;
  }

  return container.getConfig().emailForwardTo;
}

export async function processEmail(
  parsedEmail: ReturnType<typeof parseEmail> extends Promise<infer T> ? T : never,
  container: Container
) {
  const { content, from, subject, forward, drop } = parsedEmail;
  const to = await resolveToEmail(parsedEmail.to, container);

  console.log(`Received email from ${from} to ${to} with subject ${subject}`);

  const predict = container.getPredictionService();
  const incomingHistoryService = container.getIncomingHistoryService();
  const discordService = container.getDiscordService();

  let emailData: { class?: string; summary?: string; otp?: string };
  try {
    emailData = await predict.extractEmailClassAndData(content);
    console.log('Email data:', JSON.stringify(emailData, null, 2));
  } catch (error) {
    console.error('Failed to classify email:', error);
    emailData = { class: undefined, summary: undefined, otp: undefined };
  }

  let emailType: EmailClass;
  if (!emailData.class || !VALID_EMAIL_CLASSES.includes(emailData.class as EmailClass)) {
    console.warn(`Invalid or missing email class: "${emailData.class}", defaulting to UNKNOWN`);
    emailType = EmailClass.UNKNOWN;
  } else {
    emailType = emailData.class as EmailClass;
  }
  console.log('Email type:', emailType);

  const emailRouteService = container.getEmailRouteService();

  const { destination, matchedRoute } = await emailRouteService.getDestination(to, emailType);
  console.log('Destination:', destination);

  const errors: string[] = [];

  try {
    await discordService.sendMessage(from, subject, emailData.summary ?? '', emailType, emailData.otp);
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
    errors.push('Discord notification failed');
  }

  if (matchedRoute) {
    try {
      await emailRouteService.incrementReceived(to, emailType);
    } catch (error) {
      console.error('Failed to increment received counter:', error);
      errors.push('Increment counter failed');
    }
  }

  try {
    if (destination) {
      await forward(destination);
      console.log(`Email forwarded successfully to ${destination}`);
    } else {
      await drop();
      console.log('Email dropped as per route configuration');
    }
  } catch (error) {
    console.error('Failed to forward/drop email:', error);
    errors.push(`Forward/drop failed: ${error}`);
  }

  try {
    await incomingHistoryService.create({
      id: 0,
      fromEmail: from,
      toEmail: to,
      subject,
      destination: destination || undefined,
      emailClass: emailType,
      summary: emailData.summary ?? '',
      otp: emailData.otp,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Failed to create history entry:', error);
    errors.push('History creation failed');
  }

  if (errors.length > 0) {
    console.error(`Email processing completed with ${errors.length} error(s):`, errors);
  } else {
    console.log('Email processing completed successfully');
  }
}
