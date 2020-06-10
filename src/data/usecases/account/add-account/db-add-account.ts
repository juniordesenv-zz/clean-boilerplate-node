import { Hasher } from '@/data/protocols/cryptography/hasher';
import { AccountModel } from '@/domain/models';
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/addAccount';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { UuidV4 } from '@/data/protocols/uuid/uuid-v4';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly uuid: UuidV4,
  ) {}

  async add(accountData: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
    if (account) return null;
    const hashedPassword = await this.hasher.hash(accountData.password);
    const confirmToken = this.uuid.v4();
    const newAccount = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
      confirmToken,
    });
    return newAccount;
  }
}
