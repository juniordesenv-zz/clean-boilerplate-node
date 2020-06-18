import {
  loginPath,
  signUpPath,
  confirmEmailPath,
  resetPasswordPath,
  profilePath,
  profilePasswordPath,
} from './paths/';

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/confirm-email/{confirmEmailToken}': confirmEmailPath,
  '/reset-password': {
    post: resetPasswordPath.post,
  },
  '/reset-password/{token}': {
    put: resetPasswordPath.put,
  },
  '/profile': profilePath,
  '/profile/password': profilePasswordPath,
};
