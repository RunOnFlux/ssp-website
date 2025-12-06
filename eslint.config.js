const js = require('@eslint/js')
const nextPlugin = require('@next/eslint-plugin-next')
const prettierConfig = require('eslint-config-prettier')
const importPlugin = require('eslint-plugin-import')
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y')
const prettierPlugin = require('eslint-plugin-prettier')
const reactPlugin = require('eslint-plugin-react')
const reactHooksPlugin = require('eslint-plugin-react-hooks')

module.exports = [
  js.configs.recommended,
  prettierConfig,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...require('globals').browser,
        ...require('globals').node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      import: {
        resolver: {
          node: {
            extensions: ['.js', '.jsx'],
          },
        },
      },
    },
    files: ['**/*.{js,jsx}'],
    rules: {
      // React specific rules
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/prop-types': 'off', // Using TypeScript or not enforcing prop-types
      'react/jsx-key': 'error',
      'react/jsx-uses-react': 'error', // Tells ESLint that React is used when JSX is present
      'react/jsx-uses-vars': 'error', // Tells ESLint that JSX components count as "used"
      'react/no-unescaped-entities': 'off', // Let Next.js handle this

      // React Hooks rules
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off', // Allow setState in effects for client-only browser detection

      // Next.js specific rules
      '@next/next/no-img-element': 'error',

      // Import organization
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // General good practices (non-formatting)
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',

      // Prettier integration - shows formatting issues as ESLint errors
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      '.nuxt/**',
      '.output/**',
      '.vercel/**',
      '.netlify/**',
    ],
  },
]
