import { serveFile } from "std/file_server";

import { DB_EVENT_METHOD as DB } from "./constants.ts";
import { queryDB } from "./database.ts";

export default async function handleHttp(req: Request): Promise<Response> {
  const pathname = new URL(req.url).pathname;

  try {
    let filepath = pathname;
    if (pathname === "/") filepath = "index.html";
    if (pathname === "/about") filepath = "about.html";

    const response = await serveFile(req, `./source/public/${filepath}`);
    return response;
  } catch {
    // If not a file, assume is sessionId
    const sessionId = pathname.substring(1);
    const existingSession = await queryDB({ method: DB.READ, sessionId });
    if (!existingSession) {
      await queryDB({ method: DB.CREATE, sessionId });
    }
    return serveFile(req, `./source/public/code.html`);
  }
}
