import { Controller } from '@/presentation/protocols';
import { makeDbAuthentication } from '@/main/factories/usescases/account/authentication/db-authentication-factory';
import { makeLoginValidation } from '@/main/factories/controllers/authentication/login/login-validation-factory';
import { makeLogControlleDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { LoginController } from '@/presentation/controllers/authentication/login/login-controller';

export const makeLoginController = (): Controller => makeLogControlleDecorator(
  new LoginController(
    makeDbAuthentication(),
    makeLoginValidation(),
  ),
);
