import { ResetPasswordModel } from '@/domain/models/reset-password';

export type AddResetPasswordRepositoryParams = Omit<ResetPasswordModel, 'id'>;

export interface AddResetPasswordRepository {
  add(resetPasswordData: AddResetPasswordRepositoryParams): Promise<ResetPasswordModel>
}
