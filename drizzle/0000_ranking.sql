CREATE TABLE IF NOT EXISTS "ranking_visits" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "visitor_id" uuid NOT NULL,
  "slug" text NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "ranking_visits_visitor_slug_created_idx"
  ON "ranking_visits" ("visitor_id", "slug", "created_at");

CREATE INDEX IF NOT EXISTS "ranking_visits_slug_created_idx"
  ON "ranking_visits" ("slug", "created_at");

CREATE TABLE IF NOT EXISTS "ranking_votes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "visitor_id" uuid NOT NULL,
  "slug" text NOT NULL,
  "stars" smallint NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "ranking_votes_stars_range" CHECK ("stars" >= 1 AND "stars" <= 5)
);

CREATE INDEX IF NOT EXISTS "ranking_votes_visitor_slug_created_idx"
  ON "ranking_votes" ("visitor_id", "slug", "created_at");

CREATE INDEX IF NOT EXISTS "ranking_votes_slug_idx"
  ON "ranking_votes" ("slug");
