import faker from 'faker';
import { throwError } from '@/domain/test';
import { DbConfirmEmailAccount } from '@/data/usecases/account/confirm-email-account/db-confirm-email-account';
import { ConfirmEmailAccountByConfirmTokenRepositorySpy } from '@/data/test';


type SutTypes = {
  sut: DbConfirmEmailAccount;
  confirmEmailAccountByConfirmTokenRepositorySpy: ConfirmEmailAccountByConfirmTokenRepositorySpy;
};

const makeSut = (): SutTypes => {
  const confirmEmailAccountByConfirmTokenRepositorySpy = new
  ConfirmEmailAccountByConfirmTokenRepositorySpy();
  const sut = new DbConfirmEmailAccount(
    confirmEmailAccountByConfirmTokenRepositorySpy,
  );
  return {
    sut,
    confirmEmailAccountByConfirmTokenRepositorySpy,
  };
};

let token: string;

describe('DbConfirmEmailAccount Usecase', () => {
  beforeEach(() => {
    token = faker.random.uuid();
  });

  test('Should call LoadAccountByConfirmEmailTokenRepository with correct token', async () => {
    const { sut, confirmEmailAccountByConfirmTokenRepositorySpy } = makeSut();
    await sut.confirmEmail(token);
    expect(confirmEmailAccountByConfirmTokenRepositorySpy.confirmEmailToken).toBe(token);
  });

  test('Should return false if ConfirmEmailAccountByConfirmTokenRepository returns false', async () => {
    const { sut, confirmEmailAccountByConfirmTokenRepositorySpy } = makeSut();
    confirmEmailAccountByConfirmTokenRepositorySpy.confirmed = false;
    const isConfirmed = await sut.confirmEmail(token);
    expect(isConfirmed).toBe(false);
  });

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, confirmEmailAccountByConfirmTokenRepositorySpy } = makeSut();
    jest.spyOn(confirmEmailAccountByConfirmTokenRepositorySpy, 'confirmEmailByConfirmToken').mockImplementationOnce(throwError);
    const promise = sut.confirmEmail(token);
    await expect(promise).rejects.toThrow();
  });

  test('Should return true if ConfirmEmailToken is confirmed', async () => {
    const { sut } = makeSut();
    const isConfirmed = await sut.confirmEmail(token);
    expect(isConfirmed).toBe(true);
  });
});
