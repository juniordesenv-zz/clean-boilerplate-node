# Redefinição de senha

> ## Caso de sucesso:
1. ✅ Recebe uma requisição do tipo **POST** na rota **/api/reset-password**
1. ✅ Valida dados obrigatório **email**
1. ✅ Desativa todas as solicitação anteriores
1. ✅ Adiciona um registro para solicitação de redifinição de senha com data de expiração de até 8 horas
1. ✅ Encaminha para o email do usuário o link para processo de alteração de senha
1. ✅ Retorna 200 com a mensagem de sucesso

> ## Exceções:
1. ✅ Retorna erro 404 se a API não existir
1. ✅ Retorna erro 400 se **email** for inválido
1. ✅ Retorna erro 403 se o email não for encontrado
1. ✅ Retorna erro 500 se ocorrer um erro ao adicionar o registro

> ## Caso de sucesso:
1. ✅ Recebe uma requisição do tipo **PUT** na rota **/api/reset-password/:token**
1. ✅ Valida dados obrigatório **password** e **passwordConfirmation**
1. ✅ Carrega o token informado pelo usuário 
1. ✅ Altera a senha do usuário
1. ✅ Desativa todas as solicitação anteriores caso ocorra a alteração
1. ✅ Retorna 200 com a mensagem de sucesso

> ## Exceções:
1. ✅ Retorna erro 404 se a API não existir
1. ✅ Retorna erro 400 se **password** e **passwordConfirmation**
1. ✅ Retorna erro 400 se o token não for encontrado
1. ✅ Retorna erro 500 se ocorrer um erro ao alterar a senha
