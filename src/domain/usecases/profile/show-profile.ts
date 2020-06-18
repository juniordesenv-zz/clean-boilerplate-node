import { ProfileModel } from '@/domain/models';

export interface ShowProfile {
  show (accountId: string): Promise<ProfileModel>
}
