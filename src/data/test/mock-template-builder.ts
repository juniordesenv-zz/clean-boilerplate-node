import faker from 'faker';
import { TemplateBuilder } from '@/data/protocols/template-builder/template-build';

export class TemplateBuilderSpy implements TemplateBuilder {
  html = `<p>${faker.lorem.words()}</p>`;

  transpileData: object;

  async build(transpileData: object): Promise<string> {
    this.transpileData = transpileData;
    return this.html;
  }
}
