import faker from 'faker';
import { mockAccountModel, mockApplyResetPasswordParams, throwError } from '@/domain/test';
import { DbUpdateProfile } from '@/data/usecases/profile/update-profile/db-update-profile';
import {
  ChangePasswordAccountByIdRepositorySpy,
  HasherSpy,
  LoadAccountByEmailRepositorySpy,
  UpdateProfileRepositorySpy,
} from '@/data/test';
import { mockUpdateProfileParams } from '@/domain/test/mock-profile';
import { DbUpdatePasswordProfile } from '@/data/usecases/profile/update-password-profile/db-update-password-profile';


type SutTypes = {
  sut: DbUpdatePasswordProfile;
  hasherSpy: HasherSpy;
  changePasswordAccountByIdRepositorySpy:
  ChangePasswordAccountByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const changePasswordAccountByIdRepositorySpy = new
  ChangePasswordAccountByIdRepositorySpy();
  const hasherSpy = new HasherSpy();
  const sut = new DbUpdatePasswordProfile(hasherSpy, changePasswordAccountByIdRepositorySpy);
  return {
    sut,
    hasherSpy,
    changePasswordAccountByIdRepositorySpy,
  };
};

let id: string;
let password: string;

describe('DbUpdateProfile Usecase', () => {
  beforeEach(() => {
    id = faker.random.uuid();
    password = faker.internet.password();
  });

  test('Should call Hasher with correct password', async () => {
    const {
      sut,
      hasherSpy,
    } = makeSut();
    await sut.update(id, password);
    expect(hasherSpy.plaintext).toBe(password);
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError);
    const promise = sut.update(id, password);
    await expect(promise).rejects.toThrow();
  });

  test('Should call ChangePasswordAccountByIdRepository with correct values', async () => {
    const {
      sut,
      changePasswordAccountByIdRepositorySpy,
      hasherSpy,
    } = makeSut();
    await sut.update(id, password);
    expect(changePasswordAccountByIdRepositorySpy.accountId)
      .toBe(id);
    expect(changePasswordAccountByIdRepositorySpy.hashedPassword).toBe(hasherSpy.digest);
  });

  test('Should return false if ChangePasswordAccountByIdRepository returns false', async () => {
    const { sut, changePasswordAccountByIdRepositorySpy } = makeSut();
    changePasswordAccountByIdRepositorySpy.changed = false;
    const isConfirmed = await sut.update(id, password);
    expect(isConfirmed).toBe(false);
  });


  test('Should return true if ChangePasswordAccountByIdRepository on success', async () => {
    const { sut } = makeSut();
    const result = await sut.update(id, password);
    expect(result).toBe(true);
  });
});
