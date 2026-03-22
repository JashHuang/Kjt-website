declare module 'opencc-js' {
  export function Converter(options: { from: string; to: string }): (text: string) => string;
  export function HTMLConverter(
    converter: (text: string) => string,
    rootNode: HTMLElement,
    fromLang: string,
    toLang: string
  ): {
    convert: () => void;
    restore: () => void;
  };
}
