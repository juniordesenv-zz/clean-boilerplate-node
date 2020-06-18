import faker from 'faker';
import { throwError } from '@/domain/test';
import { DbShowProfile } from '@/data/usecases/profile/show-profile/db-show-profile';
import { LoadAccountByIdRepositorySpy } from '@/data/test';


type SutTypes = {
  sut: DbShowProfile;
  loadAccountByIdRepositorySpy: LoadAccountByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadAccountByIdRepositorySpy = new LoadAccountByIdRepositorySpy();
  const sut = new DbShowProfile(loadAccountByIdRepositorySpy);
  return {
    sut,
    loadAccountByIdRepositorySpy,
  };
};

let id: string;

describe('DbShowProfile Usecase', () => {
  beforeEach(() => {
    id = faker.random.uuid();
  });

  test('Should call loadAccountByIdRepository with correct values', async () => {
    const { sut, loadAccountByIdRepositorySpy } = makeSut();
    await sut.show(id);
    expect(loadAccountByIdRepositorySpy.id).toBe(id);
  });

  test('Should return null if loadAccountByIdRepository returns null', async () => {
    const { sut, loadAccountByIdRepositorySpy } = makeSut();
    loadAccountByIdRepositorySpy.accountModel = null;
    const profile = await sut.show(id);
    expect(profile).toBeNull();
  });

  test('Should return an profile on success', async () => {
    const { sut, loadAccountByIdRepositorySpy } = makeSut();
    const profile = await sut.show(id);
    expect(profile).toEqual({
      name: loadAccountByIdRepositorySpy.accountModel.name,
      email: loadAccountByIdRepositorySpy.accountModel.email,
    });
  });

  test('Should throw if loadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositorySpy } = makeSut();
    jest.spyOn(loadAccountByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError);
    const promise = sut.show(id);
    await expect(promise).rejects.toThrow();
  });
});
