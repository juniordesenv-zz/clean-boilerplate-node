export type ResetPasswordModel = {
  id: string;
  accountId: string;
  token: string;
  isEnabled: boolean;
  expiredAt: Date;
  createdAt: Date;
};
