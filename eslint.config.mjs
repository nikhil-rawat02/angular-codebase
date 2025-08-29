import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import angular from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import angularParser from "@angular-eslint/template-parser";

export default [
  js.configs.recommended,
  {
    ignores: ["**/*.spec.ts"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        console: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "@angular-eslint": angular,
    },
    rules: {
      "@angular-eslint/no-host-metadata-property": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/prefer-readonly": "warn",
    },
  },

  {
    files: ["**/*.html"],
    languageOptions: {
      parser: angularParser,
      sourceType: "module",
    },
    plugins: {
      "@angular-eslint/template": angularTemplate,
    },
    rules: {

    },
  },
];
