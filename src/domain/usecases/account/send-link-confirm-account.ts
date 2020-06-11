export type SendLinkConfirmAccountParams = {
  name: string;
  email: string;
  confirmEmailToken: string;
  baseUrlFront: string;
};

export interface SendLinkConfirmAccount {
  sendMail (data: SendLinkConfirmAccountParams): Promise<void>
}
