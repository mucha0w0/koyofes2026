import { index, pgTable, smallint, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const rankingVisits = pgTable(
  'ranking_visits',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    visitorId: uuid('visitor_id').notNull(),
    slug: text('slug').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('ranking_visits_visitor_slug_created_idx').on(table.visitorId, table.slug, table.createdAt),
    index('ranking_visits_slug_created_idx').on(table.slug, table.createdAt),
  ],
);

export const rankingVotes = pgTable(
  'ranking_votes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    visitorId: uuid('visitor_id').notNull(),
    slug: text('slug').notNull(),
    stars: smallint('stars').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('ranking_votes_visitor_slug_created_idx').on(table.visitorId, table.slug, table.createdAt),
    index('ranking_votes_slug_idx').on(table.slug),
  ],
);
