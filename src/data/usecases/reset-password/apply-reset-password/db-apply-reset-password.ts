import { ApplyResetPassword, ApplyResetPasswordParams } from '@/domain/usecases/reset-password/apply-reset-password';
import { LoadResetPasswordByTokenNotExpiredRepository } from '@/data/protocols/db/reset-password/load-reset-password-by-token-not-expired-repository';
import { ChangePasswordAccountById } from '@/domain/usecases/account/change-password-account-by-id';
import { DisableAllResetPasswordByAccountRepository } from '@/data/protocols/db/reset-password/disable-all-reset-password-by-account-repository';

export class DbApplyResetPassword implements ApplyResetPassword {
  constructor(
    private readonly loadResetPasswordByTokenNotExpiredRepository:
    LoadResetPasswordByTokenNotExpiredRepository,
    private readonly disableAllResetPasswordByAccountRepository:
    DisableAllResetPasswordByAccountRepository,
    private readonly changePasswordAccountById:
    ChangePasswordAccountById,
  ) {
  }

  async apply(applyResetPassword: ApplyResetPasswordParams): Promise<boolean> {
    const resetPassword = await this.loadResetPasswordByTokenNotExpiredRepository
      .loadByTokenNotExpired(applyResetPassword.token);
    if (!resetPassword) return false;
    const isChanged = await this.changePasswordAccountById.change(
      resetPassword.accountId,
      applyResetPassword.password,
    );
    if (isChanged) {
      await this.disableAllResetPasswordByAccountRepository
        .disableAllByAccount(resetPassword.accountId);
      return true;
    }
    return false;
  }
}
