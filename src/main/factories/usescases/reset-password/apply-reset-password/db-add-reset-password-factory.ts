import { ResetPasswordMongoRepository } from '@/infra/db/mongodb/reset-password/reset-password-mongo-repository';
import { ApplyResetPassword } from '@/domain/usecases/reset-password/apply-reset-password';
import { DbApplyResetPassword } from '@/data/usecases/reset-password/apply-reset-password/db-apply-reset-password';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';


export const makeDbApplyResetPassword = (): ApplyResetPassword => {
  const accountMongoRepository = new AccountMongoRepository();
  const resetPasswordMongoRepository = new ResetPasswordMongoRepository();
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  return new DbApplyResetPassword(
    bcryptAdapter,
    resetPasswordMongoRepository,
    resetPasswordMongoRepository,
    accountMongoRepository,
  );
};
