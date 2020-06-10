
import { SenderMail } from '@/data/protocols/mailer/sender-mail';
import { TemplateBuilder } from '@/data/protocols/template-builder/template-build';
import { SendLinkConfirmAccount, SendLinkConfirmAccountParams } from '@/domain/usecases/account/sendLinkConfirmAccount';


export class SendEmailConfirmAccount implements SendLinkConfirmAccount {
  constructor(
    private readonly templateBuilder: TemplateBuilder,
    private readonly senderMail: SenderMail,
    private readonly fromEmail: string,
    private readonly subjectEmail: string,
  ) {}

  async sendMail(data: SendLinkConfirmAccountParams): Promise<void> {
    const html = await this.templateBuilder.build({
      name: data.name,
      confirmLink: `${data.baseUrlFront}/api/confirm-email/${data.confirmToken}`,
    });
    await this.senderMail.sendMail({
      from: this.fromEmail,
      to: data.email,
      subject: this.subjectEmail,
      html,
    });
  }
}
