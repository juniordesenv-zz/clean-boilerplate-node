import { ResetPasswordModel } from '@/domain/models/reset-password';

export type AddResetPasswordParams = Omit<ResetPasswordModel, 'id'>;

export interface AddResetPasswordModel {
  add (resetPassword: AddResetPasswordParams): Promise<ResetPasswordModel>
}
