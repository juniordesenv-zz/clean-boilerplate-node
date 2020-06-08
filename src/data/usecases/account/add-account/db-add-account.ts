import { Hasher } from '@/data/protocols/cryptography/hasher';
import { AccountModel } from '@/domain/models';
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/addAccount';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async add(accountData: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
    if (account) return null;
    const hashedPassword = await this.hasher.hash(accountData.password);
    const newAccount = await this.addAccountRepository.add({
      ...accountData, password: hashedPassword,
    });
    return newAccount;
  }
}
