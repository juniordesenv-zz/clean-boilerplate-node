import faker from 'faker';
import { AddResetPasswordParams } from '@/domain/usecases/reset-password/add-reset-password';
import { ResetPasswordModel } from '@/domain/models/reset-password';
import { SendLinkResetPasswordParams } from '@/domain/usecases/reset-password/send-link-reset-password';

export const mockAddResetPasswordParams = (): AddResetPasswordParams => ({
  email: faker.internet.email(),
  token: faker.random.uuid(),
  isEnabled: true,
  expiredAt: faker.date.future(),
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
