import uuid from 'uuid';
import { UuidAdapter } from './uuid.adapter';

jest.mock('uuid', () => ({
  async v4() {
    return 'any_uuid';
  },
}));

const makeSut = (): UuidAdapter => new UuidAdapter();

describe('Uuid Adapter', () => {
  test('Should call uuid without values', async () => {
    const sut = makeSut();
    const uuidSpy = jest.spyOn(uuid, 'v4');
    await sut.v4();
    expect(uuidSpy).toHaveBeenCalled();
  });

  test('Should return a uuid on success', async () => {
    const sut = makeSut();
    const value = await sut.v4();
    expect(value).toBe('any_uuid');
  });
});
