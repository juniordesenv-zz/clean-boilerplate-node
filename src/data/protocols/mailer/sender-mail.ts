
export type SentMessageInfo = {
  messageId: string;
  envelope: any;
  accepted: string[];
  rejected?: string[];
  pending?: string[];
  response: string;
};

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
