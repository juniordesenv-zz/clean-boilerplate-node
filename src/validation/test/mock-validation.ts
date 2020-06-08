import { Validation } from '@/presentation/protocols';

export const mockValidation = () => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};
