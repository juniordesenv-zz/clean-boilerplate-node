import { ResetPasswordModel } from '@/domain/models/reset-password';
import { AccountModel } from '@/domain/models';

export type AddResetPasswordParams = {
  email: string;
  createdAt: Date;
};

export type AddResetPasswordResult = ResetPasswordModel & {
  account: AccountModel;
};

export interface AddResetPassword {
  add (resetPassword: AddResetPasswordParams): Promise<AddResetPasswordResult>
}
