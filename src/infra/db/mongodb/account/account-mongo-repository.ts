import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { AccountModel } from '@/domain/models';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { ConfirmEmailAccountByConfirmTokenRepository } from '@/data/protocols/db/account/confirm-email-account-by-confirm-token-repository';
import { FindAndModifyWriteOpResultObject } from 'mongodb';

export class AccountMongoRepository implements AddAccountRepository,
            LoadAccountByEmailRepository,
            UpdateAccessTokenRepository,
  ConfirmEmailAccountByConfirmTokenRepository {
  async add(accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const account = result.ops[0];
    return MongoHelper.map(account);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.map(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne({
      _id: id,
    }, {
      $set: {
        accessToken: token,
      },
    });
  }

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role,
      }, {
        role: 'admin',
      }],
    });
    return account && MongoHelper.map(account);
  }

  async confirmEmailByConfirmToken(confirmEmailToken: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    if (!confirmEmailToken) return false;
    const { value }: FindAndModifyWriteOpResultObject<AccountModel> = await accountCollection
      .findOneAndUpdate({
        confirmEmailToken,
      }, {
        $set: {
          confirmedEmail: true,
          confirmEmailToken: undefined,
        },
      }, {
        returnOriginal: false,
      });
    return !!value?.confirmedEmail;
  }
}
