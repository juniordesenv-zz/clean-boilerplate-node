import { HandlebarsAdapter } from '@/infra/template-builder/handlebars-adapter/handlebars-adapter';
import env from '@/main/config/env';
import { NodemailerAdapter } from '@/infra/mailer/nodemailer-adapter/nodemailer-adapter';
import { SendResetPasswordEmail } from '@/data/usecases/reset-password/reset-password-email/send-reset-password-email';

export const makeSendResetPasswordEmail = (): SendResetPasswordEmail => {
  const handlebarsAdapter = new HandlebarsAdapter('reset-password.hbs', env.templatesDir);
  const nodemailerAdapter = new NodemailerAdapter(
    env.smtpUser,
    env.smtpPassword,
    env.smtpHost,
    env.smtpPort,
    env.smtpSecure,
  );
  return new SendResetPasswordEmail(
    handlebarsAdapter,
    nodemailerAdapter,
    env.smtpUser,
    'Alteração de senha',
  );
};
