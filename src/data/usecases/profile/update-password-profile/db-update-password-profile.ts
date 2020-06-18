import { UpdatePasswordProfile } from '@/domain/usecases/profile/update-password-profile';
import { Hasher } from '@/data/protocols/cryptography/hasher';
import { ChangePasswordAccountByIdRepository } from '@/data/protocols/db/account/change-password-account-by-id-repository';

export class DbUpdatePasswordProfile implements UpdatePasswordProfile {
  constructor(
    private readonly hasher: Hasher,
    private readonly changePasswordAccountByIdRepository:
    ChangePasswordAccountByIdRepository,
  ) {
  }

  async update(accountId: string, password: string): Promise<boolean> {
    const hashedPassword = await this.hasher.hash(password);
    return this.changePasswordAccountByIdRepository.changePasswordById(
      accountId,
      hashedPassword,
    );
  }
}
