
import {
  serverError, ok, forbidden,
} from '@/presentation/helpers/http/http-helper';
import { AccessDeniedError } from '@/presentation/errors';
import {
  Controller, HttpRequest, HttpResponse,
} from '@/presentation/protocols';
import { ShowProfile } from '@/domain/usecases/profile/show-profile';

export class ShowProfileController implements Controller {
  constructor(
    private readonly showProfile: ShowProfile,
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
      const profile = await this.showProfile
        .show(accountId);
      if (!profile) return forbidden(new AccessDeniedError());
      return ok(profile);
    } catch (error) {
      return serverError(error);
    }
  }
}
