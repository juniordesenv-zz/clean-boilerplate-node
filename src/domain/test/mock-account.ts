import faker from 'faker';
import { AccountModel } from '@/domain/models';
import { AddAccountParams } from '@/domain/usecases/account/addAccount';
import { AuthenticationParams } from '@/domain/usecases/account/authentication';
import { SendLinkConfirmAccountParams } from '@/domain/usecases/account/sendLinkConfirmAccount';

export const mockAddAccountParams = (): AddAccountParams => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  confirmedEmail: true,
});

export const mockAccountModel = (): AccountModel => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  confirmedEmail: true,
});

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockSendLinkConfirmAccountParams = (): SendLinkConfirmAccountParams => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  confirmToken: faker.random.uuid(),
  baseUrlFront: faker.internet.url(),
});
