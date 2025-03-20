import { describe, expect, test, mock } from 'bun:test';
import { parseEmail, processEmail } from '../src/handlers/incoming-email';
import config from '../wrangler.toml';
import { WranglerConfig } from "../src/interfaces/wrangler-config.js";
import { Container } from '../src/container';
import { EmailType } from '@/shared/enums/email-type';
import { Configuration } from '../src/config';
import { DiscordService } from '../src/services/discord';
const wranglerConfig = config as WranglerConfig;

describe('Incoming Email', () => {
  test('should forward email and send discord message', async () => {
    const rawEmailString = [
      "MIME-Version: 1.0",
      "Date: Wed, 19 Mar 2025 10:30:45 -0400",
      "From: \"Sender Name\" <sender@example.com>",
      "To: \"Recipient Name\" <recipient@example.com>",
      "Subject: Test Subject",
      "Content-Type: multipart/alternative; boundary=\"boundary-string\"",
      "",
      "--boundary-string",
      "Content-Type: text/plain; charset=\"UTF-8\"",
      "Content-Transfer-Encoding: quoted-printable",
      "",
      "This is the plain text version of the email for email clients that don't support HTML.",
      "",
      "--boundary-string",
      "Content-Type: text/html; charset=\"UTF-8\"",
      "Content-Transfer-Encoding: quoted-printable",
      "",
      "<!DOCTYPE html>",
      "<html lang=\"en\">",
      "<head><title>Test Email</title></head>",
      "<body><p>This is a test email content.</p></body>",
      "</html>",
      "",
      "--boundary-string--"
    ].join("\r\n");

    const env = {
      ...wranglerConfig.vars
    };
    const config = new Configuration(env);
    const discordService = new DiscordService(config);

    const mockMessage: ForwardableEmailMessage = {
      raw: new Blob([rawEmailString]).stream(),
      rawSize: 256,
      from: 'sender@example.com',
      to: 'recipient@example.com',
      forward: mock(() => Promise.resolve()),
      headers: new Headers([['subject', 'Test Subject']]),
      setReject: mock(() => Promise.resolve()),
      reply: mock(() => Promise.resolve())
    };

    const mockGetDestination = mock(() => Promise.resolve("forwarded@example.com"));
    const extractEmailTypeAndData = mock(() => Promise.resolve({
      class: EmailType.INVOICE,
      summary: "Email summary"
    }));

    const mockContainer = {
      getPredictionService: mock(() => ({
        extractEmailTypeAndData: extractEmailTypeAndData
      })),
      getConfig: mock(() => Promise.resolve()),
      getEmailRouteService: mock(() => ({
        getDestination: mockGetDestination
      })),
      getDiscordService: () => discordService
    } as unknown as Container;

    const parsedEmail = await parseEmail(mockMessage);
    await processEmail(parsedEmail, mockContainer);

    expect(extractEmailTypeAndData).toHaveBeenCalled();
    expect(mockGetDestination).toHaveBeenCalled();
    expect(mockMessage.forward).toHaveBeenCalled();
  });
});
