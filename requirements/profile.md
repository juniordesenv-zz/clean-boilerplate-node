# Perfil

> ## Caso de sucesso:
1. ✅ Recebe uma requisição do tipo **GET** na rota **/api/profile**
1. ✅ Retorna 200 com os dados de perfil do usuário

> ## Exceções:
1. ✅ Retorna erro 404 se a API não existir
1. ✅ Retorna erro 403 se o email não for encontrado
1. ✅ Retorna erro 500 se ocorrer um erro ao adicionar o registro

> ## Caso de sucesso:
1. ✅ Recebe uma requisição do tipo **PUT** na rota **/api/profile**
1. ✅ Valida dados obrigatório **email** e **name**
1. ✅ Altera os dados do usuário
1. ✅ Retorna 200 com os dados de perfil do usuário

> ## Exceções:
1. ✅ Retorna erro 404 se a API não existir
1. ✅ Retorna erro 400 se **email** e **name** se não forem fornecidos pelo cliente
1. ✅ Retorna erro 403 se o o email a ser alterado pertencer a outro usuário
1. ✅ Retorna erro 500 se ocorrer um erro ao alterar a senha
