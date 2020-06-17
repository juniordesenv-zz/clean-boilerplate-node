
import {
  badRequest, serverError, ok, forbidden,
} from '@/presentation/helpers/http/http-helper';
import { EmailInUseError } from '@/presentation/errors';
import {
  Controller, HttpRequest, HttpResponse, Validation,
} from '@/presentation/protocols';
import { AddAccount } from '@/domain/usecases/account/add-account';
import { SendLinkConfirmAccount } from '@/domain/usecases/account/send-link-confirm-account';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly sendLinkConfirmAccount: SendLinkConfirmAccount,
    private readonly baseUrlFront: string,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);
      const {
        name, email, password,
      } = httpRequest.body;
      const account = await this.addAccount.add({
        name,
        email,
        password,
        confirmedEmail: false,
        createdAt: new Date(),
      });
      if (!account) return forbidden(new EmailInUseError());
      await this.sendLinkConfirmAccount.sendMail({
        name,
        email,
        confirmEmailToken: account.confirmEmailToken,
        baseUrlFront: this.baseUrlFront,
      });
      return ok('Usuário cadastrado com sucesso, confirme seu email');
    } catch (error) {
      return serverError(error);
    }
  }
}
