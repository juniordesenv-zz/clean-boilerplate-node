import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import {
  AddResetPasswordRepository,
  AddResetPasswordRepositoryParams,
} from '@/data/protocols/db/reset-password/add-reset-password-repository';
import { ResetPasswordModel } from '@/domain/models/reset-password';
import { LoadResetPasswordByTokenNotExpiredRepository } from '@/data/protocols/db/reset-password/load-reset-password-by-token-not-expired-repository';
import { DisableAllResetPasswordByAccountRepository } from '@/data/protocols/db/reset-password/disable-all-reset-password-by-account-repository';

export class ResetPasswordMongoRepository implements
  AddResetPasswordRepository,
  LoadResetPasswordByTokenNotExpiredRepository,
  DisableAllResetPasswordByAccountRepository {
  async add(resetPasswordData: AddResetPasswordRepositoryParams): Promise<ResetPasswordModel> {
    const resetPasswordCollection = await MongoHelper.getCollection('resetPasswords');
    const result = await resetPasswordCollection.insertOne(resetPasswordData);
    const resetPassword = result.ops[0];
    return MongoHelper.map(resetPassword);
  }

  async loadByTokenNotExpired(token: string): Promise<ResetPasswordModel> {
    const resetPasswordCollection = await MongoHelper.getCollection('resetPasswords');
    const resetPassword = await resetPasswordCollection.findOne({
      token,
      isEnabled: true,
      expiredAt: {
        $gte: new Date(),
      },
    });
    return resetPassword && MongoHelper.map(resetPassword);
  }

  async disableAllByAccount(accountId: string): Promise<void> {
    const resetPasswordCollection = await MongoHelper.getCollection('resetPasswords');
    await resetPasswordCollection
      .updateMany({
        accountId,
      }, {
        $set: {
          isEnabled: false,
        },
      });
  }
}
