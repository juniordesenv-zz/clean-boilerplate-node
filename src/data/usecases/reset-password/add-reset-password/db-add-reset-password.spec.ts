import {
  AddResetPasswordRepositorySpy, DateSpy, DisableAllResetPasswordByAccountRepositorySpy,
  LoadAccountByEmailRepositorySpy, UuidSpy,
} from '@/data/test';
import { mockAddResetPasswordParams } from '@/domain/test/mock-reset-password';
import { mockAddAccountParams, throwError } from '@/domain/test';
import { DbAddResetPassword } from '@/data/usecases/reset-password/add-reset-password/db-add-reset-password';

type SutTypes = {
  sut: DbAddResetPassword;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  addResetPasswordRepositorySpy: AddResetPasswordRepositorySpy;
  disableAllResetPasswordByAccountRepositorySpy: DisableAllResetPasswordByAccountRepositorySpy;
  uuidSpy: UuidSpy;
  dateSpy: DateSpy;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const addResetPasswordRepositorySpy = new AddResetPasswordRepositorySpy();
  const disableAllResetPasswordByAccountRepositorySpy = new
  DisableAllResetPasswordByAccountRepositorySpy();
  const uuidSpy = new UuidSpy();
  const dateSpy = new DateSpy();
  const sut = new DbAddResetPassword(
    loadAccountByEmailRepositorySpy,
    addResetPasswordRepositorySpy,
    disableAllResetPasswordByAccountRepositorySpy,
    uuidSpy,
    dateSpy,
  );
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    addResetPasswordRepositorySpy,
    disableAllResetPasswordByAccountRepositorySpy,
    uuidSpy,
    dateSpy,
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
    const {
      sut, addResetPasswordRepositorySpy, loadAccountByEmailRepositorySpy, uuidSpy, dateSpy,
    } = makeSut();
    const addResetPasswordParams = mockAddResetPasswordParams();
    await sut.add(addResetPasswordParams);
    expect(addResetPasswordRepositorySpy.addResetPasswordParams).toEqual({
      ...addResetPasswordParams,
      accountId: loadAccountByEmailRepositorySpy.accountModel.id,
      isEnabled: true,
      expiredAt: dateSpy.futureDate,
      token: uuidSpy.uuid,
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

  test('Should call Uuid v4', async () => {
    const { sut, uuidSpy } = makeSut();
    await sut.add(mockAddResetPasswordParams());
    expect(uuidSpy.callsCount).toBe(1);
  });

  test('Should throw if Uuid throws', async () => {
    const { sut, uuidSpy } = makeSut();
    jest.spyOn(uuidSpy, 'v4').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call IncrementDate add', async () => {
    const { sut, dateSpy } = makeSut();
    await sut.add(mockAddResetPasswordParams());
    expect(dateSpy.callsCount).toBe(1);
  });

  test('Should throw if IncrementDate throws', async () => {
    const { sut, dateSpy } = makeSut();
    jest.spyOn(dateSpy, 'add').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });


  test('Should call DisableAllResetPasswordByAccountRepository add', async () => {
    const { sut, disableAllResetPasswordByAccountRepositorySpy } = makeSut();
    await sut.add(mockAddResetPasswordParams());
    expect(disableAllResetPasswordByAccountRepositorySpy.callsCount).toBe(1);
  });


  test('Should throw if DisableAllResetPasswordByAccountRepository throws', async () => {
    const { sut, disableAllResetPasswordByAccountRepositorySpy } = makeSut();
    jest.spyOn(disableAllResetPasswordByAccountRepositorySpy, 'disableAllByAccount').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });
});
