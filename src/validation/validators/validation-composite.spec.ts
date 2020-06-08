import { MissingParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols/validation';
import { ValidationComposite } from '@/validation/validators/validation-composite';
import { mockValidation } from '@/validation/test';


type SutTypes = {
  sut: ValidationComposite,
  validationStubs: Validation[]
};

const makeSut = (): SutTypes => {
  const validationStubs = [
    mockValidation(),
    mockValidation(),
  ];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs,
  };
};

describe('Validation Compose', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });


  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut();

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error('field'));
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new Error('field'));
  });

  test('Should not return if validation succeeds', () => {
    const { sut, validationStubs } = makeSut();


    const error = sut.validate({ field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
