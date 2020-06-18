export const profileSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
  },
  required: ['email', 'name'],
};
