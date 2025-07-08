import { Direction, InitOptions } from '@/core/types';

export const defaultLoader = (options?: {
  basePath?: string;
  format?: InitOptions['format'];
}) => {
  const basePath = options?.basePath || '/src/groot/translations';
  const format = options?.format || 'ts';

  // @ts-expect-error this works fine in vite
  const translationFiles = import.meta.glob('/src/groot/translations/*.ts');

  return async (locale: string, _?: Direction) => {
    if (!locale) {
      throw new Error('Cannot load translations: Locale is undefined');
    }
    try {
      const moduleKey = `${basePath}/${locale}.${format}`;

      const moduleLoader = translationFiles[moduleKey];
      if (!moduleLoader) {
        throw new Error(`Translations not found for locale: ${locale}`);
      }

      const module = await moduleLoader();
      return module.default;
    } catch (error) {
      console.error(`Failed to load translations for ${locale}`, error);
      return { default: {} };
    }
  };
};
