import { ProfileModel } from '@/domain/models';
import { UpdateProfile, UpdateProfileParams } from '@/domain/usecases/profile/update-profile';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { UpdateProfileRepository } from '@/data/protocols/db/account/update-profile-repository';

export class DbUpdateProfile implements UpdateProfile {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly updateProfileRepository: UpdateProfileRepository,
  ) {
  }

  async update(accountId: string, updateProfileData: UpdateProfileParams): Promise<ProfileModel> {
    const accountEmail = await this.loadAccountByEmailRepository
      .loadByEmail(updateProfileData.email);
    if (accountEmail && accountEmail.id !== accountId) return null;
    const account = await this.updateProfileRepository.updateProfile(accountId, updateProfileData);
    const {
      name,
      email,
    } = account;
    return {
      name,
      email,
    };
  }
}
