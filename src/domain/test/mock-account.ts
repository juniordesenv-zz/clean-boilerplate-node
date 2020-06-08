import * as faker from 'faker';
import { AccountModel } from '@/domain/models';
import { AddAccountParams } from '@/domain/usecases/account/addAccount';
import { AuthenticationParams } from '@/domain/usecases/account/authentication';

export const mockAddAccountParams = (): AddAccountParams => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAccountModel = (): AccountModel => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});
