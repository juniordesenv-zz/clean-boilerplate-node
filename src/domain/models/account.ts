export type AccountModel = {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmToken?: string;
  confirmedEmail: boolean;
};
