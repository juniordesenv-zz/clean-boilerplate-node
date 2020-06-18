# Perfil alteração de senha

> ## Caso de sucesso:
1. ✅ Recebe uma requisição do tipo **PUT** na rota **/api/profile/password**
1. ✅ Valida dados obrigatório **password** e **passwordConfirmation**
1. ✅ Altera a senha do usuário
1. ✅ Retorna 200 com a mensagem de sucesso

> ## Exceções:
1. ✅ Retorna erro 404 se a API não existir
1. ✅ Retorna erro 403 se falhar a alteração de senha
1. ✅ Retorna erro 400 se **password** e **passwordConfirmation** não forem fornecidos pelo client
1. ✅ Retorna erro 500 se ocorrer um erro ao alterar a senha
