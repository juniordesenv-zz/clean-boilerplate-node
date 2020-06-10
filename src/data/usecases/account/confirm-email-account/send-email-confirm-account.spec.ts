import { SendEmailConfirmAccount } from '@/data/usecases/account/confirm-email-account/send-email-confirm-account';
import { TemplateBuilderSpy, SenderMailSpy } from '@/data/test';

import { mockSendLinkConfirmAccountParams, throwError } from '@/domain/test';
import faker from 'faker';

jest.mock('nodemailer', () => ({
  createTransport() {
    return {
      sendMail: jest.fn(() => ({
        messageId: faker.random.uuid(),
      })),
    };
  },
}));

type SutTypes = {
  sut: SendEmailConfirmAccount,
  templateBuilderSpy: TemplateBuilderSpy;
  senderMailSpy: SenderMailSpy;
};

const makeSut = (): SutTypes => {
  const templateBuilderSpy = new TemplateBuilderSpy();
  const senderMailSpy = new SenderMailSpy();
  const sut = new SendEmailConfirmAccount(
    templateBuilderSpy,
    senderMailSpy,
    'any_email@email.com',
    'Any Subject',
  );
  return {
    sut,
    templateBuilderSpy,
    senderMailSpy,
  };
};


describe('SendEmailConfirmAccount Usecase', () => {
  test('Should call TemplateBuilder build with correct values', async () => {
    const { sut, templateBuilderSpy } = makeSut();
    const sendLinkConfirmAccountParams = mockSendLinkConfirmAccountParams();
    await sut.sendMail(sendLinkConfirmAccountParams);
    expect(templateBuilderSpy.transpileData).toEqual({
      name: sendLinkConfirmAccountParams.name,
      confirmLink: `${sendLinkConfirmAccountParams.baseUrlFront}/api/confirm-email/${sendLinkConfirmAccountParams.confirmToken}`,
    });
  });


  test('Should throw if TemplateBuilder throws', async () => {
    const { sut, templateBuilderSpy } = makeSut();
    jest.spyOn(templateBuilderSpy, 'build').mockImplementationOnce(throwError);
    const promise = sut.sendMail(mockSendLinkConfirmAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call SenderMail sendMail with correct values', async () => {
    const { sut, senderMailSpy, templateBuilderSpy } = makeSut();
    const sendLinkConfirmAccountParams = mockSendLinkConfirmAccountParams();
    await sut.sendMail(sendLinkConfirmAccountParams);
    expect(senderMailSpy.mailerParams).toEqual({
      from: 'any_email@email.com',
      to: sendLinkConfirmAccountParams.email,
      subject: 'Any Subject',
      html: templateBuilderSpy.html,
    });
  });

  test('Should throw if SenderMail throws', async () => {
    const { sut, senderMailSpy } = makeSut();
    jest.spyOn(senderMailSpy, 'sendMail').mockImplementationOnce(throwError);
    const promise = sut.sendMail(mockSendLinkConfirmAccountParams());
    await expect(promise).rejects.toThrow();
  });
});
