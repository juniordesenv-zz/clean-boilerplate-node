import { HandlebarsAdapter } from '@/infra/template-builder/handlebars-adapter/handlebars-adapter';
import env from '@/main/config/env';
import { NodemailerAdapter } from '@/infra/mailer/nodemailer-adapter/nodemailer-adapter';
import { SendEmailConfirmAccount } from '@/data/usecases/account/confirm-email-account/send-email-confirm-account';

export const makeSendEmailConfirmAccount = (): SendEmailConfirmAccount => {
  const handlebarsAdapter = new HandlebarsAdapter('wellcome.hbs', env.templatesDir);
  const nodemailerAdapter = new NodemailerAdapter(
    env.smtpUser,
    env.smtpPassword,
    env.smtpHost,
    env.smtpPort,
    env.smtpSecure,
  );
  return new SendEmailConfirmAccount(
    handlebarsAdapter,
    nodemailerAdapter,
    env.smtpUser,
    'Bem vindo',
  );
};
