import { Controller } from '@/presentation/protocols';
import { makeLogControlleDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { ConfirmEmailController } from '@/presentation/controllers/authentication/confirm-email/confirm-email-controller';
import { makeConfirmEmailAccount } from '@/main/factories/usescases/account/confirm-email-account/confirm-email-account-factory';

export const makeConfirmEmailController = (): Controller => makeLogControlleDecorator(
  new ConfirmEmailController(
    makeConfirmEmailAccount(),
  ),
);
