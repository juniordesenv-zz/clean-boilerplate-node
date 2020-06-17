export type SendLinkResetPasswordParams = {
  name: string;
  email: string;
  token: string;
  baseUrlFront: string;
};

export interface SendLinkResetPassword {
  sendMail (data: SendLinkResetPasswordParams): Promise<void>
}
