import faker from 'faker';
import { throwError } from '@/domain/test';
import { DbShowProfile } from '@/data/usecases/profile/show-profile/db-show-profile';
import { LoadAccountByIdSpy } from '@/data/test';


type SutTypes = {
  sut: DbShowProfile;
  loadAccountByIdSpy: LoadAccountByIdSpy;
};

const makeSut = (): SutTypes => {
  const loadAccountByIdSpy = new LoadAccountByIdSpy();
  const sut = new DbShowProfile(loadAccountByIdSpy);
  return {
    sut,
    loadAccountByIdSpy,
  };
};

let id: string;

describe('DbShowProfile Usecase', () => {
  beforeEach(() => {
    id = faker.random.uuid();
  });

  test('Should call LoadAccountById with correct values', async () => {
    const { sut, loadAccountByIdSpy } = makeSut();
    await sut.show(id);
    expect(loadAccountByIdSpy.accountId).toBe(id);
  });

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByIdSpy } = makeSut();
    loadAccountByIdSpy.accountModel = null;
    const profile = await sut.show(id);
    expect(profile).toBeNull();
  });

  test('Should return an profile on success', async () => {
    const { sut, loadAccountByIdSpy } = makeSut();
    const profile = await sut.show(id);
    expect(profile).toEqual({
      name: loadAccountByIdSpy.accountModel.name,
      email: loadAccountByIdSpy.accountModel.email,
    });
  });

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByIdSpy } = makeSut();
    jest.spyOn(loadAccountByIdSpy, 'load').mockImplementationOnce(throwError);
    const promise = sut.show(id);
    await expect(promise).rejects.toThrow();
  });
});
