export interface ChangePasswordAccountByIdRepository {
  changePasswordById (accountId: string, hashedPassword: string): Promise<boolean>
}
