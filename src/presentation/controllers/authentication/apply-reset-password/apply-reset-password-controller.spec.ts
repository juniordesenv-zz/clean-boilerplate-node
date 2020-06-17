
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
  SendLinkResetPasswordSpy, ApplyResetPasswordSpy,
} from '@/presentation/test';
import env from '@/main/config/env';
import { AddResetPasswordController } from '@/presentation/controllers/authentication/add-reset-password/add-reset-password-controller';
import { ApplyResetPasswordController } from '@/presentation/controllers/authentication/apply-reset-password/apply-reset-password-controller';


const mockRequest = (): HttpRequest => ({
  body: {
    password: faker.internet.password(),
  },
  params: {
    token: faker.random.uuid(),
  },
});

type SutTypes = {
  sut: ApplyResetPasswordController;
  applyResetPasswordSpy: ApplyResetPasswordSpy;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const applyResetPasswordSpy = new ApplyResetPasswordSpy();
  const validationSpy = new ValidationSpy();
  const sut = new ApplyResetPasswordController(
    applyResetPasswordSpy,
    validationSpy,
  );
  return {
    sut,
    applyResetPasswordSpy,
    validationSpy,
  };
};

describe('ApplyResetPassword Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should return 500 if ApplyResetPassword throws', async () => {
    const { sut, applyResetPasswordSpy } = makeSut();
    jest.spyOn(applyResetPasswordSpy, 'apply').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call ApplyResetPassword with correct values', async () => {
    const { sut, applyResetPasswordSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(applyResetPasswordSpy.applyResetPasswordParams).toEqual({
      password: httpRequest.body.password,
      token: httpRequest.params.token,
    });
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok('Senha alterada com sucesso'));
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
