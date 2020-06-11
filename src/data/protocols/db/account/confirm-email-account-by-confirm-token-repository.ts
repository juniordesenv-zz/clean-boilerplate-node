export interface ConfirmEmailAccountByConfirmTokenRepository {
  confirmEmailByConfirmToken (confirmEmailToken: string): Promise<boolean>
}
