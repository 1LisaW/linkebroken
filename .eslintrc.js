module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 7,
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended'
    ],
    plugins: [
        'react',
        'react-hooks'
    ],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 0,
        'react/prop-types': 0,
        'no-console': 0,
        'no-undef': 0,
        'no-unused-vars': 0,
        'no-unreachable': 0
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
