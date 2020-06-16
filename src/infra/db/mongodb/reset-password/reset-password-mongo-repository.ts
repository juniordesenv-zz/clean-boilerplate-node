import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import {
  AddResetPasswordRepository,
  AddResetPasswordRepositoryParams,
} from '@/data/protocols/db/reset-password/add-reset-password-repository';
import { ResetPasswordModel } from '@/domain/models/reset-password';

export class ResetPasswordMongoRepository implements
  AddResetPasswordRepository {
  async add(resetPasswordData: AddResetPasswordRepositoryParams): Promise<ResetPasswordModel> {
    const resetPasswordCollection = await MongoHelper.getCollection('resetPasswords');
    const result = await resetPasswordCollection.insertOne(resetPasswordData);
    const resetPassword = result.ops[0];
    return MongoHelper.map(resetPassword);
  }
}
