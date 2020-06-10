// eslint-disable-next-line max-classes-per-file
import faker from 'faker';
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication';
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/addAccount';
import { AccountModel, AuthenticationModel } from '@/domain/models';
import { mockAccountModel } from '@/domain/test';
import { LoadAccountByToken } from '@/domain/usecases/account/loadAccountByToken';
import { SendLinkConfirmAccount, SendLinkConfirmAccountParams } from '@/domain/usecases/account/sendLinkConfirmAccount';

export class AddAccountSpy implements AddAccount {
  accountModel = mockAccountModel();

  addAccountParams: AddAccountParams;

  async add(account: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = account;
    return this.accountModel;
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams;

  authenticationModel = {
    accessToken: faker.random.uuid(),
    name: faker.name.findName(),
  };

  async auth(authenticationParams: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = authenticationParams;
    return this.authenticationModel;
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel = mockAccountModel();

  accessToken: string;

  role: string;

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken;
    this.role = role;
    return this.accountModel;
  }
}

export class SendLinkConfirmAccountSpy implements SendLinkConfirmAccount {
  sendLinkConfirmAccountParams: SendLinkConfirmAccountParams;

  sendMail(data: SendLinkConfirmAccountParams): Promise<void> {
    this.sendLinkConfirmAccountParams = data;
    return Promise.resolve(undefined);
  }
}
