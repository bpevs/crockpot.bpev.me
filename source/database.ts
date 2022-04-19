import { Pool } from "https://deno.land/x/postgres/mod.ts";
import {
  DB_EVENT_METHOD as DB,
  DB_PORT as port,
  DbEvent,
  DbResponse,
} from "./constants.ts";

const POOL_CONNECTIONS = 3;

const pool = new Pool({
  database: "crockpot",
  hostname: "localhost",
  port,
  user: "ben",
}, POOL_CONNECTIONS);

// Connect to the database
const client = await pool.connect();

try {
  await client.queryObject`
    -- ---
    -- Drop old tables. We want to reset data on release.
    -- ---
    DROP TABLE IF EXISTS "sessions";

    -- ---
    -- Sessions Table
    -- ---
    CREATE TABLE sessions (
      "id" TEXT,
      "text" TEXT,
      "syntax" TEXT,
      PRIMARY KEY ("id")
    );
  `;
} finally {
  // Release the client back into the pool
  client.release();
}

export async function clearSessions() {
  const client = await pool.connect();
  try {
    await client.queryObject`TRUNCATE sessions CASCADE;`;
  } finally {
    client.release();
  }
}

export async function queryDB(params: DbEvent): Promise<DbResponse> {
  const { method, sessionId: id, text, syntax } = params;
  console.log("DB", method, ": ", id);
  const client = await pool.connect();

  const queries: Record<DB, string | null> = {
    [DB.CREATE]: "INSERT into sessions (id) VALUES ($ID) RETURNING *;",
    [DB.READ]: "SELECT * FROM sessions WHERE id = $ID;",
    [DB.DELETE]: "DELETE FROM sessions WHERE id = $ID;",
    [DB.UPDATE]: null,
  };

  if (typeof queries[method] === "string") {
    const queryString = queries[method] as string;
    const result = await client.queryObject<DbResponse>(queryString, { id });
    client.release();
    return result.rows[0];
  } else if (method === DB.UPDATE) {
    let query = "UPDATE sessions SET";
    if (text) query += ` text = $TEXT,`;
    if (syntax) query += ` syntax = $SYNTAX,`;
    if (text || syntax) query = query.substring(0, query.length - 1) + " ";
    query += `WHERE id = $ID RETURNING *;`;
    const result = await client.queryObject<DbResponse>(query, { id, text, syntax });
    client.release();
    return result.rows[0];
  } else {
    throw new Error("Invalid DB Operation");
  }
}
