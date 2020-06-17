import {
  accountSchema,
  loginParamsSchema,
  errorSchema,
  signUpParamsSchema,
  addResetPasswordParamsSchema,
  applyResetPasswordParamsSchema,
} from './schemas/';

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  error: errorSchema,
  addResetPasswordParams: addResetPasswordParamsSchema,
  applyResetPasswordParams: applyResetPasswordParamsSchema,
};
