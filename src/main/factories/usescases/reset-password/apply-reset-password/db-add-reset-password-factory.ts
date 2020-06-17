import { ResetPasswordMongoRepository } from '@/infra/db/mongodb/reset-password/reset-password-mongo-repository';
import { ApplyResetPassword } from '@/domain/usecases/reset-password/apply-reset-password';
import { DbApplyResetPassword } from '@/data/usecases/reset-password/apply-reset-password/db-apply-reset-password';
import { makeDbChangePasswordAccountById } from '@/main/factories/usescases/account/change-password-account-by-id/change-password-account-by-id-factory';


export const makeDbApplyResetPassword = (): ApplyResetPassword => {
  const resetPasswordMongoRepository = new ResetPasswordMongoRepository();
  const changePasswordAccountById = makeDbChangePasswordAccountById();
  return new DbApplyResetPassword(
    resetPasswordMongoRepository,
    resetPasswordMongoRepository,
    changePasswordAccountById,
  );
};
