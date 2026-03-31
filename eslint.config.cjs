const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const boundaries = require('eslint-plugin-boundaries');
const reactHooks = require('eslint-plugin-react-hooks');
const reactRefresh = require('eslint-plugin-react-refresh').default;
const globals = require('globals');

module.exports = [
    { ignores: ['dist', 'coverage', 'node_modules', '.dependency-cruiser.cjs', 'eslint.config.cjs'] },
    js.configs.recommended,
    ...tsPlugin.configs['flat/recommended-type-checked'],
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: { project: ['./tsconfig.json'], tsconfigRootDir: __dirname, sourceType: 'module', ecmaFeatures: { jsx: true } },
            ecmaVersion: 2022,
            globals: { ...globals.browser, ...globals.node }
        },
        plugins: { boundaries, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
        settings: {
            'boundaries/elements': [
                { type: 'app', pattern: 'src/app/**/*' },
                { type: 'shared', pattern: 'src/shared/**/*' },
                { type: 'feature-domain', pattern: 'src/features/*/domain/**/*' },
                { type: 'feature-application', pattern: 'src/features/*/application/**/*' },
                { type: 'feature-infrastructure', pattern: 'src/features/*/infrastructure/**/*' },
                { type: 'feature-ui', pattern: 'src/features/*/ui/**/*' }
            ]
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
            'boundaries/dependencies': ['error', {
                default: 'disallow',
                rules: [
                    {
                        from: { type: 'app' },
                        allow: {
                            to: { type: ['app', 'shared', 'feature-domain', 'feature-application', 'feature-infrastructure', 'feature-ui'] }
                        }
                    },
                    { from: { type: 'shared' }, allow: { to: { type: ['shared'] } } },
                    { from: { type: 'feature-domain' }, allow: { to: { type: ['feature-domain', 'shared'] } } },
                    { from: { type: 'feature-application' }, allow: { to: { type: ['feature-domain', 'feature-application', 'shared'] } } },
                    {
                        from: { type: 'feature-infrastructure' },
                        allow: { to: { type: ['feature-domain', 'feature-application', 'feature-infrastructure', 'shared'] } }
                    },
                    {
                        from: { type: 'feature-ui' },
                        allow: { to: { type: ['feature-domain', 'feature-application', 'feature-infrastructure', 'feature-ui', 'shared'] } }
                    }
                ]
            }]
        }
    },
    { files: ['src/**/*.ts', 'src/**/*.tsx'], rules: { '@typescript-eslint/explicit-function-return-type': 'error' } },
    {
        files: ['src/features/*/domain/**/*.ts', 'src/features/*/application/**/*.ts'],
        rules: { '@typescript-eslint/typedef': ['error', { arrowParameter: true, variableDeclaration: true }] }
    },
    {
        files: ['tests/**/*.ts', 'tests/**/*.tsx'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                afterEach: 'readonly',
                beforeEach: 'readonly',
                describe: 'readonly',
                expect: 'readonly',
                it: 'readonly',
                vi: 'readonly'
            }
        },
        rules: { '@typescript-eslint/unbound-method': 'off' }
    }
];
