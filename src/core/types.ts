import { ReactNode } from 'react';
export type Direction = 'rtl' | 'ltr';

export interface LocaleConfig {
  locale: string;
  language: string;
  direction: Direction;
}

export interface InitOptions {
  format?: 'ts' | 'js' | 'json';
}

export type TranslationLoader = (
  locale: string,
  dir?: Direction
) => Promise<TranslationMap>;

export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  subscribe?(key: string, callback: (newValue: string | null) => void): void;
}

export type TranslationMap = {
  [key: string]: string | TranslationMap;
};

export type NestedRecord = {
  [key: string]: string | NestedRecord;
};

export type ExtractVariables<T extends string> =
  T extends `${string}{{${infer Param}}}${infer Rest}`
    ? Param | ExtractVariables<Rest>
    : never;

export type TranslationVariables<T extends string> = Record<
  ExtractVariables<T>,
  string | number | ReactNode
>;

export type Path<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}.${Path<T[K]> & string}`
        : K;
    }[keyof T]
  : never;

export type PathValue<
  T,
  P extends string,
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? T[Key] extends object
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

export interface GrootOptions {
  defaultLocale: string;
  storage?: StorageAdapter;
  supportedLocales: LocaleConfig[];
  loader: TranslationLoader;
  interpolation?: {
    prefix?: string;
    suffix?: string;
  };
}

export interface GrootBuilderOptions {
  defaultLocale: string;
  supportedLocales: LocaleConfig[];
  loader?: TranslationLoader;
  storage?: StorageAdapter;
  interpolation?: {
    prefix?: string;
    suffix?: string;
  };
}
