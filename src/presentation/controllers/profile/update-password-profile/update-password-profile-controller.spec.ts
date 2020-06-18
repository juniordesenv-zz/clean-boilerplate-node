
import faker from 'faker';
import {
  serverError, ok, forbidden, badRequest,
} from '@/presentation/helpers/http/http-helper';
import {
  HttpRequest,
} from '@/presentation/protocols';
import {
  AccessDeniedError, MissingParamError,
  ServerError,
} from '@/presentation/errors';
import { throwError } from '@/domain/test';
import {
  UpdatePasswordProfileSpy,
  ValidationSpy,
} from '@/presentation/test';
import { UpdatePasswordProfileController } from '@/presentation/controllers/profile/update-password-profile/update-password-profile-controller';

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password();
  return {
    accountId: faker.random.uuid(),
    body: {
      password,
      passwordConfirmation: password,
    },
  };
};

type SutTypes = {
  sut: UpdatePasswordProfileController;
  updatePasswordProfileSpy: UpdatePasswordProfileSpy;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const updatePasswordProfileSpy = new UpdatePasswordProfileSpy();
  const validationSpy = new ValidationSpy();
  const sut = new UpdatePasswordProfileController(
    updatePasswordProfileSpy,
    validationSpy,
  );
  return {
    sut,
    updatePasswordProfileSpy,
    validationSpy,
  };
};

describe('UpdatePasswordProfile Controller', () => {
  test('Should return 500 if UpdatePasswordProfile throws', async () => {
    const { sut, updatePasswordProfileSpy } = makeSut();
    jest.spyOn(updatePasswordProfileSpy, 'update').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call UpdatePasswordProfile with correct values', async () => {
    const {
      sut,
      updatePasswordProfileSpy,
    } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(updatePasswordProfileSpy.accountId)
      .toEqual(httpRequest.accountId);
    expect(updatePasswordProfileSpy.password)
      .toEqual(httpRequest.body.password);
  });

  test('Should return 403 if UpdatePasswordProfile returns null', async () => {
    const { sut, updatePasswordProfileSpy } = makeSut();
    updatePasswordProfileSpy.changed = false;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
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
