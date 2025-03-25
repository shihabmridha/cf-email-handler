import * as nodemailer from 'nodemailer';
import { Transport } from '../../interfaces/transport';
import { TransportSmtpConfig, TransportContent } from '@/dtos/transport';

export class SmtpTransport implements Transport {
  private readonly transporter: nodemailer.Transporter;

  constructor(config: TransportSmtpConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.username,
        pass: config.password,
      },
    });
  }

  async send<T extends TransportContent>(mailContent: T): Promise<boolean> {
    const to = mailContent.to.join(',');

    try {
      await this.transporter.sendMail({
        from: `"${mailContent.fromName}" <${mailContent.from}>`,
        to,
        subject: mailContent.subject,
        text: mailContent.text,
        html: mailContent.html,
      });

      return true;
    } catch (error) {
      console.error(error);
    }

    return false;
  }
}
