import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { ChangePasswordAccountById } from '@/domain/usecases/account/change-password-account-by-id';
import { DbChangePasswordAccountById } from '@/data/usecases/account/change-password-account-by-id/db-change-password-account-by-id';


export const makeDbChangePasswordAccountById = (): ChangePasswordAccountById => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbChangePasswordAccountById(
    bcryptAdapter,
    accountMongoRepository,
  );
};
