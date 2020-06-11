import {
  loginPath,
  signUpPath,
  confirmEmailPath,
} from './paths/';

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/confirm-email/{confirmEmailToken}': confirmEmailPath,
};
