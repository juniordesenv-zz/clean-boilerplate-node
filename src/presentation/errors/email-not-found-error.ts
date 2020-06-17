export class EmailNotFoundError extends Error {
  constructor() {
    super('The received email is not found');
    this.name = 'EmailNotFoundError';
  }
}
