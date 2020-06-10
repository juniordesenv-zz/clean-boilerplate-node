import { Controller } from '@/presentation/protocols';
import { makeLogControlleDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { SignUpController } from '@/presentation/controllers/authentication/signup/signup-controller';
import { makeDbAddAccount } from '@/main/factories/usescases/account/add-account/db-add-account-factory';
import { makeSignUpValidation } from '@/main/factories/controllers/login/singup/signup-validation-factory';
import { makeSendEmailConfirmAccount } from '@/main/factories/usescases/account/confirm-email-account/send-email-confirm-account-factory';
import env from '@/main/config/env';


export const makeSignUpController = (): Controller => makeLogControlleDecorator(
  new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeSendEmailConfirmAccount(),
    env.baseUrlFront,
  ),
);
