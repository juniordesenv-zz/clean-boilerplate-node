import {
  ChangePasswordAccountByIdRepositorySpy,
  DisableAllResetPasswordByAccountRepositorySpy, HasherSpy,
  LoadResetPasswordByTokenNotExpiredRepositorySpy,
} from '@/data/test';
import { mockApplyResetPasswordParams } from '@/domain/test/mock-reset-password';
import { throwError } from '@/domain/test';
import { DbApplyResetPassword } from '@/data/usecases/reset-password/apply-reset-password/db-apply-reset-password';

type SutTypes = {
  sut: DbApplyResetPassword;
  hasherSpy: HasherSpy;
  loadResetPasswordByTokenNotExpiredRepositorySpy:
  LoadResetPasswordByTokenNotExpiredRepositorySpy;
  disableAllResetPasswordByAccountRepositorySpy: DisableAllResetPasswordByAccountRepositorySpy;
  changePasswordAccountByIdRepositorySpy:
  ChangePasswordAccountByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadResetPasswordByTokenNotExpiredRepositorySpy = new
  LoadResetPasswordByTokenNotExpiredRepositorySpy();
  const disableAllResetPasswordByAccountRepositorySpy = new
  DisableAllResetPasswordByAccountRepositorySpy();
  const changePasswordAccountByIdRepositorySpy = new
  ChangePasswordAccountByIdRepositorySpy();
  const hasherSpy = new HasherSpy();
  const sut = new DbApplyResetPassword(
    hasherSpy,
    loadResetPasswordByTokenNotExpiredRepositorySpy,
    disableAllResetPasswordByAccountRepositorySpy,
    changePasswordAccountByIdRepositorySpy,
  );
  return {
    sut,
    hasherSpy,
    loadResetPasswordByTokenNotExpiredRepositorySpy,
    disableAllResetPasswordByAccountRepositorySpy,
    changePasswordAccountByIdRepositorySpy,
  };
};


describe('DbApplyResetPassword Usecase', () => {
  test('Should call LoadResetPasswordByTokenNotExpiredRepository with correct token', async () => {
    const { sut, loadResetPasswordByTokenNotExpiredRepositorySpy } = makeSut();
    const applyResetPasswordParams = mockApplyResetPasswordParams();
    await sut.apply(applyResetPasswordParams);
    expect(loadResetPasswordByTokenNotExpiredRepositorySpy.token)
      .toBe(applyResetPasswordParams.token);
  });

  test('Should return false if LoadResetPasswordByTokenNotExpiredRepository not found token or is expired', async () => {
    const { sut, loadResetPasswordByTokenNotExpiredRepositorySpy } = makeSut();
    loadResetPasswordByTokenNotExpiredRepositorySpy.resetPasswordModel = null;
    const result = await sut.apply(mockApplyResetPasswordParams());
    expect(result).toBe(false);
  });

  test('Should throw if LoadResetPasswordByTokenNotExpiredRepository throws', async () => {
    const { sut, loadResetPasswordByTokenNotExpiredRepositorySpy } = makeSut();
    jest.spyOn(loadResetPasswordByTokenNotExpiredRepositorySpy, 'loadByTokenNotExpired').mockImplementationOnce(throwError);
    const promise = sut.apply(mockApplyResetPasswordParams());
    await expect(promise).rejects.toThrow();
  });


  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut();
    const applyResetPasswordParams = mockApplyResetPasswordParams();
    await sut.apply(applyResetPasswordParams);
    expect(hasherSpy.plaintext).toBe(applyResetPasswordParams.password);
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError);
    const promise = sut.apply(mockApplyResetPasswordParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call ChangePasswordAccountByIdRepository with correct values', async () => {
    const {
      sut,
      changePasswordAccountByIdRepositorySpy,
      loadResetPasswordByTokenNotExpiredRepositorySpy,
      hasherSpy,
    } = makeSut();
    const applyResetPasswordParams = mockApplyResetPasswordParams();
    await sut.apply(applyResetPasswordParams);
    expect(changePasswordAccountByIdRepositorySpy.accountId)
      .toBe(loadResetPasswordByTokenNotExpiredRepositorySpy.resetPasswordModel.accountId);
    expect(changePasswordAccountByIdRepositorySpy.hashedPassword).toBe(hasherSpy.digest);
  });

  test('Should return false if ChangePasswordAccountByIdRepository returns false', async () => {
    const { sut, changePasswordAccountByIdRepositorySpy } = makeSut();
    changePasswordAccountByIdRepositorySpy.changed = false;
    const isConfirmed = await sut.apply(mockApplyResetPasswordParams());
    expect(isConfirmed).toBe(false);
  });


  test('Should return true if ChangePasswordAccountById on success', async () => {
    const { sut } = makeSut();
    const result = await sut.apply(mockApplyResetPasswordParams());
    expect(result).toBe(true);
  });

  test('Should call DisableAllResetPasswordByAccountRepository on apply if is password changed', async () => {
    const { sut, disableAllResetPasswordByAccountRepositorySpy } = makeSut();
    await sut.apply(mockApplyResetPasswordParams());
    expect(disableAllResetPasswordByAccountRepositorySpy.callsCount).toBe(1);
  });

  test('Should cannot call DisableAllResetPasswordByAccountRepository on apply if is password is not changed', async () => {
    const {
      sut,
      disableAllResetPasswordByAccountRepositorySpy,
      changePasswordAccountByIdRepositorySpy,
    } = makeSut();
    changePasswordAccountByIdRepositorySpy.changed = false;
    await sut.apply(mockApplyResetPasswordParams());
    expect(disableAllResetPasswordByAccountRepositorySpy.callsCount).toBe(0);
  });

  test('Should throw if DisableAllResetPasswordByAccountRepository throws', async () => {
    const { sut, disableAllResetPasswordByAccountRepositorySpy } = makeSut();
    jest.spyOn(disableAllResetPasswordByAccountRepositorySpy, 'disableAllByAccount').mockImplementationOnce(throwError);
    const promise = sut.apply(mockApplyResetPasswordParams());
    await expect(promise).rejects.toThrow();
  });
});
