import { UpdateProfileParams } from '@/domain/usecases/profile/update-profile';
import faker from 'faker';
import { ProfileModel } from '@/domain/models';

export const mockUpdateProfileParams = (): UpdateProfileParams => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
});

export const mockProfileModel = (): ProfileModel => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
});
