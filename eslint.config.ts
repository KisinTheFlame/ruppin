import tseslint from "typescript-eslint";

const ignores = [
    "target/**",
];

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        ignores: ignores,
        rules: {
            "semi": ["error", "always"],
            "no-extra-semi": "error",
            "quotes": ["error", "double"],
            "eol-last": ["error", "always"],
            "comma-dangle": ["error", "always-multiline"],
        },
    },
    ...tseslint.configs.recommended.map(rules => {
        return {
            ignores: ignores,
            ...rules,
        };
    }),
    ...tseslint.configs.strict.map(rules => {
        return {
            ignores: ignores,
            ...rules,
        };
    }),
    ...tseslint.configs.stylistic.map(rules => {
        return {
            ignores: ignores,
            languageOptions: {
                parserOptions: {
                    projectService: true,
                    tsconfigRootDir: __dirname,
                },
            },
            rules: {
                "@typescript-eslint/consistent-type-definitions": ["error", "type"],
            },
            ...rules,
        };
    }),
];
