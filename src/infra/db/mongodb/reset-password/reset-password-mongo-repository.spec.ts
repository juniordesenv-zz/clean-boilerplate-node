import { Collection } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import * as faker from 'faker';
import { AccountModel } from '@/domain/models';
import { mockAddAccountParams } from '@/domain/test';
import { ResetPasswordMongoRepository } from './reset-password-mongo-repository';

let resetPasswordCollection: Collection;
let accountCollection: Collection;

const makeSut = (): ResetPasswordMongoRepository => new ResetPasswordMongoRepository();

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams());
  return MongoHelper.map(res.ops[0]);
};

describe('Reset Password Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    resetPasswordCollection = await MongoHelper.getCollection('resetPasswords');
    await resetPasswordCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });


  describe('add()', () => {
    test('Should return an resetPassword on add success', async () => {
      const sut = makeSut();
      const account = await mockAccount();
      const isEnabled = true;
      const expiredAt = new Date();
      const token = faker.random.uuid();
      const resetPassword = await sut.add({
        createdAt: new Date(),
        accountId: account.id,
        isEnabled,
        expiredAt,
        token,
      });
      expect(resetPassword).toBeTruthy();
      expect(resetPassword.id).toBeTruthy();
      expect(resetPassword.token).toBe(token);
      expect(resetPassword.isEnabled).toBe(isEnabled);
      expect(resetPassword.expiredAt).toBe(expiredAt);
    });
  });

  describe('loadByTokenNotExpired()', () => {
    test('Should return an reset password on loadByTokenNotExpired', async () => {
      const sut = makeSut();
      const account = await mockAccount();
      const isEnabled = true;
      const expiredAt = faker.date.future();
      const token = faker.random.uuid();
      await resetPasswordCollection.insertOne({
        accountId: account.id,
        isEnabled,
        expiredAt,
        token,
      });
      const resetPassword = await sut.loadByTokenNotExpired(token);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(resetPassword.accountId).toEqual(account.id);
      expect(resetPassword.isEnabled).toBe(true);
      expect(resetPassword.expiredAt).toEqual(expiredAt);
    });


    test('Should return null if loadByTokenNotExpired token is expired', async () => {
      const sut = makeSut();
      const account = await mockAccount();
      const isEnabled = true;
      const expiredAt = faker.date.past(1900);
      const token = faker.random.uuid();
      await resetPasswordCollection.insertOne({
        accountId: account.id,
        isEnabled,
        expiredAt,
        token,
      });
      const resetPassword = await sut.loadByTokenNotExpired(token);
      expect(resetPassword).toBeFalsy();
    });

    test('Should return null if loadByTokenNotExpired token is not enabled', async () => {
      const sut = makeSut();
      const account = await mockAccount();
      const isEnabled = false;
      const expiredAt = faker.date.future();
      const token = faker.random.uuid();
      await resetPasswordCollection.insertOne({
        accountId: account.id,
        isEnabled,
        expiredAt,
        token,
      });
      const resetPassword = await sut.loadByTokenNotExpired(token);
      expect(resetPassword).toBeFalsy();
    });

    test('Should return null if loadByTokenNotExpired not found', async () => {
      const sut = makeSut();
      const resetPassword = await sut.loadByTokenNotExpired(faker.random.uuid());
      expect(resetPassword).toBeFalsy();
    });
  });


  describe('disableAllByAccount()', () => {
    test('Should disable all reset password by account on disableAllByAccount', async () => {
      const sut = makeSut();
      const account = await mockAccount();
      const isEnabled = true;
      const expiredAt = faker.date.future();
      await resetPasswordCollection.insertMany([
        {
          accountId: account.id,
          isEnabled,
          expiredAt,
          token: faker.random.uuid(),
        },
        {
          accountId: account.id,
          isEnabled,
          expiredAt,
          token: faker.random.uuid(),
        },
      ]);
      await sut.disableAllByAccount(account.id);
      const allResetPasswords = await resetPasswordCollection.find({}).toArray();
      expect(allResetPasswords.length).toBe(2);
      allResetPasswords.forEach((resetPassword) => {
        expect(resetPassword.isEnabled).toBeFalsy();
      });
    });
  });
});
