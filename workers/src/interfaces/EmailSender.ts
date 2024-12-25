export interface EmailSender {
  sendEmail(email: string, subject: string, body: string): Promise<void>;
}
