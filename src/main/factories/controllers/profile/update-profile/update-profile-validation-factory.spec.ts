import {
  ValidationComposite, EmailValidation, RequiredFieldValidation,
} from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { EmailValidator } from '@/validation/protocols/email-validator';
import { makeUpdateProfileValidation } from '@/main/factories/controllers/profile/update-profile/update-profile-validation-factory';

jest.mock('@/validation/validators/validation-composite');


const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('UpdateProfileValidation Factory', () => {
  test('Should call ValidationComposite with all validatations', () => {
    makeUpdateProfileValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'name']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
