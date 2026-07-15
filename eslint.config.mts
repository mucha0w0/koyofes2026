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

// CJSの二重底（.default）を安全にすり抜けるための設定抽出
const tailwindConfig = (tailwindcss as any).configs?.['flat/recommended']
  || (tailwindcss as any).default?.configs?.['flat/recommended']
  || [];

export default tseslint.config(
  // 1. 【最重要】ビルド成果物や設定ファイルを不要な警告から除外する（完全無視設定）
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'out/**',
      'next.config.mjs',
      'postcss.config.mjs',
    ],
  },

  // 2. 基本的な推奨ルールセット
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  pluginReact.configs.flat.recommended as any,

  // 3. 【最重要】設定ファイルやJSファイルに対して型チェックルールを無効化する
  // これにより、eslint.config.mts自身やJSファイルで「tsconfigにありません」エラーが出るのを防ぎます
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', 'eslint.config.mts'],
    ...tseslint.configs.disableTypeChecked,
  },

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

  // 7. React JSX Props の自動ソート ＆ JSXでのReactインポート強制の無効化
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
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },

  // 8. Tailwind CSS の推奨ルール
  ...(tailwindConfig as any),

  // 9. TypeScriptの型情報が必要なアプリコード（TS/TSX）にのみtsconfigを紐付ける
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },

  // 10. すべてのファイルに対する共通設定（グローバル変数の定義）
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 11. 実開発を快適にするための、TypeScriptの「厳しすぎるルール」の緩和
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },

  // 12. Prettierと競合するルールをすべてOFFにする
  eslintConfigPrettier as any
);