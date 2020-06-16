
import {
  badRequest, serverError, ok, forbidden,
} from '@/presentation/helpers/http/http-helper';
import { EmailNotFoundError } from '@/presentation/errors';
import {
  Controller, HttpRequest, HttpResponse, Validation,
} from '@/presentation/protocols';
import { SendLinkResetPassword } from '@/domain/usecases/reset-password/send-link-reset-password';
import { AddResetPassword } from '@/domain/usecases/reset-password/add-reset-password';

export class ResetPasswordController implements Controller {
  constructor(
    private readonly addResetPassword: AddResetPassword,
    private readonly validation: Validation,
    private readonly sendLinkResetPassword: SendLinkResetPassword,
    private readonly baseUrlFront: string,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);
      const {
        email,
      } = httpRequest.body;
      const resetPassword = await this.addResetPassword.add({
        email,
        createdAt: new Date(),
      });
      if (!resetPassword) return forbidden(new EmailNotFoundError());
      await this.sendLinkResetPassword.sendMail({
        name: resetPassword.account.name,
        email,
        token: resetPassword.token,
        baseUrlFront: this.baseUrlFront,
      });
      return ok('O processo de alteração de senha foi encaminhado para o email');
    } catch (error) {
      return serverError(error);
    }
  }
}
