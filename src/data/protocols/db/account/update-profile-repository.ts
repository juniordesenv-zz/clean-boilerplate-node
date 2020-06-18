import { UpdateProfileParams } from '@/domain/usecases/profile/update-profile';
import { AccountModel } from '@/domain/models';

export interface UpdateProfileRepository {
  updateProfile (accountId: string, updateProfileData: UpdateProfileParams): Promise<AccountModel>
}
