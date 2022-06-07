import { DB_EVENT_METHOD as DB, DbEvent, DbResponse } from "./constants.ts";

export function queryDB(params: DbEvent): DbResponse | void {
  const { method, sessionId: id, text, syntax } = params;

  if (method === DB.CREATE) console.log("Creating Session: ", id);
  if (method === DB.DELETE) console.log("Deleting Session: ", id);

  if (method === DB.CREATE) {
    sessionStorage.setItem(id, JSON.stringify({ id, text, syntax }));
  } else if (method === DB.READ) {
    const session = sessionStorage.getItem(id);
    if (session) return JSON.parse(session);
  } else if (method === DB.DELETE) {
    sessionStorage.removeItem(id);
  } else if (method === DB.UPDATE) {
    const sessionStr = sessionStorage.getItem(id);
    if (!sessionStr) return;

    const session = JSON.parse(sessionStr);
    if (text) session.text = text;
    if (syntax) session.syntax = syntax;
    sessionStorage.setItem(id, JSON.stringify(session));
  }
}
