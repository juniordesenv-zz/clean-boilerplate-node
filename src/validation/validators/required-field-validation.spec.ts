import { MissingParamError } from '@/presentation/errors';
import { RequiredFieldValidation } from '@/validation/validators/required-field-validation';

const makeSut = (): RequiredFieldValidation => new RequiredFieldValidation('field');

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validations fails', () => {
    const sut = makeSut();

    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Shouldnot return if validations succeeds', () => {
    const sut = makeSut();

    const error = sut.validate({ field: 'any_field' });
    expect(error).toBeFalsy();
  });
});
