import { v4 } from "std/uuid";

import {
  CLIENT_EVENT_METHOD as CLIENT,
  ClientEvent,
  DB_EVENT_METHOD as DB,
} from "./constants.ts";
import { queryDB } from "./database.ts";

interface User {
  userId: string;
  socket: WebSocket;
  sessionId?: string;
}
const usersMap: Map<string, User> = new Map();

// Types of changes we want to relay to active clients
const updateOrigins = ["+input", "paste", "+delete", "undo", "cut", "redo"];

export default function handleWebSockets(request: Request, socket: WebSocket) {
  const currUserId = v4.generate();
  const currUser: User | void = {
    userId: currUserId,
    socket,
  };
  const currSession: {
    sessionId?: string;
    syntax?: string;
    text?: string;
  } = {};

  socket.onopen = async () => {
    const sessionId = new URL(request.url).pathname.split("/")[1];
    currUser.sessionId = sessionId;
    currSession.sessionId = sessionId;
    currSession.text = text;
    currSession.syntax = syntax;
    usersMap.set(currUserId, currUser);
    try {
      const queryResponse = await queryDB({ method: DB.READ, sessionId });
      if (queryResponse) {
        return socket.send(JSON.stringify({
          method: CLIENT.INIT,
          sessionId: queryResponse.id,
          text: queryResponse.text,
          syntax: queryResponse.syntax || "text",
        }));
      }
    } catch {
      console.error("Could not read session", sessionId);
    }
  };

  socket.onclose = () => {
    usersMap.delete(currUserId);
    if (usersMap.size === 0 && currSession.sessionId && !currSession.text) {
      queryDB({ method: DB.DELETE, sessionId: currSession.sessionId });
    }
    delete currSession.sessionId;
    delete currSession.text;
    delete currSession.syntax;
  };

  socket.onmessage = (event: MessageEvent<string>) => {
    const { change, method, sessionId, syntax, text } = JSON.parse(event.data);

    switch (method) {
      case CLIENT.SAVE:
        currSession.text = text;
        currSession.syntax = syntax;
        return queryDB({ method: DB.UPDATE, sessionId, text, syntax });

      case CLIENT.CHANGE: {
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
    }
  };
}
