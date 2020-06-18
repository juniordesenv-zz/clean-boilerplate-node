import { ProfileModel } from '@/domain/models';

export type UpdateProfileParams = {
  name: string;
  email: string;
};

export interface UpdateProfile {
  update (accountId: string, updateProfileData: UpdateProfileParams): Promise<ProfileModel>
}
