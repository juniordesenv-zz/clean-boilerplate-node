import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { makeSignUpController } from '@/main/factories/controllers/authentication/singup/signup-controller-factory';
import { makeLoginController } from '@/main/factories/controllers/authentication/login/login-controller-factory';
import { makeConfirmEmailController } from '@/main/factories/controllers/authentication/confirm-email/confirm-email-controller-factory';
import { makeResetPasswordController } from '@/main/factories/controllers/authentication/reset-password/reset-password-controller-factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
  router.put('/confirm-email/:confirmEmailToken', adaptRoute(makeConfirmEmailController()));
  router.post('/reset-password', adaptRoute(makeResetPasswordController()));
};
