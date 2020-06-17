import { Controller } from '@/presentation/protocols';
import { makeLogControlleDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import env from '@/main/config/env';
import { makeDbAddResetPassword } from '@/main/factories/usescases/reset-password/add-reset-password/db-add-reset-password-factory';
import { makeSendResetPasswordEmail } from '@/main/factories/usescases/reset-password/reset-password-email/send-email-reset-password-factory';
import { AddResetPasswordController } from '@/presentation/controllers/authentication/add-reset-password/add-reset-password-controller';
import { makeAddResetPasswordValidation } from '@/main/factories/controllers/authentication/add-reset-password/add-reset-password-validation-factory';


export const makeAddResetPasswordController = (): Controller => makeLogControlleDecorator(
  new AddResetPasswordController(
    makeDbAddResetPassword(),
    makeAddResetPasswordValidation(),
    makeSendResetPasswordEmail(),
    env.baseUrlFront,
  ),
);
