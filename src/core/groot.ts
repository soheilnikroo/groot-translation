import { isValidElement } from 'react';
import type { ReactNode } from 'react';
import type {
  GrootOptions,
  StorageAdapter,
  TranslationLoader,
  TranslationMap,
  LocaleConfig,
  NestedRecord,
  TranslationVariables,
  Path,
  PathValue,
  Direction,
} from './types';

export class Groot<T extends NestedRecord = NestedRecord> {
  private options: Required<GrootOptions>;
  private storage: StorageAdapter;
  private loader: TranslationLoader;
  private currentLocale: string;
  private translations: Map<string, TranslationMap>;
  private localeConfigs: Map<string, LocaleConfig>;
  private initialized: boolean;
  private supportedLocales: LocaleConfig[] | null = null;

  constructor(grootOptions: Required<GrootOptions>) {
    this.translations = new Map();
    this.localeConfigs = new Map();
    this.initialized = false;
    this.storage = grootOptions.storage;

    this.options = grootOptions;

    this.supportedLocales = grootOptions.supportedLocales;
    this.loader = grootOptions.loader;
    this.currentLocale = this.getStoredLocale() || grootOptions.defaultLocale;
  }

  async setup(): Promise<void> {
    if (this.currentLocale) {
      this.setLocale(this.currentLocale || this.options.defaultLocale);
    }

    if (this.supportedLocales) {
      this.supportedLocales?.forEach(config => {
        this.setLocaleConfig(config.locale, config);
      });
    }
  }

  getLocaleConfig(): LocaleConfig | undefined {
    return this.localeConfigs.get(this.currentLocale);
  }

  private getStoredLocale(): string | null {
    return this.storage.get('locale');
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    await this.setup();

    if (!this.getStoredLocale()) {
      this.storage.set('locale', this.options.defaultLocale);
    }

    if (!this.currentLocale) {
      this.currentLocale = this.options.defaultLocale;
    }

    if (this.currentLocale) {
      await this.loadTranslations(
        this.currentLocale,
        this.getLocaleConfig()?.direction
      );
    } else {
      throw new Error('Failed to initialize: No locale set');
    }

    this.initialized = true;
  }

  async loadTranslations(locale: string, dir?: Direction): Promise<void> {
    if (!locale) {
      throw new Error('Cannot load translations: Locale is undefined');
    }

    if (!this.translations.has(locale)) {
      try {
        let translations: TranslationMap;
        translations = await this.loader(locale, dir);
        this.translations.set(locale, translations);
      } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error);
        this.translations.set(locale, {});
      }
    }
  }

  setLocaleConfig(locale: string, config: LocaleConfig): void {
    this.localeConfigs.set(locale, config);
  }

  async setLocale(locale: string): Promise<void> {
    if (locale === this.currentLocale) return;

    await this.loadTranslations(locale);
    this.currentLocale = locale;
    this.storage.set('locale', locale);
  }

  getLocale(): string {
    return this.currentLocale;
  }

  t<K extends Path<T>>(
    key: K,
    replacements?: PathValue<T, K> extends string
      ? TranslationVariables<PathValue<T, K>>
      : never
  ): string {
    if (!this.initialized) {
      console.warn('Groot not initialized, returning key:', key);
      return key;
    }

    const translation = this.getTranslationValue(key);
    if (!translation) {
      console.warn(
        `No translation found for key: ${key}, currentLocale: ${this.currentLocale}`,
        '\nAvailable translations:',
        this.translations,
        '\nLocale configs:',
        this.localeConfigs
      );
      return key;
    }

    if (!replacements) {
      return translation;
    }

    return this.processReplacements(translation, replacements);
  }

  private getTranslationValue(key: string): string | undefined {
    const keys = key.split('.');
    let value = this.getNestedValue(
      this.translations.get(this.currentLocale),
      keys
    );

    return value;
  }

  private getNestedValue(
    obj: TranslationMap | undefined,
    keys: string[]
  ): string | undefined {
    if (!obj) {
      console.warn('Translation map is undefined');
      return undefined;
    }

    let current: any = obj;

    for (const key of keys) {
      if (current[key] === undefined) {
        return undefined;
      }
      current = current[key];
    }

    if (typeof current !== 'string') {
      return undefined;
    }

    return current;
  }

  private processReplacements(
    text: string,
    replacements: Record<string, ReactNode>
  ): string {
    const { prefix, suffix } = this.options.interpolation;
    let result = text;

    Object.entries(replacements)?.forEach(([key, value]) => {
      const searchValue = `${prefix || '{{'}${key}${suffix || '}}'}`;
      if (isValidElement(value)) {
        result = result.replace(searchValue, `[${key}]`);
      } else {
        result = result.replace(searchValue, String(value));
      }
    });

    return result;
  }

  getSupportedLocales(): LocaleConfig[] {
    return Array.from(this.localeConfigs.values());
  }
}
