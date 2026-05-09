import nextPlugin from "@next/eslint-plugin-next";
import js from "@eslint/js";
import importX from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import promise from "eslint-plugin-promise";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import sonarjs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

/** TypeScriptとして検査するソースファイルのglob。 */
const typeScriptFiles = ["**/*.{ts,tsx}"];

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      ".npm-cache/**",
      "coverage/**",
      "eslint.config.mjs",
      "node_modules/**",
      "out/**",
      "prettier.config.mjs",
      "next-env.d.ts",
      "scripts/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: typeScriptFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "import-x": importX,
      "jsx-a11y": jsxA11y,
      perfectionist,
      promise,
      react,
      "react-hooks": reactHooks,
      sonarjs,
      "unused-imports": unusedImports,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import-x/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.strict.rules,
      ...promise.configs["flat/recommended"].rules,
      ...sonarjs.configs.recommended.rules,

      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: false,
          fixStyle: "separate-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: true },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-restricted-types": [
        "error",
        {
          types: {
            Function: "Use a specific function signature instead.",
            Object: "Use object or a specific type instead.",
          },
        },
      ],
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-use-before-define": [
        "error",
        {
          classes: true,
          functions: true,
          typedefs: true,
          variables: true,
        },
      ],
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowBoolean: true, allowNumber: true },
      ],
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowNullableBoolean: false,
          allowNullableObject: false,
          allowNumber: false,
          allowString: false,
        },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",

      "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import-x/first": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-absolute-path": "error",
      "import-x/no-cycle": ["error", { maxDepth: 1 }],
      "import-x/no-duplicates": "error",
      "import-x/no-mutable-exports": "error",
      "import-x/no-self-import": "error",
      "import-x/no-useless-path-segments": "error",

      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-duplicate-imports": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message: "Use the @/ alias instead of parent relative imports.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          message: "Do not leave empty functions in production code.",
          selector: "TSEmptyBodyFunctionExpression",
        },
      ],
      "no-void": ["error", { allowAsStatement: true }],
      "prefer-const": "error",

      "perfectionist/sort-imports": [
        "error",
        {
          groups: [
            "type-import",
            ["value-builtin", "value-external"],
            "type-internal",
            "value-internal",
            ["type-parent", "type-sibling", "type-index"],
            ["value-parent", "value-sibling", "value-index"],
            "ts-equals-import",
            "unknown",
          ],
          newlinesBetween: 1,
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-named-imports": [
        "error",
        { order: "asc", type: "alphabetical" },
      ],

      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-fragments": ["error", "syntax"],
      "react/no-array-index-key": "error",
      "react/no-unstable-nested-components": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": "error",

      "sonarjs/cognitive-complexity": ["error", 10],
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/no-unused-vars": "off",
      "sonarjs/prefer-read-only-props": "off",

      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              message:
                "App Router files must not call the API client directly. Use feature api/hooks instead.",
              name: "@/libs/apiClient",
            },
          ],
          patterns: [
            {
              group: ["../*"],
              message: "Use the @/ alias instead of parent relative imports.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/domains/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/app/*",
                "@/components/*",
                "@/features/*",
                "@/libs/*",
                "@/theme/*",
                "../*",
              ],
              message:
                "Domain code must stay pure and must not depend on app, UI, feature, lib, or theme layers.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*", "../*"],
              message:
                "Feature code must not depend on app. Use the @/ alias instead of parent relative imports.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/app/*",
                "@/features/*/api/*",
                "@/features/*/hooks/*",
                "@/features/*/mappers/*",
                "@/features/*/usecases/*",
                "../*",
              ],
              message:
                "Components must not depend on app or feature logic layers. Use feature domain types only when a feature-specific UI needs them.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/components/templates/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              message:
                "Templates must use feature hooks/api wrappers instead of the low-level API client.",
              name: "@/libs/apiClient",
            },
          ],
          patterns: [
            {
              group: ["@/app/*", "../*"],
              message:
                "Templates may compose feature hooks and UI, but must not depend on app or parent relative imports.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/libs/**/*.{ts,tsx}", "src/theme/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*", "@/features/*", "@/components/*", "../*"],
              message:
                "Low-level libs/theme must not depend on app, feature, or shared component layers.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.config.{js,mjs,ts}", "next.config.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
);
