import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['out/**', 'dist/**', 'node_modules/**', '.vscode-test/**'],
    },
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.ts', 'test/**/*.ts'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
        },
        rules: {
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'import',
                    format: ['camelCase', 'PascalCase'],
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-wrapper-object-types': 'warn',
            'prefer-const': 'warn',
            curly: 'warn',
            eqeqeq: ['warn', 'smart'],
            'no-eval': 'error',
            'no-throw-literal': 'warn',
            'no-var': 'error',
            semi: 'off',
            'spaced-comment': ['warn', 'always', { markers: ['/'] }],
        },
    },
);
