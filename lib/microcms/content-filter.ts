/**
 * ローカルスナップショットに対して、サイトが使っている microCMS の filters を適用する。
 * 対応するのは `field[equals|not_equals|contains|not_contains]value` と、それらの `[and]`。
 */

export interface LocalListQuery {
  limit?: number;
  offset?: number;
  filters?: string;
}

export interface LocalListPage<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

const DEFAULT_LIMIT = 100;
const FILTER_CLAUSE = /^([A-Za-z0-9_-]+)\[(equals|not_equals|contains|not_contains)\]([\s\S]*)$/;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function equalsValue(actual: unknown, expected: string): boolean {
  if (typeof actual === 'string' || typeof actual === 'number' || typeof actual === 'boolean') {
    return String(actual) === expected;
  }
  if (Array.isArray(actual)) {
    return actual.some((item) => equalsValue(item, expected));
  }
  return false;
}

/** 文字列は部分一致。選択フィールド（配列）は要素の完全一致。 */
function containsValue(actual: unknown, expected: string): boolean {
  if (typeof actual === 'string') return actual.includes(expected);
  if (Array.isArray(actual)) {
    return actual.some((item) => typeof item === 'string' && item === expected);
  }
  return false;
}

function matchesClause(item: unknown, clause: string): boolean {
  const record = asRecord(item);
  if (!record) return false;
  const match = FILTER_CLAUSE.exec(clause.trim());
  if (!match) return false;
  const field = match[1];
  const operator = match[2];
  const expected = match[3] ?? '';
  if (!field || !operator) return false;
  const actual = record[field];
  switch (operator) {
    case 'equals':
      return equalsValue(actual, expected);
    case 'not_equals':
      return !equalsValue(actual, expected);
    case 'contains':
      return containsValue(actual, expected);
    case 'not_contains':
      return !containsValue(actual, expected);
    default:
      return false;
  }
}

export function applyMicroCMSFilters<T>(contents: readonly T[], filters?: string): T[] {
  const trimmed = filters?.trim();
  if (!trimmed) return [...contents];
  const clauses = trimmed
    .split('[and]')
    .map((clause) => clause.trim())
    .filter((clause) => clause.length > 0);
  return contents.filter((item) => clauses.every((clause) => matchesClause(item, clause)));
}

/** 一覧 API の 1 ページ分。limit 未指定時は microCMS と同じ 100 件。 */
export function sliceMicroCMSPage<T>(contents: readonly T[], query: LocalListQuery = {}): LocalListPage<T> {
  const filtered = applyMicroCMSFilters(contents, query.filters);
  const offset = query.offset ?? 0;
  const limit = query.limit ?? DEFAULT_LIMIT;
  return {
    contents: filtered.slice(offset, offset + limit),
    totalCount: filtered.length,
    offset,
    limit,
  };
}

export function findMicroCMSContent<T extends { id: string }>(contents: readonly T[], contentId: string): T | null {
  return contents.find((item) => item.id === contentId) ?? null;
}
