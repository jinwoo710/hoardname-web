import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files:['**/*.ts','**/*.tsx'],
    plugins: {
      'prettier': prettierPlugin,
      'import': importPlugin,
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions:{
      parser: typescriptParser,
      parserOptions: {
        project:'./tsconfig.json',
    },
  },
  
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
      }],
      "no-unused-vars": "off",
      'no-console':'warn',
      'import/order':['error',{
        groups:['builtin','external','internal'],
        'newlines-between': 'always'
      }],
      'prettier/prettier': 'error',
  },
settings:{
  'import/resolver':{
    typescript:true,
    node:true
  }
}}
];

export default eslintConfig;
