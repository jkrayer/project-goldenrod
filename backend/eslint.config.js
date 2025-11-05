import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.js"],
  },
  {
    files: ["src/**/*.{js,ts}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Add any custom rules here
    },
  },
  {
    files: ["eslint.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
    },
  },
]);
