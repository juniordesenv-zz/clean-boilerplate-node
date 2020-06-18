import { ApplyResetPassword, ApplyResetPasswordParams } from '@/domain/usecases/reset-password/apply-reset-password';
import { LoadResetPasswordByTokenNotExpiredRepository } from '@/data/protocols/db/reset-password/load-reset-password-by-token-not-expired-repository';
import { DisableAllResetPasswordByAccountRepository } from '@/data/protocols/db/reset-password/disable-all-reset-password-by-account-repository';
import { Hasher } from '@/data/protocols/cryptography/hasher';
import { ChangePasswordAccountByIdRepository } from '@/data/protocols/db/account/change-password-account-by-id-repository';

export class DbApplyResetPassword implements ApplyResetPassword {
  constructor(
    private readonly hasher: Hasher,
    private readonly loadResetPasswordByTokenNotExpiredRepository:
    LoadResetPasswordByTokenNotExpiredRepository,
    private readonly disableAllResetPasswordByAccountRepository:
    DisableAllResetPasswordByAccountRepository,
    private readonly changePasswordAccountByIdRepository:
    ChangePasswordAccountByIdRepository,
  ) {
  }

  async apply(applyResetPassword: ApplyResetPasswordParams): Promise<boolean> {
    const resetPassword = await this.loadResetPasswordByTokenNotExpiredRepository
      .loadByTokenNotExpired(applyResetPassword.token);
    if (!resetPassword) return false;
    const hashedPassword = await this.hasher.hash(applyResetPassword.password);
    const isChanged = await this.changePasswordAccountByIdRepository.changePasswordById(
      resetPassword.accountId,
      hashedPassword,
    );
    if (isChanged) {
      await this.disableAllResetPasswordByAccountRepository
        .disableAllByAccount(resetPassword.accountId);
      return true;
    }
    return false;
  }
}
