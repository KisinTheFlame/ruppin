import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: [
      "./target/**",
    ],
    languageOptions: { globals: globals.node },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "eol-last": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
