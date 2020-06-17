import {
  ValidationComposite, EmailValidation, RequiredFieldValidation, CompareFieldValidation,
} from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { makeApplyResetPasswordValidation } from '@/main/factories/controllers/authentication/apply-reset-password/apply-reset-password-validation-factory';

jest.mock('@/validation/validators/validation-composite');

describe('ApplyResetPasswordValidation Factory', () => {
  test('Should call ValidationComposite with all validatations', () => {
    makeApplyResetPasswordValidation();
    const validations: Validation[] = [];
    for (const field of ['password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
