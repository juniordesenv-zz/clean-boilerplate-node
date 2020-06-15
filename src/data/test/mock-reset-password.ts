import {
  AddResetPasswordRepository,
  AddResetPasswordRepositoryParams,
} from '@/data/protocols/db/reset-password/add-reset-password-repository';
import { ResetPasswordModel } from '@/domain/models/reset-password';
import { mockResetPasswordModel } from '@/domain/test/mock-reset-password';


export class AddResetPasswordRepositorySpy implements AddResetPasswordRepository {
  resetPasswordModel = mockResetPasswordModel();

  addResetPasswordParams: AddResetPasswordRepositoryParams;

  async add(data: AddResetPasswordRepositoryParams): Promise<ResetPasswordModel> {
    this.addResetPasswordParams = data;
    return this.resetPasswordModel;
  }
}
