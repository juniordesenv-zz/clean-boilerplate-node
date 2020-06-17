import { ShowProfile } from '@/domain/usecases/profile/show-profile';
import { ProfileModel } from '@/domain/models';
import { LoadAccountById } from '@/domain/usecases/account/load-account-by-id';

export class DbShowProfile implements ShowProfile {
  constructor(private readonly loadAccountById: LoadAccountById) {
  }

  async show(accountId: string): Promise<ProfileModel> {
    const account = await this.loadAccountById.load(accountId);
    if (!account) return null;
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
