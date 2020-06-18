
import {
  serverError, ok, forbidden, badRequest,
} from '@/presentation/helpers/http/http-helper';
import { AccessDeniedError } from '@/presentation/errors';
import {
  Controller, HttpRequest, HttpResponse, Validation,
} from '@/presentation/protocols';
import { UpdateProfile, UpdateProfileParams } from '@/domain/usecases/profile/update-profile';

export class UpdateProfileController implements Controller {
  constructor(
    private readonly updateProfile: UpdateProfile,
    private readonly validation: Validation,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);
      const {
        name,
        email,
      }: UpdateProfileParams = httpRequest.body;
      const profile = await this.updateProfile
        .update(accountId, {
          name,
          email,
        });
      if (!profile) return forbidden(new AccessDeniedError());
      return ok(profile);
    } catch (error) {
      return serverError(error);
    }
  }
}
