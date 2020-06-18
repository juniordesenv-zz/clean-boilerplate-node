export const profilePasswordPath = {
  put: {
    tags: ['Perfil'],
    summary: 'API para redefinição de senha do usuário',
    description: 'Essa rota pode ser executada apenas por usuário autenticado',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/profilePasswordParams',
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
      403: {
        $ref: '#/components/forbidden',
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
