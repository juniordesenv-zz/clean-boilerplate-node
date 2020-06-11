export const confirmEmailPath = {
  put: {
    tags: ['Autenticação'],
    summary: 'API para confirmar o email do usuaŕio',
    description: 'Essa rota depende do confirmEmailToken encaminhado para o email do usuário',
    parameters: [{
      in: 'path',
      name: 'confirmEmailToken',
      description: 'Token de confirmação do email',
      required: true,
      schema: {
        type: 'string',
      },
    }],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'text/plain': {
            schema: {
              type: 'string',
              example: 'Email confirmado com succeso',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
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
