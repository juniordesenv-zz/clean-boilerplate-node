import { ResetPasswordModel } from '@/domain/models/reset-password';

export interface LoadResetPasswordByTokenNotExpiredRepository {
  loadByTokenNotExpired(token: string): Promise<ResetPasswordModel>
}
