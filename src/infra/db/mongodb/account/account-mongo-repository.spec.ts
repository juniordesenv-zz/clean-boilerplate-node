import { Collection } from 'mongodb';
import faker from 'faker';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { mockAddAccountParams } from '@/domain/test';

let accountCollection: Collection;

const makeSut = (): AccountMongoRepository => new AccountMongoRepository();

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });


  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      const account = await sut.add(addAccountParams);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });
  });

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne(addAccountParams);
      const account = await sut.loadByEmail(addAccountParams.email);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });


    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail(faker.internet.email());
      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const res = await accountCollection.insertOne(mockAddAccountParams());
      const fakeAccount = res.ops[0];
      expect(fakeAccount.accessToken).toBeFalsy();
      const accessToken = faker.random.uuid();
      await sut.updateAccessToken(fakeAccount._id, accessToken);
      const account = await accountCollection.findOne({ _id: fakeAccount._id });
      expect(account).toBeTruthy();
      expect(account.accessToken).toBe(accessToken);
    });
  });

  describe('loadByToken()', () => {
    let name = faker.name.findName();
    let email = faker.internet.email();
    let password = faker.internet.password();
    let accessToken = faker.random.uuid();

    beforeEach(() => {
      name = faker.name.findName();
      email = faker.internet.email();
      password = faker.internet.password();
      accessToken = faker.random.uuid();
    });

    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
      expect(account.password).toBe(password);
    });

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken, 'admin');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
      expect(account.password).toBe(password);
    });

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken, 'admin');
      expect(account).toBeFalsy();
    });

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
      expect(account.password).toBe(password);
    });

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeFalsy();
    });
  });

  describe('confirmEmailByConfirmToken()', () => {
    let name = faker.name.findName();
    let email = faker.internet.email();
    let password = faker.internet.password();
    let confirmEmailToken = faker.random.uuid();

    beforeEach(() => {
      name = faker.name.findName();
      email = faker.internet.email();
      password = faker.internet.password();
      confirmEmailToken = faker.random.uuid();
    });

    test('Should return true if confirmEmailByConfirmToken find and update confirmedEmail is true', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        confirmEmailToken,
      });
      const isConfrimed = await sut.confirmEmailByConfirmToken(confirmEmailToken);
      expect(isConfrimed).toBe(true);
    });

    test('Should return false if confirmEmailByConfirmToken is called with confirmEmailToken equals null', async () => {
      const sut = makeSut();
      const isConfrimed = await sut.confirmEmailByConfirmToken(null);
      expect(isConfrimed).toBe(false);
    });

    test('Should return false if confirmEmailByConfirmToken fails', async () => {
      const sut = makeSut();
      const isConfrimed = await sut.confirmEmailByConfirmToken(confirmEmailToken);
      expect(isConfrimed).toBe(false);
    });
  });

  describe('changePasswordById()', () => {
    test('Should update the account password on changePasswordById success', async () => {
      const sut = makeSut();
      const res = await accountCollection.insertOne(mockAddAccountParams());
      const fakeAccount = res.ops[0];
      const password = faker.internet.password();
      await sut.changePasswordById(fakeAccount._id, password);
      const account = await accountCollection.findOne({ _id: fakeAccount._id });
      expect(account).toBeTruthy();
      expect(account.password).toBe(password);
    });

    test('Should return true on changePasswordById on success', async () => {
      const sut = makeSut();
      const res = await accountCollection.insertOne(mockAddAccountParams());
      const fakeAccount = res.ops[0];
      const password = faker.internet.password();
      const result = await sut.changePasswordById(fakeAccount._id, password);
      expect(result).toBe(true);
    });

    test('Should return false on changePasswordById on id not found', async () => {
      const sut = makeSut();
      const password = faker.internet.password();
      const result = await sut.changePasswordById('wrong_id', password);
      expect(result).toBe(false);
    });
  });
});
