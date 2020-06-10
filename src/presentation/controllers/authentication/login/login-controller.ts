import {
  badRequest, serverError, unauthorized, ok, forbidden,
} from '@/presentation/helpers/http/http-helper';
import {
  Controller, HttpRequest, HttpResponse, Validation,
} from '@/presentation/protocols';
import { Authentication } from '@/domain/usecases/account/authentication';
import { EmailIsNotConfirmedError } from '@/presentation/errors';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);
      const { email, password } = httpRequest.body;
      const authenticationModel = await this.authentication.auth({ email, password });
      if (authenticationModel) {
        if (!authenticationModel.confirmedEmail) {
          return forbidden(new EmailIsNotConfirmedError());
        }
        return ok(authenticationModel);
      }
      return unauthorized();
    } catch (error) {
      return serverError(error);
    }
  }
}
