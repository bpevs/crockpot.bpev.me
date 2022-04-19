import { serve } from "https://deno.land/std@0.135.0/http/server.ts";

import { CLIENT_PORT as port } from "./constants.ts";
import handleHttp from "./handleHttp.ts";
import handleWs from "./handleWs.ts";

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
