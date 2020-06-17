import { Controller } from '@/presentation/protocols';
import { makeLogControlleDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { ApplyResetPasswordController } from '@/presentation/controllers/authentication/apply-reset-password/apply-reset-password-controller';
import { makeDbApplyResetPassword } from '@/main/factories/usescases/reset-password/apply-reset-password/db-add-reset-password-factory';
import { makeApplyResetPasswordValidation } from '@/main/factories/controllers/authentication/apply-reset-password/apply-reset-password-validation-factory';


export const makeApplyResetPasswordController = (): Controller => makeLogControlleDecorator(
  new ApplyResetPasswordController(
    makeDbApplyResetPassword(),
    makeApplyResetPasswordValidation(),
  ),
);
