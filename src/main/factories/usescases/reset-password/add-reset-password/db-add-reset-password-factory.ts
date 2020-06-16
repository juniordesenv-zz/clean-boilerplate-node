import { UuidAdapter } from '@/infra/uuid/uuid.adapter';
import { AddResetPassword } from '@/domain/usecases/reset-password/add-reset-password';
import { ResetPasswordMongoRepository } from '@/infra/db/mongodb/reset-password/reset-password-mongo-repository';
import { DbAddResetPassword } from '@/data/usecases/reset-password/add-reset-password/db-add-reset-password-t';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { DateFnsAdapter } from '@/infra/date/date-fns-adapter/date-fns-adapter';


export const makeDbAddResetPassword = (): AddResetPassword => {
  const accountMongoRepository = new AccountMongoRepository();
  const resetPasswordMongoRepository = new ResetPasswordMongoRepository();
  const uuidAdapter = new UuidAdapter();
  const dateFnsAdapter = new DateFnsAdapter();
  return new DbAddResetPassword(
    accountMongoRepository,
    resetPasswordMongoRepository,
    uuidAdapter,
    dateFnsAdapter,
  );
};
