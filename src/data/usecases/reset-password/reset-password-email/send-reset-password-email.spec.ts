import { TemplateBuilderSpy, SenderMailSpy } from '@/data/test';
import { throwError } from '@/domain/test';
import faker from 'faker';
import { SendResetPasswordEmail } from '@/data/usecases/reset-password/reset-password-email/send-reset-password-email';
import { mockSendLinkResetPasswordParams } from '@/domain/test/mock-reset-password';

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
  sut: SendResetPasswordEmail,
  templateBuilderSpy: TemplateBuilderSpy;
  senderMailSpy: SenderMailSpy;
};

const makeSut = (): SutTypes => {
  const templateBuilderSpy = new TemplateBuilderSpy();
  const senderMailSpy = new SenderMailSpy();
  const sut = new SendResetPasswordEmail(
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


describe('SendResetPasswordEmail Usecase', () => {
  test('Should call TemplateBuilder build with correct values', async () => {
    const { sut, templateBuilderSpy } = makeSut();
    const sendLinkConfirmAccountParams = mockSendLinkResetPasswordParams();
    await sut.sendMail(sendLinkConfirmAccountParams);
    expect(templateBuilderSpy.transpileData).toEqual({
      name: sendLinkConfirmAccountParams.name,
      resetLink: `${sendLinkConfirmAccountParams.baseUrlFront}/reset-password/${sendLinkConfirmAccountParams.token}`,
    });
  });


  test('Should throw if TemplateBuilder throws', async () => {
    const { sut, templateBuilderSpy } = makeSut();
    jest.spyOn(templateBuilderSpy, 'build').mockImplementationOnce(throwError);
    const promise = sut.sendMail(mockSendLinkResetPasswordParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call SenderMail sendMail with correct values', async () => {
    const { sut, senderMailSpy, templateBuilderSpy } = makeSut();
    const sendLinkResetPasswordParams = mockSendLinkResetPasswordParams();
    await sut.sendMail(sendLinkResetPasswordParams);
    expect(senderMailSpy.mailerParams).toEqual({
      from: 'any_email@email.com',
      to: sendLinkResetPasswordParams.email,
      subject: 'Any Subject',
      html: templateBuilderSpy.html,
    });
  });

  test('Should throw if SenderMail throws', async () => {
    const { sut, senderMailSpy } = makeSut();
    jest.spyOn(senderMailSpy, 'sendMail').mockImplementationOnce(throwError);
    const promise = sut.sendMail(mockSendLinkResetPasswordParams());
    await expect(promise).rejects.toThrow();
  });
});
