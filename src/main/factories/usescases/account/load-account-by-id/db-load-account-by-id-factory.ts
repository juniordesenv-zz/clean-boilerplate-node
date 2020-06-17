import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { LoadAccountById } from '@/domain/usecases/account/load-account-by-id';
import { DbLoadAccountById } from '@/data/usecases/account/load-account-by-id/db-load-account-by-id';

export const makeDbLoadAccountById = (): LoadAccountById => {
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountById(accountMongoRepository);
};
