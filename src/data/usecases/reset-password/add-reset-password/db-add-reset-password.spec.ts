import {
  AddResetPasswordRepositorySpy,
  LoadAccountByEmailRepositorySpy,
} from '@/data/test';
import { mockAddResetPasswordParams } from '@/domain/test/mock-reset-password';
import { throwError } from '@/domain/test';
import { DbAddResetPassword } from '@/data/usecases/reset-password/add-reset-password/db-add-reset-password';

type SutTypes = {
  sut: DbAddResetPassword;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  addResetPasswordRepositorySpy: AddResetPasswordRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const addResetPasswordRepositorySpy = new AddResetPasswordRepositorySpy();
  const sut = new DbAddResetPassword(
    loadAccountByEmailRepositorySpy,
    addResetPasswordRepositorySpy,
  );
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    addResetPasswordRepositorySpy,
  };
};


describe('DbAddResetPassword Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    const addResetPasswordParams = mockAddResetPasswordParams();
    await sut.add(addResetPasswordParams);
    expect(loadAccountByEmailRepositorySpy.email).toBe(addResetPasswordParams.email);
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.accountModel = null;
    const addResetPasswordParams = mockAddResetPasswordParams();
    const result = await sut.add(addResetPasswordParams);
    expect(result).toBe(null);
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddResetPasswordParams());
    await expect(promise).rejects.toThrow();
  });


  test('Should call AddResetPasswordRepository with correct values', async () => {
    const { sut, addResetPasswordRepositorySpy, loadAccountByEmailRepositorySpy } = makeSut();
    const addResetPasswordParams = mockAddResetPasswordParams();
    await sut.add(addResetPasswordParams);
    expect(addResetPasswordRepositorySpy.addResetPasswordParams).toEqual({
      ...addResetPasswordParams,
      accountId: loadAccountByEmailRepositorySpy.accountModel.id,
    });
  });


  test('Should return ResetPassword on AddResetPasswordRepository success', async () => {
    const { sut, addResetPasswordRepositorySpy, loadAccountByEmailRepositorySpy } = makeSut();
    const addResetPasswordParams = mockAddResetPasswordParams();
    const result = await sut.add(addResetPasswordParams);
    expect(result).toEqual({
      ...addResetPasswordRepositorySpy.resetPasswordModel,
      account: loadAccountByEmailRepositorySpy.accountModel,
    });
  });
});
