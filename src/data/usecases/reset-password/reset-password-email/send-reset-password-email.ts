
import { SenderMail } from '@/data/protocols/mailer/sender-mail';
import { TemplateBuilder } from '@/data/protocols/template-builder/template-build';
import {
  SendLinkResetPassword,
  SendLinkResetPasswordParams,
} from '@/domain/usecases/reset-password/send-link-reset-password';

export class SendResetPasswordEmail implements SendLinkResetPassword {
  constructor(
    private readonly templateBuilder: TemplateBuilder,
    private readonly senderMail: SenderMail,
    private readonly fromEmail: string,
    private readonly subjectEmail: string,
  ) {}

  async sendMail(data: SendLinkResetPasswordParams): Promise<void> {
    const html = await this.templateBuilder.build({
      name: data.name,
      resetLink: `${data.baseUrlFront}/reset-password/${data.token}`,
    });
    await this.senderMail.sendMail({
      from: this.fromEmail,
      to: data.email,
      subject: this.subjectEmail,
      html,
    });
  }
}
