import { ShowProfile } from '@/domain/usecases/profile/show-profile';
import { DbShowProfile } from '@/data/usecases/profile/show-profile/db-show-profile';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';


export const makeDbShowProfile = (): ShowProfile => {
  const accountMongoRepository = new AccountMongoRepository();
  return new DbShowProfile(
    accountMongoRepository,
  );
};
