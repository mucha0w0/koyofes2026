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

// @ts-ignore: eslint-plugin-tailwindcss has no type definitions
import tailwindcss from 'eslint-plugin-tailwindcss';

// @ts-ignore: eslint-config-prettier has no type definitions
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ⬇️ 【超重要】CJSの二重底（.default）を安全にすり抜けるための設定抽出
const tailwindConfig =
  (tailwindcss as any).configs?.['flat/recommended'] ||
  (tailwindcss as any).default?.configs?.['flat/recommended'] ||
  [];

export default tseslint.config(
  // 1. JavaScriptの基本推奨ルール
  js.configs.recommended,

  // 2. TypeScriptの「型チェック付き」推奨ルール
  tseslint.configs.recommendedTypeChecked,

  // 3. Reactの推奨ルール（型エラー回避のために「as any」を追加）
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

  // 7. React JSX Props の自動ソート
  {
    plugins: {
      react: pluginReact,
    },
    rules: {
      'react/jsx-sort-props': [
        'error',
        {
          reservedFirst: true,
          shorthandFirst: true,
          callbacksLast: true,
          ignoreCase: true,
          noSortAlphabetically: false,
        },
      ],
    },
  },

  // 8. ⬇️ 先ほど抽出した安全な Tailwind 設定をここで展開します
  ...(tailwindConfig as any),

  // 9. 対象ファイルと、TypeScriptの解析設定
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

  // 10. Prettierと競合するルールをすべてOFFにする
  eslintConfigPrettier as any,
);
