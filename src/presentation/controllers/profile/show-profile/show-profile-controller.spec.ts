
import faker from 'faker';
import {
  serverError, ok, forbidden,
} from '@/presentation/helpers/http/http-helper';
import {
  HttpRequest,
} from '@/presentation/protocols';
import {
  AccessDeniedError,
  ServerError,
} from '@/presentation/errors';
import { throwError } from '@/domain/test';
import {
  ShowProfileSpy,
} from '@/presentation/test';
import { ShowProfileController } from '@/presentation/controllers/profile/show-profile/show-profile-controller';

const mockRequest = (): HttpRequest => ({
  accountId: faker.random.uuid(),
});

type SutTypes = {
  sut: ShowProfileController;
  showProfileSpy: ShowProfileSpy;
};

const makeSut = (): SutTypes => {
  const showProfileSpy = new ShowProfileSpy();
  const sut = new ShowProfileController(
    showProfileSpy,
  );
  return {
    sut,
    showProfileSpy,
  };
};

describe('ShowProfile Controller', () => {
  test('Should return 500 if ShowProfile throws', async () => {
    const { sut, showProfileSpy } = makeSut();
    jest.spyOn(showProfileSpy, 'show').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call ShowProfile with correct values', async () => {
    const { sut, showProfileSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(showProfileSpy.accountId)
      .toEqual(httpRequest.accountId);
  });

  test('Should return 403 if ShowProfile returns null', async () => {
    const { sut, showProfileSpy } = makeSut();
    showProfileSpy.profileModel = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should return 200 if valid request', async () => {
    const { sut, showProfileSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(showProfileSpy.profileModel));
  });
});
