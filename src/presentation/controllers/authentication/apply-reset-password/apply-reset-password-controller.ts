
import {
  badRequest, serverError, ok,
} from '@/presentation/helpers/http/http-helper';
import {
  Controller, HttpRequest, HttpResponse, Validation,
} from '@/presentation/protocols';
import { ApplyResetPassword } from '@/domain/usecases/reset-password/apply-reset-password';
import { TokenNotFoundOrExpired } from '@/presentation/errors/token-not-found-or-expired';

export class ApplyResetPasswordController implements Controller {
  constructor(
    private readonly applyResetPassword: ApplyResetPassword,
    private readonly validation: Validation,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);
      const {
        password,
      } = httpRequest.body;
      const { token } = httpRequest.params;
      const resetPassword = await this.applyResetPassword.apply({
        token,
        password,
      });
      if (!resetPassword) return badRequest(new TokenNotFoundOrExpired());
      return ok('Senha alterada com sucesso');
    } catch (error) {
      return serverError(error);
    }
  }
}
