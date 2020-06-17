import {
  loginPath,
  signUpPath,
  confirmEmailPath,
  resetPasswordPath,
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
};
