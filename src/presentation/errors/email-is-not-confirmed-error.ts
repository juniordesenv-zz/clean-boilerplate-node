export class EmailIsNotConfirmedError extends Error {
  constructor() {
    super('Awaiting email confirmation');
    this.name = 'EmailIsNotConfirmedError';
  }
}
