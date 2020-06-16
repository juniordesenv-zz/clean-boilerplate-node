import { Controller } from '@/presentation/protocols';
import { makeLogControlleDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import env from '@/main/config/env';
import { ResetPasswordController } from '@/presentation/controllers/authentication/reset-password/reset-password-controller';
import { makeDbAddResetPassword } from '@/main/factories/usescases/reset-password/add-reset-password/db-add-reset-password-factory';
import { makeSendResetPasswordEmail } from '@/main/factories/usescases/reset-password/reset-password-email/send-email-reset-password-factory';
import { makeResetPasswordValidation } from '@/main/factories/controllers/authentication/reset-password/reset-password-validation-factory';


export const makeResetPasswordController = (): Controller => makeLogControlleDecorator(
  new ResetPasswordController(
    makeDbAddResetPassword(),
    makeResetPasswordValidation(),
    makeSendResetPasswordEmail(),
    env.baseUrlFront,
  ),
);
