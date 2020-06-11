import faker from 'faker';
import { UuidV4 } from '@/data/protocols/uuid/uuid-v4';

export class UuidSpy implements UuidV4 {
  uuid = faker.random.uuid();


  callsCount = 0;

  v4(): string {
    this.callsCount += 1;
    return this.uuid;
  }
}
