import {
  ValidationComposite,
  RequiredFieldValidation, CompareFieldValidation,
} from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';

export const makeUpdatePasswordProfileValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'));
  return new ValidationComposite(validations);
};
