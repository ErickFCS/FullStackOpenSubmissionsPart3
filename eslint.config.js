import globals from 'globals'
import pluginJs from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'


/** @type {import('eslint').Linter.Config[]} */
export default [
    pluginJs.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
            ecmaVersion: 'latest',
        },

        plugins: {
            '@stylistic/js': stylisticJs
        },
        rules: {
            '@stylistic/js/indent': [
                'error',
                4
            ],
            '@stylistic/js/linebreak-style': [
                'error',
                'windows'
            ],
            '@stylistic/js/quotes': [
                'error',
                'single'
            ],
            '@stylistic/js/semi': [
                'error',
                'never'
            ],
            'eqeqeq': 'error',
            'no-trailing-spaces': 'error',
            'object-curly-spacing': [
                'error', 'always'
            ],
            'arrow-spacing': [
                'error', { 'before': true, 'after': true },
            ],
            'no-console': 'off',
            'no-unused-vars': 'off',
        },
    },
    {
        ignores: ['dist/**', 'build/**']
    },
]
// export default [
//   { languageOptions: { globals: globals.node } },
//   pluginJs.configs.recommended,
// ]