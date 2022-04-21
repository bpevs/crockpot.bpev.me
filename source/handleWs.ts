import { v4 } from "https://deno.land/std@0.136.0/uuid/mod.ts";

import {
  CLIENT_EVENT_METHOD as CLIENT,
  ClientEvent,
  DB_EVENT_METHOD as DB,
} from "./constants.ts";
import { queryDB } from "./database.ts";

interface User {
  userId: string;
  sessionId: string;
  socket: WebSocket;
}
const usersMap: Map<string, User> = new Map();

// Types of changes we want to relay to active clients
const updateOrigins = ["+input", "paste", "+delete", "undo", "cut", "redo"];

export default function handleWebSockets(socket: WebSocket) {
  const currUserId = v4.generate();

  socket.onclose = () => {
    usersMap.delete(currUserId);
  };

  socket.onmessage = async (event: MessageEvent<string>) => {
    let currUser: User | void;
    const { change, method, sessionId, syntax, text } = JSON.parse(event.data);
    console.log("MESSAGE", method, ":", sessionId);

    switch (method) {
      case CLIENT.INIT:
        currUser = { userId: currUserId, sessionId, socket };
        usersMap.set(currUserId, currUser);

        const queryResponse = await queryDB({ method: DB.READ, sessionId });
        return socket.send(JSON.stringify({
          method: CLIENT.INIT,
          sessionId: queryResponse.id,
          text: queryResponse.text,
          syntax: queryResponse.syntax || "text",
        }));

      case CLIENT.SAVE:
        return queryDB({ method: DB.UPDATE, sessionId, text, syntax });

      case CLIENT.CHANGE:
        const changeResp: ClientEvent = { method: CLIENT.CHANGE, sessionId };

        if (updateOrigins.includes(change?.origin)) changeResp.change = change;

        if (syntax) {
          changeResp.syntax = syntax;
          queryDB({ method: DB.UPDATE, sessionId, syntax });
        }

        if (changeResp.change || changeResp.syntax) {
          for (const [userId, user] of usersMap) {
            // User is not currUser, but IS in current session
            if (currUserId !== userId && sessionId === user.sessionId) {
              user.socket.send(JSON.stringify(changeResp));
            }
          }
        }
    }
  };
}
