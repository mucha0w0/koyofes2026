import { createHmac, timingSafeEqual } from 'node:crypto';

import { CMS_TAGS, eventSlugTag, isCmsApi, isSafePathSegment, newsIdTag, type CmsApi } from '@/lib/microcms/tags';

const LIST_PATHS: Record<CmsApi, readonly string[]> = {
  events: ['/', '/events/list', '/events/recommended', '/events/timetable', '/stamp', '/about/sponsor', '/sitemap.xml'],
  news: ['/', '/official/news', '/sitemap.xml'],
  parts: ['/', '/about/part', '/events/recommended'],
  sponsors: ['/', '/about/sponsor'],
};

export type WebhookDecision =
  | { kind: 'unauthorized-service' }
  | { kind: 'ignored'; reason: 'draft' | 'unknown-api' | 'invalid-body' }
  | {
      kind: 'revalidate';
      api: CmsApi;
      type: string | null;
      tags: string[];
      paths: string[];
      /** 詳細 URL が増える、または slug / id が変わる。再ビルドが必要。 */
      deploy: boolean;
    };

export function verifyMicroCMSSignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) {
    return false;
  }

  const expected = createHmac('sha256', secret).update(body).digest('hex');
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export function isVercelDeployHookUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.hostname === 'api.vercel.com' &&
      url.pathname.startsWith('/v1/integrations/deploy/')
    );
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readStatuses(state: unknown): string[] {
  if (!isRecord(state) || !Array.isArray(state.status)) {
    return [];
  }
  return state.status.filter((item): item is string => typeof item === 'string');
}

function hasStatus(state: unknown, status: string): boolean {
  return readStatuses(state).includes(status);
}

function readNestedString(state: unknown, key: 'slug' | 'id'): string | null {
  if (!isRecord(state)) {
    return null;
  }

  if (key === 'id' && typeof state.id === 'string' && isSafePathSegment(state.id)) {
    return state.id;
  }

  for (const field of ['publishValue', 'draftValue'] as const) {
    const value = state[field];
    if (!isRecord(value)) {
      continue;
    }
    const nested = value[key];
    if (typeof nested === 'string' && isSafePathSegment(nested)) {
      return nested;
    }
  }

  return null;
}

function unique(values: Array<string | null>): string[] {
  return [...new Set(values.filter((value): value is string => value !== null))];
}

/**
 * 署名検証済みの Webhook ボディから、無効化するタグとパスを決める。
 * 下書きだけの変更は何もしない。公開 URL が増える変更は deploy を立てる。
 */
export function planMicroCMSRevalidation(payload: unknown, serviceDomain: string): WebhookDecision {
  if (!isRecord(payload) || typeof payload.service !== 'string' || typeof payload.api !== 'string') {
    return { kind: 'ignored', reason: 'invalid-body' };
  }

  if (payload.service !== serviceDomain) {
    return { kind: 'unauthorized-service' };
  }

  if (!isCmsApi(payload.api)) {
    return { kind: 'ignored', reason: 'unknown-api' };
  }

  const api = payload.api;
  const type = typeof payload.type === 'string' ? payload.type : null;
  const bodyId = typeof payload.id === 'string' && isSafePathSegment(payload.id) ? payload.id : null;
  const contents = isRecord(payload.contents) ? payload.contents : null;
  const oldState = contents ? contents.old : null;
  const newState = contents ? contents.new : null;

  if (contents) {
    const touchedPublished =
      hasStatus(oldState, 'PUBLISH') ||
      hasStatus(oldState, 'CLOSED') ||
      hasStatus(newState, 'PUBLISH') ||
      hasStatus(newState, 'CLOSED');
    if (!touchedPublished) {
      return { kind: 'ignored', reason: 'draft' };
    }
  }

  const tags = new Set<string>([CMS_TAGS[api]]);
  const paths = new Set<string>(LIST_PATHS[api]);

  const oldSlug = readNestedString(oldState, 'slug');
  const newSlug = readNestedString(newState, 'slug');
  const oldId = readNestedString(oldState, 'id') ?? (newState ? null : bodyId);
  const newId = readNestedString(newState, 'id') ?? bodyId;

  if (api === 'events') {
    for (const slug of unique([oldSlug, newSlug])) {
      const tag = eventSlugTag(slug);
      if (tag) {
        tags.add(tag);
      }
      paths.add(`/events/${slug}`);
    }
  }

  if (api === 'news') {
    for (const id of unique([oldId, newId, bodyId])) {
      const tag = newsIdTag(id);
      if (tag) {
        tags.add(tag);
      }
      paths.add(`/official/news/${id}`);
    }
  }

  const newlyPublished = hasStatus(newState, 'PUBLISH') && !hasStatus(oldState, 'PUBLISH');
  const slugChanged = oldSlug !== null && newSlug !== null && oldSlug !== newSlug;
  const idChanged = oldId !== null && newId !== null && oldId !== newId;
  const deploy =
    (api === 'events' && (newlyPublished || slugChanged)) || (api === 'news' && (newlyPublished || idChanged));

  return {
    kind: 'revalidate',
    api,
    type,
    tags: [...tags],
    paths: [...paths],
    deploy,
  };
}
