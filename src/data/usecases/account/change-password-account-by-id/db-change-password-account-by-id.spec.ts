import faker from 'faker';
import { mockApplyResetPasswordParams, throwError } from '@/domain/test';
import {
  ChangePasswordAccountByIdRepositorySpy,
  HasherSpy,
} from '@/data/test';
import { DbChangePasswordAccountById } from '@/data/usecases/account/change-password-account-by-id/db-change-password-account-by-id';


type SutTypes = {
  sut: DbChangePasswordAccountById;
  hasherSpy: HasherSpy;
  changePasswordAccountByIdRepositorySpy: ChangePasswordAccountByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy();
  const changePasswordAccountByIdRepositorySpy = new ChangePasswordAccountByIdRepositorySpy();
  const sut = new DbChangePasswordAccountById(
    hasherSpy,
    changePasswordAccountByIdRepositorySpy,
  );
  return {
    sut,
    hasherSpy,
    changePasswordAccountByIdRepositorySpy,
  };
};

let token: string;

describe('DbConfirmEmailAccount Usecase', () => {
  let accountId: string;
  let password: string;

  beforeEach(() => {
    accountId = faker.random.uuid();
    password = faker.internet.password();
  });

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut();
    await sut.change(accountId, password);
    expect(hasherSpy.plaintext).toBe(password);
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError);
    const promise = sut.change(accountId, password);
    await expect(promise).rejects.toThrow();
  });


  test('Should call ChangePasswordAccountByIdRepository with correct values', async () => {
    const { sut, changePasswordAccountByIdRepositorySpy, hasherSpy } = makeSut();
    await sut.change(accountId, password);
    expect(changePasswordAccountByIdRepositorySpy.accountId).toBe(accountId);
    expect(changePasswordAccountByIdRepositorySpy.hashedPassword).toBe(hasherSpy.digest);
  });

  test('Should return false if ChangePasswordAccountByIdRepository returns false', async () => {
    const { sut, changePasswordAccountByIdRepositorySpy } = makeSut();
    changePasswordAccountByIdRepositorySpy.changed = false;
    const isConfirmed = await sut.change(token, password);
    expect(isConfirmed).toBe(false);
  });

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, changePasswordAccountByIdRepositorySpy } = makeSut();
    jest.spyOn(changePasswordAccountByIdRepositorySpy, 'changePasswordById').mockImplementationOnce(throwError);
    const promise = sut.change(token, password);
    await expect(promise).rejects.toThrow();
  });

  test('Should return true if ConfirmEmailToken is confirmed', async () => {
    const { sut } = makeSut();
    const isConfirmed = await sut.change(token, password);
    expect(isConfirmed).toBe(true);
  });
});
