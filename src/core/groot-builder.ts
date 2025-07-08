import { LocalStorageAdapter } from '@/services/local-storage';
import { Groot } from './groot';
import type {
  Direction,
  GrootBuilderOptions,
  LocaleConfig,
  NestedRecord,
  Path,
  PathValue,
  StorageAdapter,
  TranslationVariables,
} from './types';
import { defaultLoader } from '@/utils/default-loader';

export class GrootBuilder<T extends NestedRecord> {
  private groot: Groot<T>;
  private storage: StorageAdapter;

  constructor(options: GrootBuilderOptions) {
    if (!options.defaultLocale) {
      throw new Error('defaultLocale is required');
    }

    this.storage = options.storage || new LocalStorageAdapter();
    this.storage.set('locale', options.defaultLocale);

    this.groot = new Groot<T>({
      ...options,
      interpolation: {
        prefix: options.interpolation?.prefix || '{{',
        suffix: options.interpolation?.suffix || '}}',
      },
      loader: options.loader || defaultLoader(),
      storage: this.storage,
    });

    if (options.supportedLocales) {
      options.supportedLocales?.forEach(config => {
        if (!config.locale) {
          console.warn('Locale config missing locale property:', config);
          return;
        }
        this.groot.setLocaleConfig(config.locale, config);
      });
    }

    if (typeof this.storage.subscribe === 'function') {
      this.storage.subscribe('locale', newVal => {
        if (newVal && newVal !== this.groot.getLocale()) {
          this.groot.setLocale(newVal);
        }
      });
    }
  }

  async initialize(): Promise<void> {
    try {
      await this.groot.init();
    } catch (error) {
      console.error('Failed to initialize Groot:', error);
      throw error;
    }
  }

  translate<K extends Path<T>>(
    key: K,
    replacements?: PathValue<T, K> extends string
      ? TranslationVariables<PathValue<T, K>>
      : never
  ): string {
    return this.groot.t(key, replacements) ?? key;
  }

  getCurrentLocale(): LocaleConfig | undefined {
    return this.groot.getLocaleConfig();
  }

  async setLocale(locale: string): Promise<void> {
    if (!locale) {
      console.error('Attempted to set undefined locale');
      return;
    }

    try {
      await this.groot.setLocale(locale);
    } catch (error) {
      console.error(`Failed to set locale to ${locale}:`, error);
      throw error;
    }
  }

  getGroot(): Groot<T> {
    return this.groot;
  }

  getSupportedLocales(): LocaleConfig[] {
    return this.groot.getSupportedLocales();
  }
}
