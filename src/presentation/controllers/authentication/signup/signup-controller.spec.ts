
import faker from 'faker';
import MockDate from 'mockdate';
import {
  badRequest, serverError, ok, forbidden,
} from '@/presentation/helpers/http/http-helper';
import {
  HttpRequest,
} from '@/presentation/protocols';
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors';
import { throwError } from '@/domain/test';
import {
  AddAccountSpy, SendLinkConfirmAccountSpy, ValidationSpy,
} from '@/presentation/test';
import { SignUpController } from '@/presentation/controllers/authentication/signup/signup-controller';
import env from '@/main/config/env';

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password();
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password,
    },
  };
};

type SutTypes = {
  sut: SignUpController;
  addAccountSpy: AddAccountSpy;
  validationSpy: ValidationSpy;
  sendLinkConfirmAccountSpy: SendLinkConfirmAccountSpy;
};

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy();
  const validationSpy = new ValidationSpy();
  const sendLinkConfirmAccountSpy = new SendLinkConfirmAccountSpy();
  const sut = new SignUpController(
    addAccountSpy,
    validationSpy,
    sendLinkConfirmAccountSpy,
    env.baseUrlFront,
  );
  return {
    sut,
    addAccountSpy,
    validationSpy,
    sendLinkConfirmAccountSpy,
  };
};

describe('SignUp Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut();
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addAccountSpy.addAccountParams).toEqual({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
      confirmedEmail: false,
      createdAt: new Date(),
    });
  });

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut();
    addAccountSpy.accountModel = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok('Usuário cadastrado com sucesso, confirme seu email'));
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


  test('Should call SendLinkConfirmAccount with correct values', async () => {
    const { sut, sendLinkConfirmAccountSpy, addAccountSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(sendLinkConfirmAccountSpy.sendLinkConfirmAccountParams).toEqual({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      confirmEmailToken: addAccountSpy.accountModel.confirmEmailToken,
      baseUrlFront: env.baseUrlFront,
    });
  });

  test('Should return 500 if SendLinkConfirmAccount throws', async () => {
    const { sut, sendLinkConfirmAccountSpy } = makeSut();
    jest.spyOn(sendLinkConfirmAccountSpy, 'sendMail').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });
});
