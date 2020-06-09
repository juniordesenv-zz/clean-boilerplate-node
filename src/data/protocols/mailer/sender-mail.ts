import { SentMessageInfo as NodemailerMessageInfo } from 'nodemailer';

export type SentMessageInfo = NodemailerMessageInfo;

export type MailerParams = {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
};

export interface SenderMail {
  sendMail (data: MailerParams): Promise<SentMessageInfo>
}
