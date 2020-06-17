export interface ChangePasswordAccountById {
  change (accountId: string, password: string): Promise<boolean>
}
