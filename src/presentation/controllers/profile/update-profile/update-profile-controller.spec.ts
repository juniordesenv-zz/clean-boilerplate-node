
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
  UpdateProfileSpy, ValidationSpy,
} from '@/presentation/test';
import { UpdateProfileController } from '@/presentation/controllers/profile/update-profile/update-profile-controller';

const mockRequest = (): HttpRequest => ({
  body: {
    name: faker.random.uuid(),
    email: faker.internet.email(),
  },
});

type SutTypes = {
  sut: UpdateProfileController;
  updateProfileSpy: UpdateProfileSpy;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const updateProfileSpy = new UpdateProfileSpy();
  const validationSpy = new ValidationSpy();
  const sut = new UpdateProfileController(
    updateProfileSpy,
    validationSpy,
  );
  return {
    sut,
    updateProfileSpy,
    validationSpy,
  };
};

describe('UpdateProfile Controller', () => {
  test('Should return 500 if UpdateProfile throws', async () => {
    const { sut, updateProfileSpy } = makeSut();
    jest.spyOn(updateProfileSpy, 'update').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call UpdateProfile with correct values', async () => {
    const { sut, updateProfileSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(updateProfileSpy.updateProfileData)
      .toEqual(httpRequest.body);
  });

  test('Should return 403 if UpdateProfile returns null', async () => {
    const { sut, updateProfileSpy } = makeSut();
    updateProfileSpy.profileModel = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut, updateProfileSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({
      name: updateProfileSpy.profileModel.name,
      email: updateProfileSpy.profileModel.email,
    }));
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
