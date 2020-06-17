export const resetPasswordPath = {
  post: {
    tags: ['Autenticação'],
    summary: 'API para redefinição de senha do usuário',
    description: 'Essa rota pode ser executada por **qualquer usuário**',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addResetPasswordParams',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              example: 'O processo de alteração de senha foi encaminhado para o email',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
      },
      401: {
        $ref: '#/components/unauthorized',
      },
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
  put: {
    tags: ['Autenticação'],
    summary: 'API para redefinição de senha do usuário',
    description: 'Essa rota pode ser executada por **qualquer usuário**',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/applyResetPasswordParams',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              example: 'Senha alterada com sucesso',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
      },
      401: {
        $ref: '#/components/unauthorized',
      },
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
};
