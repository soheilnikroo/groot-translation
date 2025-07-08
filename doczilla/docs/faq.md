---
id: faq
title: Frequently Asked Questions
sidebar_position: 7
---

# Frequently Asked Questions

## What is Groot?

Groot is a universal translation guardian designed to work with multiple frameworks and languages. It provides dynamic translation loading, type-safe translations, and a suite of CLI commands for managing translation files.

## How does Groot detect my translations?

Groot automatically scans your project’s source code for translation keys and compares them with the keys defined in your translation files. It even checks for dynamic translation key usages.

## How do I add a new locale?

Use the CLI command:

```bash
npx groot add-locale
```

This command will prompt you for details about the new locale and update your configuration automatically.

## How do I add a new translation key?

Run:

```bash
npx groot add-translation
```

You'll be prompted for the key name and an optional default value, and the key will be added to all translation files.

## Can I use Groot with my existing translation setup?

Yes! If you already have translation files, Groot will detect them automatically during initialization and use them to generate a consistent configuration.

## Does Groot support RTL languages?

Absolutely. Each locale configuration includes a `direction` property (either `ltr` or `rtl`), and Groot automatically handles text direction in your application.

---

If you have any other questions, feel free to open an issue on our [GitHub repository](https://github.com/snapp/groot) or join our community discussions.
