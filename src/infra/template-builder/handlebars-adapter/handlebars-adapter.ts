import { TemplateBuild } from '@/data/protocols/template-builder/template-build';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export class HandlebarsAdapter implements TemplateBuild {
  constructor(
    private readonly templateName: string,
    private readonly dirname: string,
  ) { }

  private async loadTemplate() {
    return fs.readFileSync(path.join(this.dirname, this.templateName));
  }

  async build(transpileData: object): Promise<string> {
    const html = await this.loadTemplate();
    const template = handlebars.compile(html);
    return template(transpileData);
  }
}
