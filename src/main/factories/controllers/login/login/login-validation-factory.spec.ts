import {
  ValidationComposite, EmailValidation, RequiredFieldValidation,
} from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { makeLoginValidation } from '@/main/factories/controllers/login/login/login-validation-factory';
import { EmailValidator } from '@/validation/protocols/email-validator';

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
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
