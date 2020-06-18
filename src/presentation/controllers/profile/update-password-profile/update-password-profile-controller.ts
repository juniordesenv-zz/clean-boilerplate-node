
import {
  serverError, ok, forbidden, badRequest,
} from '@/presentation/helpers/http/http-helper';
import { AccessDeniedError } from '@/presentation/errors';
import {
  Controller, HttpRequest, HttpResponse, Validation,
} from '@/presentation/protocols';
import { UpdatePasswordProfile } from '@/domain/usecases/profile/update-password-profile';

export class UpdatePasswordProfileController implements Controller {
  constructor(
    private readonly updatePasswordProfile: UpdatePasswordProfile,
    private readonly validation: Validation,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);
      const {
        password,
      } = httpRequest.body;
      const profile = await this.updatePasswordProfile
        .update(accountId, password);
      if (!profile) return forbidden(new AccessDeniedError());
      return ok('Senha alterada com sucesso');
    } catch (error) {
      return serverError(error);
    }
  }
}
