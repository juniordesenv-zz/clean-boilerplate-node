export const addResetPasswordParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
  },
  required: ['email'],
};
