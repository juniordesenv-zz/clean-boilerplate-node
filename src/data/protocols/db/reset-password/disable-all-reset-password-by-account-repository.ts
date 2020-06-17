export interface DisableAllResetPasswordByAccountRepository {
  disableAllByAccount(accountId: string): Promise<void>
}
