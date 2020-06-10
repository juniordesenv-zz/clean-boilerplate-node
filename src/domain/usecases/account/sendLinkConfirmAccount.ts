export type SendLinkConfirmAccountParams = {
  name: string;
  email: string;
  confirmToken: string;
  baseUrlFront: string;
};

export interface SendLinkConfirmAccount {
  sendMail (data: SendLinkConfirmAccountParams): Promise<void>
}
