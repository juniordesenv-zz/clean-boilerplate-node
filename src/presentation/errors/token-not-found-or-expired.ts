export class TokenNotFoundOrExpired extends Error {
  constructor() {
    super('The token is not found or expired');
    this.name = 'TokenNotFoundOrExpired';
  }
}
