import { Controller } from '@/presentation/protocols';
import { makeLogControlleDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { SignUpController } from '@/presentation/controllers/authentication/signup/signup-controller';
import { makeDbAddAccount } from '@/main/factories/usescases/account/add-account/db-add-account-factory';
import { makeSignUpValidation } from '@/main/factories/controllers/login/singup/signup-validation-factory';
import { makeDbAuthentication } from '@/main/factories/usescases/account/authentication/db-authentication-factory';


export const makeSignUpController = (): Controller => makeLogControlleDecorator(
  new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication(),
  ),
);
