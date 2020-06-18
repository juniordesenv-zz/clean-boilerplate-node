import { Controller } from '@/presentation/protocols';
import { makeLogControlleDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { ShowProfileController } from '@/presentation/controllers/profile/show-profile/show-profile-controller';
import { makeDbShowProfile } from '@/main/factories/usescases/profile/show-profile/db-show-profile-factory';

export const makeShowProfileController = (): Controller => makeLogControlleDecorator(
  new ShowProfileController(
    makeDbShowProfile(),
  ),
);
