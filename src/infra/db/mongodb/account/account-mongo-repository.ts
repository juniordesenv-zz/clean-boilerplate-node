import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { AccountModel } from '@/domain/models';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { ConfirmEmailAccountByConfirmTokenRepository } from '@/data/protocols/db/account/confirm-email-account-by-confirm-token-repository';
import { FindAndModifyWriteOpResultObject, ObjectId } from 'mongodb';
import { ChangePasswordAccountByIdRepository } from '@/data/protocols/db/account/change-password-account-by-id-repository';
import { LoadAccountByIdRepository } from '@/data/protocols/db/account/load-account-by-id-repository';
import { UpdateProfileRepository } from '@/data/protocols/db/account/update-profile-repository';
import { UpdateProfileParams } from '@/domain/usecases/profile/update-profile';


export class AccountMongoRepository implements AddAccountRepository,
            LoadAccountByEmailRepository,
            UpdateAccessTokenRepository,
            ConfirmEmailAccountByConfirmTokenRepository,
            ChangePasswordAccountByIdRepository,
            LoadAccountByIdRepository,
            UpdateProfileRepository {
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

  async updateAccessToken(accountId: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne({
      _id: new ObjectId(accountId),
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

  async changePasswordById(accountId: string, hashedPassword: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { value }: FindAndModifyWriteOpResultObject<AccountModel> = await accountCollection
      .findOneAndUpdate({
        _id: new ObjectId(accountId),
      }, {
        $set: {
          password: hashedPassword,
        },
      }, {
        returnOriginal: false,
      });
    return !!value;
  }

  async loadById(accountId: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({
      _id: new ObjectId(accountId),
    });
    return account && MongoHelper.map(account);
  }

  async updateProfile(accountId: string,
    updateProfileData: UpdateProfileParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { value }: FindAndModifyWriteOpResultObject<AccountModel> = await accountCollection
      .findOneAndUpdate({
        _id: new ObjectId(accountId),
      }, {
        $set: updateProfileData,
      }, {
        returnOriginal: false,
      });
    return value || null;
  }
}
