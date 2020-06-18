import faker from 'faker';
import { mockAccountModel, throwError } from '@/domain/test';
import { DbUpdateProfile } from '@/data/usecases/profile/update-profile/db-update-profile';
import { LoadAccountByEmailRepositorySpy, UpdateProfileRepositorySpy } from '@/data/test';
import { mockUpdateProfileParams } from '@/domain/test/mock-profile';


type SutTypes = {
  sut: DbUpdateProfile;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  updateProfileRepositorySpy: UpdateProfileRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  loadAccountByEmailRepositorySpy.accountModel = null;
  const updateProfileRepositorySpy = new UpdateProfileRepositorySpy();
  const sut = new DbUpdateProfile(loadAccountByEmailRepositorySpy, updateProfileRepositorySpy);
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    updateProfileRepositorySpy,
  };
};

let id: string;

describe('DbUpdateProfile Usecase', () => {
  beforeEach(() => {
    id = faker.random.uuid();
  });

  test('Should call LoadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    const updateProfileParams = mockUpdateProfileParams();
    await sut.update(id, updateProfileParams);
    expect(loadAccountByEmailRepositorySpy.email).toBe(updateProfileParams.email);
  });


  test('Should return null if LoadAccountByEmailRepository returns an account with accountId different', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel();
    const result = await sut.update(id, mockUpdateProfileParams());
    expect(result).toBe(null);
  });

  test('Should return a profile if LoadAccountByEmailRepository returns an account with same accountId', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.accountModel = {
      ...mockAccountModel(),
      id,
    };
    const result = await sut.update(id, mockUpdateProfileParams());
    expect(result).toBeTruthy();
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(throwError);
    const promise = sut.update(id, mockUpdateProfileParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call UpdateProfileRepository with correct values', async () => {
    const { sut, updateProfileRepositorySpy } = makeSut();
    const updateProfileParams = mockUpdateProfileParams();
    await sut.update(id, updateProfileParams);
    expect(updateProfileRepositorySpy.updateProfileData).toBe(updateProfileParams);
  });

  test('Should throw if UpdateProfileRepository throws', async () => {
    const { sut, updateProfileRepositorySpy } = makeSut();
    jest.spyOn(updateProfileRepositorySpy, 'updateProfile').mockImplementationOnce(throwError);
    const promise = sut.update(id, mockUpdateProfileParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return a profile on success', async () => {
    const { sut, updateProfileRepositorySpy } = makeSut();
    const result = await sut.update(id, mockUpdateProfileParams());
    expect(result).toEqual({
      name: updateProfileRepositorySpy.accountModel.name,
      email: updateProfileRepositorySpy.accountModel.email,
    });
  });
});
