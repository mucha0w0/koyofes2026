CREATE TABLE IF NOT EXISTS "ranking_waits" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "visitor_id" uuid NOT NULL,
  "slug" text NOT NULL,
  "level" smallint NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "ranking_waits_level_range" CHECK ("level" >= 1 AND "level" <= 4)
);

CREATE INDEX IF NOT EXISTS "ranking_waits_visitor_slug_created_idx"
  ON "ranking_waits" ("visitor_id", "slug", "created_at");

CREATE INDEX IF NOT EXISTS "ranking_waits_slug_created_idx"
  ON "ranking_waits" ("slug", "created_at");
