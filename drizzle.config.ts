import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { defineConfig } from 'drizzle-kit';

function loadLocalEnv() {
  const path = resolve(process.cwd(), '.env.local');
  if (!existsSync(path)) {
    return;
  }

  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const url = process.env.DATABASE_URL?.trim() ?? '';

if (!url || url === 'pglite' || url.startsWith('pglite:')) {
  throw new Error(
    'db:push には Neon などの Postgres 接続文字列が必要です。.env.local の DATABASE_URL を確認してください。',
  );
}

export default defineConfig({
  schema: './lib/ranking/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url,
  },
});
