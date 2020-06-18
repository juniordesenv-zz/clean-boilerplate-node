# Confirmação de Email

> ## Caso de sucesso:
1. ✅ Recebe uma requisição do tipo **POST** na rota **/api/confirm-email/:confirmEmailToken**
1. ✅ Valida se o token está correto
1. ✅ Ativa a conta do usuário
1. ✅ Retorna 200 com a mensagem de sucesso

> ## Exceções:
1. ✅ Retorna erro 404 se a API não existir
1. ✅ Retorna erro 400 se **confirmEmailToken** for inválido
1. ✅ Retorna erro 500 se der erro ao ativar o token
