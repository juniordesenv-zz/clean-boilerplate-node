import {
  ValidationComposite, EmailValidation, RequiredFieldValidation, CompareFieldValidation,
} from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { makeSignUpValidation } from '@/main/factories/controllers/login/singup/signup-validation-factory';
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
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
