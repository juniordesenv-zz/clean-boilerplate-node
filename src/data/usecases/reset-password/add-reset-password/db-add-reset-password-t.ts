import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import {
  AddResetPassword,
  AddResetPasswordParams,
  AddResetPasswordResult,
} from '@/domain/usecases/reset-password/add-reset-password';
import { AddResetPasswordRepository } from '@/data/protocols/db/reset-password/add-reset-password-repository';
import { UuidV4 } from '@/data/protocols/uuid/uuid-v4';
import { IncrementDate } from '@/data/protocols/date/increment-date';

export class DbAddResetPassword implements AddResetPassword {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly addResetPasswordRepository: AddResetPasswordRepository,
    private readonly uuid: UuidV4,
    private readonly incrementDate: IncrementDate,
  ) {

  }

  async add(resetPasswordParams: AddResetPasswordParams): Promise<AddResetPasswordResult> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(resetPasswordParams.email);
    if (!account) return null;
    const token = this.uuid.v4();
    const expiredAt = this.incrementDate.add(new Date(), {
      hours: 8,
    });
    const resetPassword = await this.addResetPasswordRepository.add({
      ...resetPasswordParams,
      accountId: account.id,
      isEnabled: true,
      expiredAt,
      token,
    });
    return {
      ...resetPassword,
      account,
    };
  }
}
