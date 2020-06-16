import {
  ValidationComposite, EmailValidation, RequiredFieldValidation,
} from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { EmailValidator } from '@/validation/protocols/email-validator';
import { makeResetPasswordValidation } from '@/main/factories/controllers/authentication/reset-password/reset-password-validation-factory';

jest.mock('@/validation/validators/validation-composite');


const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validatations', () => {
    makeResetPasswordValidation();
    const validations: Validation[] = [];
    for (const field of ['email']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
