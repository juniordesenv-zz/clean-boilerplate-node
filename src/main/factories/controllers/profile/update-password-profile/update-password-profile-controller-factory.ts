import { Controller } from '@/presentation/protocols';
import { makeLogControlleDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { UpdatePasswordProfileController } from '@/presentation/controllers/profile/update-password-profile/update-password-profile-controller';
import { makeUpdatePasswordProfileValidation } from '@/main/factories/controllers/profile/update-password-profile/update-password-profile-validation-factory';
import { makeDbUpdatePasswordProfile } from '@/main/factories/usescases/profile/update-password-profile/db-update-password-profile-factory';


export const makeUpdatePasswordProfileController = (): Controller => makeLogControlleDecorator(
  new UpdatePasswordProfileController(
    makeDbUpdatePasswordProfile(),
    makeUpdatePasswordProfileValidation(),
  ),
);
