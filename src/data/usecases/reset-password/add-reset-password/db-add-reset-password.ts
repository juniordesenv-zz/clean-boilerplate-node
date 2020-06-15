import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import {
  AddResetPassword,
  AddResetPasswordParams,
  AddResetPasswordResult,
} from '@/domain/usecases/reset-password/add-reset-password';
import { AddResetPasswordRepository } from '@/data/protocols/db/reset-password/add-reset-password-repository';

export class DbAddResetPassword implements AddResetPassword {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly addResetPasswordRepository: AddResetPasswordRepository,
  ) {

  }

  async add(resetPasswordParams: AddResetPasswordParams): Promise<AddResetPasswordResult> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(resetPasswordParams.email);
    if (!account) return null;
    const resetPassword = await this.addResetPasswordRepository.add({
      ...resetPasswordParams,
      accountId: account.id,
    });
    return {
      ...resetPassword,
      account,
    };
  }
}
