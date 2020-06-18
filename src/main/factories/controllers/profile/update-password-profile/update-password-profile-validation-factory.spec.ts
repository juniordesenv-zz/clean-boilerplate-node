import {
  ValidationComposite, EmailValidation, RequiredFieldValidation, CompareFieldValidation,
} from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { makeUpdatePasswordProfileValidation } from '@/main/factories/controllers/profile/update-password-profile/update-password-profile-validation-factory';

jest.mock('@/validation/validators/validation-composite');


describe('UpdatePasswordProfileValidation Factory', () => {
  test('Should call ValidationComposite with all validatations', () => {
    makeUpdatePasswordProfileValidation();
    const validations: Validation[] = [];
    for (const field of ['password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
