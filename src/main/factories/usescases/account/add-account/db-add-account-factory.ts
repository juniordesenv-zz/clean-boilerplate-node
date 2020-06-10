import { AddAccount } from '@/domain/usecases/account/addAccount';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account';
import { UuidAdapter } from '@/infra/uuid/uuid.adapter';


export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const uuidAdapter = new UuidAdapter();
  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository,
    uuidAdapter,
  );
};
