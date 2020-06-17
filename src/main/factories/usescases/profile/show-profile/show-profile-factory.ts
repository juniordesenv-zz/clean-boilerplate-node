import { ShowProfile } from '@/domain/usecases/profile/show-profile';
import { DbShowProfile } from '@/data/usecases/profile/show-profile/db-show-profile';
import { makeDbLoadAccountById } from '@/main/factories/usescases/account/load-account-by-id/db-load-account-by-id-factory';


export const makeShowProfile = (): ShowProfile => new DbShowProfile(
  makeDbLoadAccountById(),
);
