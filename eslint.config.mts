import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// @ts-ignore: @next/eslint-plugin-next has no type definitions
import nextPlugin from '@next/eslint-plugin-next';

// @ts-ignore: eslint-plugin-unused-imports has no type definitions
import unusedImports from 'eslint-plugin-unused-imports';

// @ts-ignore: eslint-plugin-import has no type definitions
import importPlugin from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  // 1. JavaScriptの基本推奨ルール
  js.configs.recommended,

  // 2. TypeScriptの「型チェック付き」推奨ルール
  tseslint.configs.recommendedTypeChecked,

  // 3. React of 推奨ルール（型エラー回避のために「as any」を追加）
  pluginReact.configs.flat.recommended as any,

  // 4. Next.jsのルール適用
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // 5. 未使用インポートの自動削除ルール
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  // 6. インポート順の自動整列ルール
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['builtin'],
          pathGroups: [
            {
              pattern: '@/components/**',
              group: 'internal',
              position: 'before',
            },
          ],
          alphabetize: {
            order: 'asc',
          },
        },
      ],
    },
  },

  // 7. ⬇️ 【新規追加】React JSX Props の自動ソート
  {
    plugins: {
      react: pluginReact,
    },
    rules: {
      'react/jsx-sort-props': [
        'error',
        {
          // key や ref などの特殊な React 専用プロパティを最優先で一番上に置く
          reservedFirst: true,
          // disabled のような、値の書かれていない省略形の props を上に集める
          shorthandFirst: true,
          // onClick などのイベント（コールバック関数）は一番下に集める（見やすさが跳ね上がります！）
          callbacksLast: true,
          // アルファベット順でソートする際、大文字小文字を区別しない
          ignoreCase: true,
          noSortAlphabetically: false,
        },
      ],
    },
  },

  // 8. 対象ファイルと、TypeScriptの解析設定
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
);
