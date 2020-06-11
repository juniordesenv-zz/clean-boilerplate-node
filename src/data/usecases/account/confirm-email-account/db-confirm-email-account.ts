import { ConfirmEmailAccountByConfirmEmailToken } from '@/domain/usecases/account/confirm-email-account-by-confirm-token';
import { ConfirmEmailAccountByConfirmTokenRepository } from '@/data/protocols/db/account/confirm-email-account-by-confirm-token-repository';

export class DbConfirmEmailAccount implements ConfirmEmailAccountByConfirmEmailToken {
  constructor(
    private readonly confirmEmailAccountByConfirmTokenRepository:
    ConfirmEmailAccountByConfirmTokenRepository,
  ) {
  }

  async confirmEmail(confirmEmailToken: string): Promise<boolean> {
    return this.confirmEmailAccountByConfirmTokenRepository
      .confirmEmailByConfirmToken(confirmEmailToken);
  }
}
