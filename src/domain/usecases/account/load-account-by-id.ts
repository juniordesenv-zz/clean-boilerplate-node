import { AccountModel } from '@/domain/models';

export interface LoadAccountById {
  load (accountId: string): Promise<AccountModel>
}
