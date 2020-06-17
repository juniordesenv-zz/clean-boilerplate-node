import { Controller } from '@/presentation/protocols';
import { makeLogControlleDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { ShowProfileController } from '@/presentation/controllers/profile/show-profile/show-profile-controller';
import { makeShowProfile } from '@/main/factories/usescases/profile/show-profile/show-profile-factory';

export const makeShowProfileController = (): Controller => makeLogControlleDecorator(
  new ShowProfileController(
    makeShowProfile(),
  ),
);
