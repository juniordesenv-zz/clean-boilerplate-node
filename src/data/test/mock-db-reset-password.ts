// eslint-disable-next-line max-classes-per-file
import {
  AddResetPasswordRepository,
  AddResetPasswordRepositoryParams,
} from '@/data/protocols/db/reset-password/add-reset-password-repository';
import { ResetPasswordModel } from '@/domain/models/reset-password';
import { mockResetPasswordModel } from '@/domain/test/mock-reset-password';
import { LoadResetPasswordByTokenNotExpiredRepository } from '@/data/protocols/db/reset-password/load-reset-password-by-token-not-expired-repository';
import { DisableAllResetPasswordByAccountRepository } from '@/data/protocols/db/reset-password/disable-all-reset-password-by-account-repository';


export class AddResetPasswordRepositorySpy implements AddResetPasswordRepository {
  resetPasswordModel = mockResetPasswordModel();

  addResetPasswordParams: AddResetPasswordRepositoryParams;

  async add(data: AddResetPasswordRepositoryParams): Promise<ResetPasswordModel> {
    this.addResetPasswordParams = data;
    return this.resetPasswordModel;
  }
}


export class LoadResetPasswordByTokenNotExpiredRepositorySpy implements
  LoadResetPasswordByTokenNotExpiredRepository {
  resetPasswordModel = mockResetPasswordModel();

  token: string;

  async loadByTokenNotExpired(token: string): Promise<ResetPasswordModel> {
    this.token = token;
    return this.resetPasswordModel;
  }
}

export class DisableAllResetPasswordByAccountRepositorySpy implements
  DisableAllResetPasswordByAccountRepository {
  callsCount = 0;

  accountId: string;

  async disableAllByAccount(accountId: string): Promise<void> {
    this.accountId = accountId;
    this.callsCount += 1;
  }
}
