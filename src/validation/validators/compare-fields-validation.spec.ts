import { InvalidParamError } from '@/presentation/errors';
import { CompareFieldValidation } from '@/validation/validators/compare-fields-validation';

const makeSut = (): CompareFieldValidation => new CompareFieldValidation('field', 'fieldToCompare');

describe('CompareField Validation', () => {
  test('Should return a MissingParamError if validations fails', () => {
    const sut = makeSut();

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value',
    });
    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  test('Shouldnot return if validations succeeds', () => {
    const sut = makeSut();

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    });
    expect(error).toBeFalsy();
  });
});
