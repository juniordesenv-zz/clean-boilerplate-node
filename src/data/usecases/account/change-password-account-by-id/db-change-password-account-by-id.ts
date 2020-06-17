import { ChangePasswordAccountById } from '@/domain/usecases/account/change-password-account-by-id';
import { ChangePasswordAccountByIdRepository } from '@/data/protocols/db/account/change-password-account-by-id-repository';
import { Hasher } from '@/data/protocols/cryptography/hasher';

export class DbChangePasswordAccountById implements ChangePasswordAccountById {
  constructor(
    private readonly hasher: Hasher,
    private readonly changePasswordAccountByIdRepository:
    ChangePasswordAccountByIdRepository,
  ) {
  }

  async change(accountId: string, password: string): Promise<boolean> {
    const hashedPassword = await this.hasher.hash(password);
    return this.changePasswordAccountByIdRepository
      .changePasswordById(accountId, hashedPassword);
  }
}
