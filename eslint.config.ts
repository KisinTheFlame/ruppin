import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: [
      "target/*",
    ],
    rules: {
      "semi": ["error", "always"],
      "no-extra-semi": "error",
      "quotes": ["error", "double"],
      "eol-last": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
    },
  },
  ...tseslint.configs.recommended.map(recommended => {
    return {
      ignores: [
        "target/*",
      ],
      ...recommended,
    };
  }),
];
