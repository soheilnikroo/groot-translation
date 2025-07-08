---
id: api
title: API Reference
sidebar_position: 5
---

# API Reference

This section provides a detailed API reference for Groot’s core classes and functions.

## Groot Class

The main class that handles translation loading, storage, and interpolation.

### Methods

- **init()**  
  Initializes the translation system.

- **t(key, replacements?)**  
  Translates a given key with optional replacements.

- **setLocale(locale)**  
  Sets the current locale and loads its translations.

- **getLocaleConfig()**  
  Returns the configuration for the current locale.

_For a full code reference, please refer to the source code on GitHub._

## GrootBuilder

A helper class that wraps the creation of a Groot instance and provides a simple API.

### Methods

- **initialize()** – Initializes the underlying Groot instance.
- **translate(key, replacements?)** – Returns the translated string.
- **getCurrentLocale()** – Retrieves the current locale configuration.
- **setLocale(locale)** – Changes the current locale.

## CLI Commands

- **groot init** – Initializes the project.
- **groot doctor** – Runs a health check on your translations.
- **groot add-locale** – Adds a new locale.
- **groot add-translation** – Adds a new translation key.

---

For more detailed examples and code snippets, please refer to the [GitHub repository](https://github.com/snapp/groot).
