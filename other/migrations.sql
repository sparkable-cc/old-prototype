CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;

-- sessions
-- @see https://github.com/voxpelli/node-connect-pg-simple/blob/v6.2.1/table.sql
-- renamed session to sessions
CREATE TABLE "sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (
  OIDS = FALSE
);

ALTER TABLE "sessions"
  ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_sessions_expire" ON "sessions" ("expire");

--
-- Version 0.0.1-alpha-vorversion
--
CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  email citext NOT NULL,
  username citext NOT NULL,
  bio text,
  city text,
  country text,
  stage citext,
  picture_url citext,
  date_created timestamp with time zone NOT NULL DEFAULT now(),
  date_verified timestamp with time zone,
  tokens integer NOT NULL DEFAULT 0,
  hash text NOT NULL
);

CREATE TABLE categories (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  title text NOT NULL
);

CREATE TABLE contents (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  type citext NOT NULL,
  url citext NOT NULL,
  title text NOT NULL,
  description text,
  teaser_image_url citext,
  category_id uuid NOT NULL
);

CREATE TABLE submissions (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
  content_id uuid NOT NULL REFERENCES contents (id) ON DELETE SET NULL ON UPDATE CASCADE,
  date_posted timestamp with time zone DEFAULT now(),
  comment text,
  stage citext NOT NULL
);

CREATE TABLE ballots (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
  vote citext NOT NULL,
  submission_id uuid NOT NULL REFERENCES submissions (id) ON DELETE SET NULL ON UPDATE CASCADE,
  dated_voted timestamp with time zone NOT NULL DEFAULT now(),
  stage citext NOT NULL,
  comment text
);

--
-- Version 0.0.2
--
INSERT INTO categories ("title")
  VALUES (E'Technologie'), (E'Klima'), (E'Politik'), (E'Kunst'), (E'Weltraum');

---
--- Version 0.0.3
---
ALTER TABLE contents
  ADD COLUMN "og" jsonb,
  DROP COLUMN "category_id";

ALTER TABLE submissions
  ADD COLUMN "category_id" uuid NOT NULL,
  ADD FOREIGN KEY ("category_id") REFERENCES "public"."categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Version 0.0.4
--
ALTER TABLE "public"."users"
  ADD UNIQUE ("email"),
  ADD UNIQUE ("username");

ALTER TABLE "public"."contents"
  ADD COLUMN "date_created" timestamp with time zone NOT NULL DEFAULT now();

