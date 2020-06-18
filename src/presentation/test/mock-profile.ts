// eslint-disable-next-line max-classes-per-file
import { UpdateProfile, UpdateProfileParams } from '@/domain/usecases/profile/update-profile';
import { ProfileModel } from '@/domain/models';
import { mockProfileModel } from '@/domain/test/mock-profile';
import { UpdatePasswordProfile } from '@/domain/usecases/profile/update-password-profile';

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


export class UpdatePasswordProfileSpy
implements UpdatePasswordProfile {
  accountId: string;

  password: string;

  changed: boolean = true;

  async update(accountId: string, password: string): Promise<boolean> {
    this.accountId = accountId;
    this.password = password;
    return this.changed;
  }
}
