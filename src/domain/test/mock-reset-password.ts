import faker from 'faker';
import { AddResetPasswordParams, AddResetPasswordResult } from '@/domain/usecases/reset-password/add-reset-password';
import { ResetPasswordModel } from '@/domain/models/reset-password';
import { SendLinkResetPasswordParams } from '@/domain/usecases/reset-password/send-link-reset-password';
import { mockAccountModel } from '@/domain/test/mock-account';
import { ApplyResetPasswordParams } from '@/domain/usecases/reset-password/apply-reset-password';

export const mockAddResetPasswordParams = (): AddResetPasswordParams => ({
  email: faker.internet.email(),
  createdAt: faker.date.past(),
});

export const mockResetPasswordModel = (): ResetPasswordModel => ({
  id: faker.random.uuid(),
  accountId: faker.random.uuid(),
  token: faker.random.uuid(),
  isEnabled: true,
  expiredAt: faker.date.future(),
  createdAt: faker.date.past(),
});

export const mockSendLinkResetPasswordParams = (): SendLinkResetPasswordParams => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  token: faker.random.uuid(),
  baseUrlFront: faker.internet.url(),
});

export const mockResetPasswordResult = (): AddResetPasswordResult => ({
  id: faker.random.uuid(),
  accountId: faker.random.uuid(),
  token: faker.random.uuid(),
  isEnabled: true,
  expiredAt: faker.date.future(),
  createdAt: faker.date.past(),
  account: mockAccountModel(),
});


export const mockApplyResetPasswordParams = (): ApplyResetPasswordParams => ({
  password: faker.internet.password(),
  token: faker.random.uuid(),
});
