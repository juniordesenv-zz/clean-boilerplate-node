
import faker from 'faker';
import {
  badRequest, serverError, ok,
} from '@/presentation/helpers/http/http-helper';
import {
  HttpRequest,
} from '@/presentation/protocols';
import {
  InvalidParamError, ServerError,
} from '@/presentation/errors';
import { throwError } from '@/domain/test';
import {
  ConfirmEmailAccountByConfirmEmailTokenSpy,
} from '@/presentation/test';
import { ConfirmEmailController } from '@/presentation/controllers/authentication/confirm-email/confirm-email-controller';

const mockRequest = (): HttpRequest => ({
  params: {
    confirmEmailToken: faker.random.uuid(),
  },
});

type SutTypes = {
  sut: ConfirmEmailController;
  confirmEmailAccountByConfirmEmailTokenSpy: ConfirmEmailAccountByConfirmEmailTokenSpy;
};

const makeSut = (): SutTypes => {
  const confirmEmailAccountByConfirmEmailTokenSpy = new ConfirmEmailAccountByConfirmEmailTokenSpy();
  const sut = new ConfirmEmailController(
    confirmEmailAccountByConfirmEmailTokenSpy,
  );
  return {
    sut,
    confirmEmailAccountByConfirmEmailTokenSpy,
  };
};

describe('ConfirmEmail Controller', () => {
  test('Should return 500 if ConfirmEmailAccountByConfirmEmailToken throws', async () => {
    const { sut, confirmEmailAccountByConfirmEmailTokenSpy } = makeSut();
    jest.spyOn(confirmEmailAccountByConfirmEmailTokenSpy, 'confirmEmail').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  test('Should call ConfirmEmailAccountByConfirmEmailToken with correct values', async () => {
    const { sut, confirmEmailAccountByConfirmEmailTokenSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(confirmEmailAccountByConfirmEmailTokenSpy.confirmEmailToken)
      .toEqual(httpRequest.params.confirmEmailToken);
  });

  test('Should return 400 if ConfirmEmailAccountByConfirmEmailToken returns false', async () => {
    const { sut, confirmEmailAccountByConfirmEmailTokenSpy } = makeSut();
    confirmEmailAccountByConfirmEmailTokenSpy.isConfirmed = false;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('confirmEmailToken')));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok('Email confirmado com succeso'));
  });
});
