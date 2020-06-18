import { ShowProfile } from '@/domain/usecases/profile/show-profile';
import { ProfileModel } from '@/domain/models';
import { LoadAccountByIdRepository } from '@/data/protocols/db/account/load-account-by-id-repository';

export class DbShowProfile implements ShowProfile {
  constructor(private readonly loadAccountByIdRepository: LoadAccountByIdRepository) {
  }

  async show(accountId: string): Promise<ProfileModel> {
    const account = await this.loadAccountByIdRepository.loadById(accountId);
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
