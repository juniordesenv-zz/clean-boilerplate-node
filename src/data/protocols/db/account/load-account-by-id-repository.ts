import { AccountModel } from '@/domain/models';

export interface LoadAccountByIdRepository {
  loadById(accountId: string): Promise<AccountModel>
}
