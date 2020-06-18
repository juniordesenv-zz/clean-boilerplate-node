import { Controller } from '@/presentation/protocols';
import { makeLogControlleDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { UpdateProfileController } from '@/presentation/controllers/profile/update-profile/update-profile-controller';
import { makeUpdateProfileValidation } from '@/main/factories/controllers/profile/update-profile/update-profile-validation-factory';
import { makeDbUpdateProfile } from '@/main/factories/usescases/profile/update-profile/db-update-profile-factory';


export const makeUpdateProfileController = (): Controller => makeLogControlleDecorator(
  new UpdateProfileController(
    makeDbUpdateProfile(),
    makeUpdateProfileValidation(),
  ),
);
