import { Middleware } from '@/presentation/protocols';
import { makeDbLoadAccountByToken } from '@/main/factories/usescases/account/load-account-by-token/db-load-account-by-token-factory';
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';

export const makeAuthMiddleware = (role?: string): Middleware => new AuthMiddleware(
  makeDbLoadAccountByToken(),
  role,
);
