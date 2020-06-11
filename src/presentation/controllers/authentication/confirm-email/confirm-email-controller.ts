
import {
  badRequest, serverError, ok,
} from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';
import {
  Controller, HttpRequest, HttpResponse,
} from '@/presentation/protocols';
import { ConfirmEmailAccountByConfirmEmailToken } from '@/domain/usecases/account/confirm-email-account-by-confirm-token';

export class ConfirmEmailController implements Controller {
  constructor(
    private readonly confirmEmailAccountByConfirmEmailToken: ConfirmEmailAccountByConfirmEmailToken,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { confirmEmailToken } = httpRequest.params;
      const isConfirmed = await this.confirmEmailAccountByConfirmEmailToken
        .confirmEmail(confirmEmailToken);
      if (!isConfirmed) return badRequest(new InvalidParamError('confirmEmailToken'));
      return ok('Email confirmado com succeso');
    } catch (error) {
      return serverError(error);
    }
  }
}
