
import faker from 'faker';
import MockDate from 'mockdate';
import {
  badRequest, serverError, ok, forbidden,
} from '@/presentation/helpers/http/http-helper';
import {
  HttpRequest,
} from '@/presentation/protocols';
import { EmailNotFoundError, MissingParamError, ServerError } from '@/presentation/errors';
import { throwError } from '@/domain/test';
import {
  ValidationSpy,
  AddResetPasswordSpy,
  SendLinkResetPasswordSpy,
} from '@/presentation/test';
import env from '@/main/config/env';
import { AddResetPasswordController } from '@/presentation/controllers/authentication/add-reset-password/add-reset-password-controller';


const mockRequest = (): HttpRequest => ({
  body: {
    email: faker.internet.email(),
  },
});

type SutTypes = {
  sut: AddResetPasswordController;
  addResetPasswordSpy: AddResetPasswordSpy;
  validationSpy: ValidationSpy;
  sendLinkResetPasswordSpy: SendLinkResetPasswordSpy;
};

const makeSut = (): SutTypes => {
  const addResetPasswordSpy = new AddResetPasswordSpy();
  const validationSpy = new ValidationSpy();
  const sendLinkResetPasswordSpy = new SendLinkResetPasswordSpy();
  const sut = new AddResetPasswordController(
    addResetPasswordSpy,
    validationSpy,
    sendLinkResetPasswordSpy,
    env.baseUrlFront,
  );
  return {
    sut,
    addResetPasswordSpy,
    validationSpy,
    sendLinkResetPasswordSpy,
  };
};

describe('AddResetPassword Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should return 500 if AddResetPassword throws', async () => {
    const { sut, addResetPasswordSpy } = makeSut();
    jest.spyOn(addResetPasswordSpy, 'add').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call AddResetPassword with correct values', async () => {
    const { sut, addResetPasswordSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addResetPasswordSpy.addResetPasswordParams).toEqual({
      email: httpRequest.body.email,
      createdAt: new Date(),
    });
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok('O processo de alteração de senha foi encaminhado para o email'));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validationSpy.input).toEqual(httpRequest.body);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(faker.random.word());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  test('Should return 403 if AddResetPassword returns null', async () => {
    const { sut, addResetPasswordSpy } = makeSut();
    addResetPasswordSpy.resetPasswordResult = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailNotFoundError()));
  });


  test('Should call SendLinkConfirmAccount with correct values', async () => {
    const { sut, sendLinkResetPasswordSpy, addResetPasswordSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(sendLinkResetPasswordSpy.sendLinkResetPasswordParams).toEqual({
      name: addResetPasswordSpy.resetPasswordResult.account.name,
      email: httpRequest.body.email,
      token: addResetPasswordSpy.resetPasswordResult.token,
      baseUrlFront: env.baseUrlFront,
    });
  });

  test('Should return 500 if SendLinkConfirmAccount throws', async () => {
    const { sut, sendLinkResetPasswordSpy } = makeSut();
    jest.spyOn(sendLinkResetPasswordSpy, 'sendMail').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
});
