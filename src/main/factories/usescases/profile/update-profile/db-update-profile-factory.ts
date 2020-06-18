import { UpdateProfile } from '@/domain/usecases/profile/update-profile';
import { DbUpdateProfile } from '@/data/usecases/profile/update-profile/db-update-profile';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';


export const makeDbUpdateProfile = (): UpdateProfile => {
  const accountMongoRepository = new AccountMongoRepository();
  return new DbUpdateProfile(
    accountMongoRepository,
    accountMongoRepository,
  );
};
