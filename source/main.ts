import "dotenv";
import { serve } from "std/server";

import handleHttp from "./handleHttp.ts";
import handleWs from "./handleWs.ts";

const port = parseInt(Deno.env.get("CLIENT_PORT") || "8080");
serve(handler, { port });
console.log(`Server running on http://localhost:${port}/`);

function handler(request: Request): Promise<Response> {
  let response, socket: WebSocket;
  try {
    ({ response, socket } = Deno.upgradeWebSocket(request));
  } catch {
    return handleHttp(request);
  }
  handleWs(request, socket);
  return Promise.resolve(response);
}
