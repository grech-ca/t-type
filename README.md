# Tenix

**Tenix** is a CLI tool for generating TypeScript types from JSON localization files, enhancing type safety when using `next-intl` translations.

## Features
- **Automatically generates TypeScript types** for localization keys.
- **Strict type safety** for `useTranslations`:
  - **Plain translations**: No parameters allowed.
  - **Parameterized translations**: Requires an exact set of parameters.
  - **Rich translations**: Requires both parameters and React components.
- Works seamlessly with `next-intl`.

## Installation

```sh
npm install -g tenix
```

## Usage

### Setup
Run the setup command to generate the configuration file:
```sh
tenix setup
```

### Configuration File
After running the setup command, a configuration file named `tenix.config.ts` will be generated in the project root directory. This file contains necessary settings for the tool.

#### Configuration File Breakdown
```ts
import type { TenixConfig } from "tenix";

export default {
  source: "./locales/en.json",
  output: "./generated/types"
} satisfies TenixConfig;
```
- **`source`**: Path to the JSON localization file.
- **`output`**: Path where the generated TypeScript types will be stored.
- The configuration object is explicitly typed using `TenixConfig` from the `tenix` package, ensuring type safety.

### Generate TypeScript Types
Run the following command to generate TypeScript types based on your JSON localization files:
```sh
tenix generate --source path/to/locales/en.json --output path/to/generated/types
```

### Using the Generated Types
After generating types, update your `useTranslations` import:
```ts
import { useTranslations as original_useTranslations } from 'next-intl';
import { UseTranslations } from './selected_directory_for_generated_types';

export const useTranslations = original_useTranslations as UseTranslations;
```

### Type Safety Example
#### JSON Localization File
```json
{
  "home": {
    "title": "Welcome Home"
  },
  "user": {
    "greeting": "Hello, {name}!"
  },
  "post": {
    "content": "This is a <strong>rich</strong> message."
  },
  "article": {
    "summary": "{author} wrote this <em>important</em> article."
  }
}
```

#### TypeScript Usage
```ts
const t = useTranslations();

// ✅ Correct usage
t("home.title"); // PlainTranslation - no arguments allowed
t("user.greeting", { name: "John" }); // ParametrizedTranslation - requires exact parameters
t("post.content", { strong: (chunk) => <strong>{chunk}</strong> }); // RichTranslation - requires components
t("article.summary", { author: "Jane", em: (chunk) => <em>{chunk}</em> }); // RichTranslation with additional parameter

// ❌ TypeScript errors
t("home.title", { someParam: "wrong" }); // Error! PlainTranslation doesn't accept arguments
t("user.greeting", {}); // Error! Missing required parameter "name"
t("post.content", { name: "wrong" }); // Error! RichTranslation requires components
t("article.summary", { em: (chunk) => <em>{chunk}</em> }); // Error! Missing required parameter "author"
```

## License
MIT

