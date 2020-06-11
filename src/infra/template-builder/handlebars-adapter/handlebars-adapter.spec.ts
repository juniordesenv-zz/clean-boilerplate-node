import handlebars, { TemplateDelegate } from 'handlebars';
import { throwError } from '@/domain/test';
import fs from 'fs';
import { HandlebarsAdapter } from '@/infra/template-builder/handlebars-adapter/handlebars-adapter';

jest.mock('handlebars', () => ({
  compile(): TemplateDelegate<any> {
    return (): string => 'any_value';
  },
}));

jest.mock('fs', () => ({
  readFileSync() {
    return '<p>any_html</p>';
  },
}));

const makeSut = (): HandlebarsAdapter => new HandlebarsAdapter('any_name', 'any_dir');

describe('Handlebars Adapter', () => {
  describe('compile()', () => {
    test('Should call handlebars compile with correct value', async () => {
      const sut = makeSut();
      const compileSpy = jest.spyOn(handlebars, 'compile');
      await sut.build({ name: 'any_name' });
      expect(compileSpy).toHaveBeenCalledWith('<p>any_html</p>');
    });

    test('Should call TemplateDelagete with correct value', async () => {
      const sut = makeSut();
      const templateResultByCompile = jest.fn();
      jest.spyOn(handlebars, 'compile').mockReturnValueOnce(templateResultByCompile);
      await sut.build({ name: 'any_name' });
      expect(templateResultByCompile).toHaveBeenCalledWith({ name: 'any_name' });
    });


    test('Should return html transpiled on success', async () => {
      const sut = makeSut();
      const result = await sut.build({ name: 'any_name' });
      expect(result).toEqual('any_value');
    });

    test('Should throw if compile throws', async () => {
      const sut = makeSut();
      jest.spyOn(handlebars, 'compile').mockImplementationOnce(throwError);
      const promise = sut.build({ name: 'any_name' });
      await expect(promise).rejects.toThrow();
    });

    test('Should throw if compile throws', async () => {
      const sut = makeSut();
      const templateResultByCompile = jest.fn(throwError);
      jest.spyOn(handlebars, 'compile').mockReturnValueOnce(templateResultByCompile);
      const promise = sut.build({ name: 'any_name' });
      await expect(promise).rejects.toThrow();
    });
  });
});
