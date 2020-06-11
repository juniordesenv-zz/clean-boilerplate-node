import faker from 'faker';
import { MailerParams, SenderMail, SentMessageInfo } from '@/data/protocols/mailer/sender-mail';

export class SenderMailSpy implements SenderMail {
  sentMessageInfo: SentMessageInfo = {
    messageId: faker.random.uuid(),
    envelope: faker.random.words(),
    accepted: [faker.internet.email()],
    response: faker.random.words(),
  };

  mailerParams: MailerParams;

  sendMail(mailerParams: MailerParams): Promise<SentMessageInfo> {
    this.mailerParams = mailerParams;
    return Promise.resolve(this.sentMessageInfo);
  }
}
