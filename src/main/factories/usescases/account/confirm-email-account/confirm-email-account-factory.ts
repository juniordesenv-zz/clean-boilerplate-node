import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { DbConfirmEmailAccount } from '@/data/usecases/account/confirm-email-account/db-confirm-email-account';
import { ConfirmEmailAccountByConfirmEmailToken } from '@/domain/usecases/account/confirm-email-account-by-confirm-token';


export const makeConfirmEmailAccount = (): ConfirmEmailAccountByConfirmEmailToken => {
  const accountMongoRepository = new AccountMongoRepository();
  return new DbConfirmEmailAccount(
    accountMongoRepository,
  );
};
