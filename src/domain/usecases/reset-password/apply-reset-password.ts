export type ApplyResetPasswordParams = {
  token: string;
  password: string;
};


export interface ApplyResetPassword {
  apply (applyResetPassword: ApplyResetPasswordParams): Promise<boolean>
}
