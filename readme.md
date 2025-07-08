# 🌳 Groot - Universal Translation Guardian

> "I am Groot!" – A powerful, tree-shakeable translation system for React, Next.js, and vanilla JavaScript/TypeScript applications.

Groot makes it easy to manage translations with zero‑config setup, automatic detection of your translation files, and a suite of CLI tools for keeping your translations healthy and up‑to‑date.

## 🚀 Features

- 🌱 **Zero‑config setup** with automatic detection of existing translation files
- 🌿 **Framework agnostic** – works with React, Next.js, and vanilla JS/TS
- 🌳 **Tree-shakeable translations** via dynamic imports
- 🎯 **Full TypeScript support** with automatic type generation
- 🔄 **Dynamic locale loading** with brand‑specific paths
- 💫 **React component interpolation** support
- 🎭 **RTL/LTR support** out of the box
- 🏃‍♂️ **Automatic locale detection and storage**
- 📦 **Bundler agnostic** (works with webpack, rollup, vite)
- 🔍 **Health Check & Fix** via the `groot doctor` command
- 🌱 **Add Locale & Translation Key** commands to update your configuration on‑the‑fly

## 📦 Installation

Install Groot via your package manager:

```bash
npm install groot
# or
yarn add groot
# or
pnpm add groot
```

## 🎯 Quick Start

Groot comes with a CLI to help you initialize your project quickly. If you’re starting fresh, simply run:

```bash
npx groot init
```

This command will prompt you with a series of questions:

- Do you already have translation files?
- Which languages would you like to support?
- Where should the translation files be stored?

Based on your answers, Groot will generate a default `src/groot` folder with an index file and sample translation files for you.

### Example Generated Index File

Your generated `src/groot/index.ts` (or `index.js`) will look similar to:

```ts
import { useState, useCallback, useEffect } from 'react';
import { GrootBuilder } from 'groot';
import type { LocaleConfig } from 'groot';

// Locale Constants
export const EN_GB = 'en-GB';
export const FA_IR = 'fa-IR';
export const LTR = 'ltr';
export const RTL = 'rtl';

// Locale Configuration Map
// LOCALE_CONFIG: start
export const LOCALE_CONFIG = {
  EN_GB: { language: 'en-GB', direction: 'ltr', locale: 'en-GB' },
  FA_IR: { language: 'fa-IR', direction: 'rtl', locale: 'fa-IR' },
} as const;
export type Locale = keyof typeof LOCALE_CONFIG;
// LOCALE_CONFIG: end

// Locale Array
// SUPPORTED_LOCALES: start
export const SUPPORTED_LOCALE: LocaleConfig[] = [
  { language: 'en-GB', direction: 'ltr', locale: 'en-GB' },
  { language: 'fa-IR', direction: 'rtl', locale: 'fa-IR' },
];
// SUPPORTED_LOCALES: end

const DEFAULT_LOCALE = 'fa-IR';

const groot = new GrootBuilder<TranslationType>({
  defaultLocale: DEFAULT_LOCALE,
  supportedLocales: SUPPORTED_LOCALE,
});

let isInitialized = false;

export async function setup(): Promise<void> {
  if (isInitialized) return;
  try {
    await groot.initialize();
    console.log('Groot initialized with locale:', groot.getCurrentLocale());
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    throw error;
  }
}

export function getCurrentLocale() {
  /* ... */
}
export function setCurrentLocale(locale: Locale): void {
  /* ... */
}
function translate<K extends TranslationKey>(
  key: K,
  replacements?: RequiredVariables<K>
): string {
  /* ... */
}

export function useTranslation() {
  // Enhanced hook exposing t, currentLocale, setLocale and refreshTranslations
  const [currentLocale, setCurrentLocaleState] = useState(getCurrentLocale());
  const t = useCallback(
    (key: TranslationKey, replacements?: TranslationVariables) =>
      translate(key, replacements),
    []
  );
  const setLocale = useCallback((locale: Locale) => {
    setCurrentLocale(locale);
    setCurrentLocaleState(getCurrentLocale());
  }, []);
  const refreshTranslations = useCallback(async () => {
    try {
      await setup();
      setCurrentLocaleState(getCurrentLocale());
    } catch (error) {
      console.error('Error refreshing translations:', error);
    }
  }, []);
  return { t, currentLocale, setLocale, refreshTranslations };
}

setup().catch(error => {
  console.error('Failed to initialize i18n:', error);
});

export default translate;
export { DEFAULT_LOCALE };
```

### 2. Create Your Translations

Create your translation files (e.g., `src/groot/translations/en.ts`):

```ts
export default {
  welcome: 'Welcome {{name}}!',
  description: 'Click {{link}} to learn more',
  count: 'You have {{count}} messages',
} as const;
```

### 3. Use in Your Application

In your React components, use the provided hook:

```tsx
import { useTranslation } from 'groot';

function Welcome() {
  const { t } = useTranslation();
  return (
    <div>
      {t('welcome', { name: <strong>John</strong> })}
      {t('description', { link: <a href="/docs">here</a> })}
    </div>
  );
}
```

## 🔨 CLI Commands

Groot includes several CLI commands to help manage your translations:

### `groot doctor`

Runs a health check on your translation files. It:

- Scans your project for translation key usage.
- Compares with the keys defined in your translation files.
- Reports unused keys and missing translations.
- Optionally, you can run `groot doctor --fix` to automatically remove unused keys and add missing keys.
- You can also generate a detailed report with `--report-path`.

```bash
npx groot doctor --fix --report-path ./reports/groot-report.md
```

### `groot add-locale`

Prompts you for details of a new locale (language name, locale code, text direction) and automatically updates your root index file (using marker comments) with the new locale configuration.

```bash
npx groot add-locale
```

### `groot add-translation`

Prompts you for a new translation key (and an optional default value) and automatically adds the key to all your locale translation files without overriding non‑translation files (e.g., skips `index.d.ts`).

```bash
npx groot add-translation
```

_Note: All commands include fun, Groot‑themed logging messages to keep the mood light!_

## ⚙️ Configuration Options

While Groot can be used without configuration, you can optionally create a configuration file (e.g., `groot.config.ts`) to customize options like:

- **Default & Fallback Locales**
- **Translation File Paths**
- **Dynamic Import Resolvers**
- **Validation Rules**
- **Debug Mode**

```ts
interface TranslatorConfig {
  defaultLocale: string;
  fallbackLocale?: string;
  translationFiles?: { [locale: string]: string | string[] };
  imports?: {
    resolver?: (path: string, context: ImportContext) => string;
    chunkName?: string;
    mode?: 'lazy' | 'eager';
  };
  validationRules?: {
    allowMissing?: boolean;
    requireCompleteTranslations?: boolean;
  };
  debug?: boolean;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'feat: add something amazing'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

<p align="center">Made with 🌱 by the Guardians of the Translation Galaxy</p>
