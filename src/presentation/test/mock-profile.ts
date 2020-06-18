// eslint-disable-next-line max-classes-per-file
import { UpdateProfile, UpdateProfileParams } from '@/domain/usecases/profile/update-profile';
import { ProfileModel } from '@/domain/models';
import { mockProfileModel } from '@/domain/test/mock-profile';

export class UpdateProfileSpy
implements UpdateProfile {
  profileModel: ProfileModel = mockProfileModel();

  accountId: string;

  updateProfileData: UpdateProfileParams;

  async update(accountId: string, updateProfileData: UpdateProfileParams): Promise<ProfileModel> {
    this.accountId = accountId;
    this.updateProfileData = updateProfileData;
    return this.profileModel;
  }
}
