import faker from 'faker';
import { throwError } from '@/domain/test';
import { LoadAccountByIdRepositorySpy } from '@/data/test';
import { DbLoadAccountById } from '@/data/usecases/account/load-account-by-id/db-load-account-by-id';


type SutTypes = {
  sut: DbLoadAccountById;
  loadAccountByIdRepositorySpy: LoadAccountByIdRepositorySpy
};

const makeSut = (): SutTypes => {
  const loadAccountByIdRepositorySpy = new LoadAccountByIdRepositorySpy();
  const sut = new DbLoadAccountById(loadAccountByIdRepositorySpy);
  return {
    sut,
    loadAccountByIdRepositorySpy,
  };
};

let id: string;

describe('DbLoadAccountById Usecase', () => {
  beforeEach(() => {
    id = faker.random.uuid();
  });

  test('Should call LoadAccountByIdRepository with correct values', async () => {
    const { sut, loadAccountByIdRepositorySpy } = makeSut();
    await sut.load(id);
    expect(loadAccountByIdRepositorySpy.id).toBe(id);
  });

  test('Should return null if LoadAccountByIdRepository returns null', async () => {
    const { sut, loadAccountByIdRepositorySpy } = makeSut();
    loadAccountByIdRepositorySpy.accountModel = null;
    const account = await sut.load(id);
    expect(account).toBeNull();
  });

  test('Should return an account on success', async () => {
    const { sut, loadAccountByIdRepositorySpy } = makeSut();
    const account = await sut.load(id);
    expect(account).toEqual(loadAccountByIdRepositorySpy.accountModel);
  });


  test('Should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositorySpy } = makeSut();
    jest.spyOn(loadAccountByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError);
    const promise = sut.load(id);
    await expect(promise).rejects.toThrow();
  });
});
