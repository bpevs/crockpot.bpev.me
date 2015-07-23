-- while running psql in the terminal,
-- run '\i path/to/schema.sql' to generate db and tables locally

-- ---
-- Drop old tables
-- ---

DROP TABLE IF EXISTS "sessions";

-- ---
-- Sessions Table
-- ---

CREATE TABLE sessions (
  "session_id" TEXT,
  "text" TEXT,
  "syntax" TEXT,
  "color" TEXT,
  PRIMARY KEY ("session_id")
);
