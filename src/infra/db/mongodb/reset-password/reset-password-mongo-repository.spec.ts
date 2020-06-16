import { Collection } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { mockAddResetPasswordParams } from '@/domain/test/mock-reset-password';
import * as faker from 'faker';
import { ResetPasswordMongoRepository } from './reset-password-mongo-repository';

let resetPasswordCollection: Collection;

const makeSut = (): ResetPasswordMongoRepository => new ResetPasswordMongoRepository();

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
  });


  describe('add()', () => {
    test('Should return an resetPassword on add success', async () => {
      const sut = makeSut();
      const accountId = faker.random.uuid();
      const addResetPasswordParams = mockAddResetPasswordParams();
      const isEnabled = true;
      const expiredAt = new Date();
      const token = faker.random.uuid();
      const resetPassword = await sut.add({
        ...addResetPasswordParams,
        accountId,
        isEnabled,
        expiredAt,
        token,
      });
      expect(resetPassword).toBeTruthy();
      expect(resetPassword.id).toBeTruthy();
      expect(resetPassword.token).toBe(token);
      expect(resetPassword.isEnabled).toBe(isEnabled);
      expect(resetPassword.expiredAt).toBe(expiredAt);
      expect(resetPassword.createdAt).toBe(addResetPasswordParams.createdAt);
    });
  });
});
