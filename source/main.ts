import "https://deno.land/x/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.136.0/http/server.ts";

import handleHttp from "./handleHttp.ts";
import handleWs from "./handleWs.ts";

const port = parseInt(Deno.env.get("CLIENT_PORT") || "8080");
serve(handler, { port });
console.log(`Server running on http://localhost:${port}/`);

async function handler(req: Request): Promise<Response> {
  const upgrade = req.headers.get("upgrade") || "";
  let response, socket: WebSocket;
  try {
    ({ response, socket } = Deno.upgradeWebSocket(req));
  } catch {
    return handleHttp(req);
  }
  handleWs(socket);
  return response;
}
