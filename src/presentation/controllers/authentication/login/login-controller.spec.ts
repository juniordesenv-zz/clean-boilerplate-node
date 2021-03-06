import faker from 'faker';
import {
  HttpRequest,
} from '@/presentation/protocols';
import { EmailIsNotConfirmedError, MissingParamError } from '@/presentation/errors';
import { LoginController } from '@/presentation/controllers/authentication/login/login-controller';
import {
  badRequest, forbidden, ok, serverError, unauthorized,
} from '@/presentation/helpers/http/http-helper';
import { mockAuthenticationParams, throwError } from '@/domain/test';
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test';

const mockRequest = (): HttpRequest => ({
  body: mockAuthenticationParams(),
});

type SutTypes = {
  sut: LoginController;
  authenticationSpy: AuthenticationSpy;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy();
  const validationSpy = new ValidationSpy();
  const sut = new LoginController(authenticationSpy, validationSpy);
  return {
    sut,
    authenticationSpy,
    validationSpy,
  };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(authenticationSpy.authenticationParams).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  test('Should return 403 if email is not confirmed', async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.authenticationModel.confirmedEmail = false;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailIsNotConfirmedError()));
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.authenticationModel = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel));
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
});
