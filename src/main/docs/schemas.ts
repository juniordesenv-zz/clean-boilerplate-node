import {
  accountSchema,
  loginParamsSchema,
  errorSchema,
  signUpParamsSchema,
  addResetPasswordParamsSchema,
  applyResetPasswordParamsSchema,
  profileSchema,
  profilePasswordParamsSchema,
} from './schemas/';

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  error: errorSchema,
  addResetPasswordParams: addResetPasswordParamsSchema,
  applyResetPasswordParams: applyResetPasswordParamsSchema,
  profile: profileSchema,
  profilePasswordParams: profilePasswordParamsSchema,
};
