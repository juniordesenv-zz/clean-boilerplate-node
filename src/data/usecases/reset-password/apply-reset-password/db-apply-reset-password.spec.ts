import {
  ChangePasswordAccountByIdSpy,
  DisableAllResetPasswordByAccountRepositorySpy,
  LoadResetPasswordByTokenNotExpiredRepositorySpy,
} from '@/data/test';
import { mockApplyResetPasswordParams } from '@/domain/test/mock-reset-password';
import { throwError } from '@/domain/test';
import { DbApplyResetPassword } from '@/data/usecases/reset-password/apply-reset-password/db-apply-reset-password';

type SutTypes = {
  sut: DbApplyResetPassword;
  loadResetPasswordByTokenNotExpiredRepositorySpy:
  LoadResetPasswordByTokenNotExpiredRepositorySpy;
  disableAllResetPasswordByAccountRepositorySpy: DisableAllResetPasswordByAccountRepositorySpy;
  changePasswordAccountByIdSpy:
  ChangePasswordAccountByIdSpy;
};

const makeSut = (): SutTypes => {
  const loadResetPasswordByTokenNotExpiredRepositorySpy = new
  LoadResetPasswordByTokenNotExpiredRepositorySpy();
  const disableAllResetPasswordByAccountRepositorySpy = new
  DisableAllResetPasswordByAccountRepositorySpy();
  const changePasswordAccountByIdSpy = new
  ChangePasswordAccountByIdSpy();
  const sut = new DbApplyResetPassword(
    loadResetPasswordByTokenNotExpiredRepositorySpy,
    disableAllResetPasswordByAccountRepositorySpy,
    changePasswordAccountByIdSpy,
  );
  return {
    sut,
    loadResetPasswordByTokenNotExpiredRepositorySpy,
    disableAllResetPasswordByAccountRepositorySpy,
    changePasswordAccountByIdSpy,
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


  test('Should call ChangePasswordAccountById with correct id and password', async () => {
    const {
      sut,
      changePasswordAccountByIdSpy,
      loadResetPasswordByTokenNotExpiredRepositorySpy,
    } = makeSut();
    const applyResetPasswordParams = mockApplyResetPasswordParams();
    await sut.apply(applyResetPasswordParams);
    expect(changePasswordAccountByIdSpy.accountId)
      .toBe(loadResetPasswordByTokenNotExpiredRepositorySpy.resetPasswordModel.accountId);
    expect(changePasswordAccountByIdSpy.password)
      .toBe(applyResetPasswordParams.password);
  });


  test('Should return false if ChangePasswordAccountById on fails', async () => {
    const { sut, changePasswordAccountByIdSpy } = makeSut();
    changePasswordAccountByIdSpy.changed = false;
    const result = await sut.apply(mockApplyResetPasswordParams());
    expect(result).toBe(false);
  });


  test('Should throw if ChangePasswordAccountById throws', async () => {
    const { sut, changePasswordAccountByIdSpy } = makeSut();
    jest.spyOn(changePasswordAccountByIdSpy, 'change').mockImplementationOnce(throwError);
    const promise = sut.apply(mockApplyResetPasswordParams());
    await expect(promise).rejects.toThrow();
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
      changePasswordAccountByIdSpy,
    } = makeSut();
    changePasswordAccountByIdSpy.changed = false;
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
