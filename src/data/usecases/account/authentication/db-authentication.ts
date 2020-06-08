import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication';
import { Encrypter } from '@/data/protocols/cryptography/encrypter';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { AuthenticationModel } from '@/domain/models';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(authentication: AuthenticationParams): Promise<AuthenticationModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password);
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
        return {
          accessToken,
          name: account.name,
        };
      }
    }
    return null;
  }
}
