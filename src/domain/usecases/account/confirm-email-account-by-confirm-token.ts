export interface ConfirmEmailAccountByConfirmEmailToken {
  confirmEmail (confirmEmailToken: string): Promise<boolean>
}
