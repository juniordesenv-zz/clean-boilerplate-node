import { throwError } from '@/domain/test';
import nodemailer from 'nodemailer';
import { NodemailerAdapter } from '@/infra/mailer/nodemailer-adapter/nodemailer-adapter';
import { MailerParams } from '@/data/protocols/mailer/sender-mail';

let user;
let pass;

const mockMailer = (): MailerParams => ({
  from: 'valid_email@mail.com.br',
  to: 'other_email@mail.com.br',
  subject: 'Test',
  text: 'any_text',
  html: '<p>any_html</p>',
});

const makeSut = (): NodemailerAdapter => new NodemailerAdapter(
  user,
  pass,
  'smtp.ethereal.email',
  587,
  false,
);

describe('Nodemailer Adapter', () => {
  beforeEach(async () => {
    const testAccount = await nodemailer.createTestAccount();
    user = testAccount.user;
    pass = testAccount.pass;
  });

  describe('sendMail()', async () => {
    test('Should sendMail call createTransport with correct values', async () => {
      const sut = makeSut();
      const createTransportSpy = jest.spyOn(nodemailer, 'createTransport');
      await sut.sendMail(mockMailer());
      expect(createTransportSpy).toHaveBeenCalledWith({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user,
          pass,
        },
      });
    });

    test('Should created transport call sendMail with correct value', async () => {
      const sut = makeSut();
      const createdTransportResult: any = {
        sendMail: jest.fn(),
      };
      jest.spyOn(nodemailer, 'createTransport').mockReturnValueOnce(createdTransportResult);
      await sut.sendMail(mockMailer());
      expect(createdTransportResult.sendMail).toHaveBeenCalledWith(mockMailer());
    });

    test('Should return SentMessageInfo on success', async () => {
      const sut = makeSut();
      const result = await sut.sendMail(mockMailer());
      expect(result.accepted).toEqual(['other_email@mail.com.br']);
      expect(result.messageId).toBeTruthy();
    });

    test('Should throw if createTransport throws', async () => {
      const sut = makeSut();
      jest.spyOn(nodemailer, 'createTransport').mockImplementationOnce(throwError);
      const promise = sut.sendMail(mockMailer());
      await expect(promise).rejects.toThrow();
    });

    test('Should throw if transport sendMail throws', async () => {
      const sut = makeSut();
      const createdTransportResult: any = {
        sendMail: jest.fn(throwError),
      };
      jest.spyOn(nodemailer, 'createTransport').mockReturnValueOnce(createdTransportResult);
      const promise = sut.sendMail(mockMailer());
      await expect(promise).rejects.toThrow();
    });
  });
});
