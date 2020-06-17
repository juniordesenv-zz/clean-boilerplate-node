import { AccountModel } from '@/domain/models';
import { LoadAccountById } from '@/domain/usecases/account/load-account-by-id';
import { LoadAccountByIdRepository } from '@/data/protocols/db/account/load-account-by-id-repository';

export class DbLoadAccountById implements LoadAccountById {
  constructor(
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
  ) {
  }

  async load(accountId: string): Promise<AccountModel> {
    const account = await this.loadAccountByIdRepository.loadById(accountId);
    if (account) return account;
    return null;
  }
}
