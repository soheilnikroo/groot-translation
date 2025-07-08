---
id: getting-started
title: Getting Started
sidebar_position: 2
---

# Getting Started with Groot

Follow these steps to quickly set up Groot in your project.

## Installation

Install Groot using your preferred package manager:

```bash
npm install @snapp/groot
# or
yarn add @snapp/groot
# or
pnpm add @snapp/groot
```

## Initialization

Run the initialization command to set up Groot:

```bash
npx groot init
```

This command will prompt you with a series of questions:

- Do you already have translation files?
- Which languages do you want to support?
- Where should the translation files be stored?

Based on your answers, Groot will generate the default folder structure (e.g., `src/groot`) and sample translation files.

## Example Translation File

```ts
// src/groot/translations/en.ts
export default {
  welcome: 'Welcome {{name}}!',
  description: 'Click {{link}} to learn more',
  count: 'You have {{count}} messages',
} as const;
```

Now, you're ready to integrate Groot into your application!
