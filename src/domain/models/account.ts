export type AccountModel = {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmEmailToken?: string;
  confirmedEmail: boolean;
};
