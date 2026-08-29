import 'server-only';

/**
 * Vercel ENV `STAMP_TOKEN_MAP` をパースする。
 * 形式: {"ランダムトークン":"ブースのslug", ...}
 */
export function getStampTokenMap(): Record<string, string> {
  const raw = process.env.STAMP_TOKEN_MAP;

  if (!raw) {
    throw new Error('STAMP_TOKEN_MAP が設定されていません');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('STAMP_TOKEN_MAP が正しい JSON ではありません');
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('STAMP_TOKEN_MAP はオブジェクト形式の JSON である必要があります');
  }

  const map: Record<string, string> = {};
  for (const [token, slug] of Object.entries(parsed)) {
    if (typeof slug !== 'string' || slug.length === 0) {
      throw new Error(`STAMP_TOKEN_MAP の値は非空文字列の slug である必要があります: token=${token}`);
    }
    map[token] = slug;
  }

  return map;
}

/** token から slug を解決。無効なら null */
export function resolveSlugFromToken(token: string): string | null {
  const map = getStampTokenMap();
  return map[token] ?? null;
}
