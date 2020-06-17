import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { makeShowProfileController } from '@/main/factories/controllers/profile/show-profile/show-profile-controller-factory';
import { auth } from '@/main/middlewares';

export default (router: Router): void => {
  router.get('/profile', auth, adaptRoute(makeShowProfileController()));
};
