export interface TemplateBuilder {
  build (transpileData: object): Promise<string>
}
