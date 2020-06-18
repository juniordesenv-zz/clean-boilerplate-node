export interface UpdatePasswordProfile {
  update (accountId: string, password: string): Promise<boolean>
}
