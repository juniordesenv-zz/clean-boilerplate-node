module.exports = {
    'extends': [
        'airbnb-typescript/base'
    ],
    'rules': {
        'import/prefer-default-export': 'off',
        'no-underscore-dangle': 'off',
        'class-methods-use-this': 'off',
        'no-restricted-syntax': 'off'
    },
    'parserOptions': {
        'project': './tsconfig.json'
    },
    'overrides': [{
        'files': [ '*.spec.ts' ],
        'rules': {
          'max-classes-per-file': 0,
          '@typescript-eslint/no-unused-vars': 0,
        }
    }]
};
