import { readableStreamFromReader } from "https://deno.land/std/streams/mod.ts";
import { serveFile } from "https://deno.land/std@0.135.0/http/file_server.ts";

import { DB_EVENT_METHOD as DB } from "./constants.ts";
import { queryDB } from "./database.ts";

export default async function handleHttp(req: Request): Promise<Response> {
  const pathname = new URL(req.url).pathname;

  try {
    const filepath = pathname === "/" ? "index.html" : pathname;
    const response = await serveFile(req, `./source/public/${filepath}`);
    return response;
  } catch {
    // If not a file, assume is sessionId
    const sessionId = pathname.substring(1);
    const existingSession = await queryDB({ method: DB.READ, sessionId });
    if (!existingSession) {
      await queryDB({ method: DB.CREATE, sessionId });
      console.log(`new session: ${sessionId}`);
    }
    return serveFile(req, `./source/public/code.html`);
  }
}
