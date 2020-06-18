import request from 'supertest';
import faker from 'faker';
import { Collection } from 'mongodb';

import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';

let accountCollection: Collection;


const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: '123',
    role: 'admin',
  });
  const id = res.ops[0]._id;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne({
    _id: id,
  }, {
    $set: {
      accessToken,
    },
  });
  return accessToken;
};


describe('Profile Routes', () => {
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

  describe('GET /profile', () => {
    test('Should return 403  without accessToken', async () => {
      await request(app)
        .get('/api/profile')
        .expect(403);
    });

    test('Should return 200 on profile', async () => {
      const accessToken = await mockAccessToken();
      await request(app)
        .get('/api/profile')
        .set('authorization', accessToken)
        .expect(200);
    });
  });

  describe('PUT /profile', () => {
    test('Should return 403  without accessToken', async () => {
      await request(app)
        .put('/api/profile')
        .expect(403);
    });

    test('Should return 200 on profile', async () => {
      const accessToken = await mockAccessToken();
      await request(app)
        .put('/api/profile')
        .set('authorization', accessToken)
        .send({
          name: faker.name.findName(),
          email: faker.internet.email(),
        })
        .expect(200);
    });
  });
});
