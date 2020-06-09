export interface TemplateBuild {
  build (transpileData: object): Promise<string>
}
