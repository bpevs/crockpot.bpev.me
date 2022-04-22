import "dotenv";
import { Client } from "postgres";

import { DB_EVENT_METHOD as DB, DbEvent, DbResponse } from "./constants.ts";

const client = new Client({
  database: Deno.env.get("DB_DATABASE"),
  hostname: Deno.env.get("DB_HOSTNAME"),
  password: Deno.env.get("DB_PASSWORD"),
  port: Deno.env.get("DB_PORT"),
  user: Deno.env.get("DB_USER"),
});

export async function createTable() {
  await client.connect();

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
    // end the client back into the pool
    await client.end();
  }
}

export async function clearSessions() {
  await client.connect();
  try {
    await client.queryObject`TRUNCATE sessions CASCADE;`;
  } finally {
    await client.end();
  }
}

export async function queryDB(params: DbEvent): Promise<DbResponse | void> {
  const { method, sessionId: id, text, syntax } = params;
  await client.connect();

  const queries: Record<DB, string | null> = {
    [DB.CREATE]: "INSERT into sessions (id) VALUES ($ID) RETURNING *;",
    [DB.READ]: "SELECT * FROM sessions WHERE id = $ID;",
    [DB.DELETE]: "DELETE FROM sessions WHERE id = $ID;",
    [DB.UPDATE]: null,
  };

  if (method === DB.CREATE) console.log("Creating Session: ", id);
  if (method === DB.DELETE) console.log("Deleting Session: ", id);

  try {
    if (typeof queries[method] === "string") {
      const queryString = queries[method] as string;
      const result = await client.queryObject<DbResponse>(queryString, { id });
      await client.end();
      return result.rows[0];
    } else if (method === DB.UPDATE) {
      if (text === "") {
        const queryString = queries[DB.DELETE] as string;
        const result = await client.queryObject<DbResponse>(queryString, {
          id,
        });
        await client.end();
        return result.rows[0];
      }
      let query = "UPDATE sessions SET";
      if (text) query += ` text = $TEXT,`;
      if (syntax) query += ` syntax = $SYNTAX,`;
      if (text || syntax) query = query.substring(0, query.length - 1) + " ";
      query += `WHERE id = $ID RETURNING *;`;
      const result = await client.queryObject<DbResponse>(query, {
        id,
        text,
        syntax,
      });
      await client.end();
      return result.rows[0];
    }
  } catch (e) {
    console.error(e);
    return;
  }
}
