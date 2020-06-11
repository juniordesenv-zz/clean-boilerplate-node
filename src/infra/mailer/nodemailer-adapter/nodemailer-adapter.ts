import nodemailer from 'nodemailer';
import { MailerParams, SenderMail, SentMessageInfo } from '@/data/protocols/mailer/sender-mail';

export class NodemailerAdapter implements SenderMail {
  constructor(
    private readonly user: string,
    private readonly pass: string,
    private readonly host: string,
    private readonly port: number,
    private readonly secure: boolean,
  ) {
  }

  async sendMail(data: MailerParams): Promise<SentMessageInfo> {
    const transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
    return transporter.sendMail(data);
  }
}
