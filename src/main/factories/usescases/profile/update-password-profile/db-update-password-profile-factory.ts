import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { UpdatePasswordProfile } from '@/domain/usecases/profile/update-password-profile';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { DbUpdatePasswordProfile } from '@/data/usecases/profile/update-password-profile/db-update-password-profile';


export const makeDbUpdatePasswordProfile = (): UpdatePasswordProfile => {
  const accountMongoRepository = new AccountMongoRepository();
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  return new DbUpdatePasswordProfile(
    bcryptAdapter,
    accountMongoRepository,
  );
};
