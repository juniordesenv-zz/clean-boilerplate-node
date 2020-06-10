import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account';
import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test';
import {
  AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy, UuidSpy,
} from '@/data/test';


type SutTypes = {
  sut: DbAddAccount,
  hasherSpy: HasherSpy;
  addAccountRepositorySpy: AddAccountRepositorySpy;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  uuidSpy: UuidSpy;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  loadAccountByEmailRepositorySpy.accountModel = null;
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const uuidSpy = new UuidSpy();
  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy,
    uuidSpy,
  );
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy,
    uuidSpy,
  };
};


describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut();
    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);
    expect(hasherSpy.plaintext).toBe(addAccountParams.password);
  });


  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const {
      sut,
      addAccountRepositorySpy,
      hasherSpy,
      uuidSpy,
    } = makeSut();
    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);
    expect(addAccountRepositorySpy.addAccountParams).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest,
      confirmToken: uuidSpy.uuid,
    });
  });

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(addAccountRepositorySpy.accountModel);
  });


  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);
    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email);
  });

  test('Should call Uuid v4', async () => {
    const { sut, uuidSpy } = makeSut();
    await sut.add(mockAddAccountParams());
    expect(uuidSpy.callsCount).toBe(1);
  });

  test('Should throw if Uuid throws', async () => {
    const { sut, uuidSpy } = makeSut();
    jest.spyOn(uuidSpy, 'v4').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });
});
