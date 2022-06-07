import { DB_EVENT_METHOD as DB, DbEvent, DbResponse } from "./constants.ts";

const storage: {
  [id: string]: {
    id: string;
    text?: string;
    syntax?: string;
  };
} = {};

export function queryDB(params: DbEvent): DbResponse | void {
  const { method, sessionId: id, text, syntax } = params;

  if (method === DB.CREATE) console.log("Creating Session: ", id);
  if (method === DB.DELETE) console.log("Deleting Session: ", id);

  if (method === DB.CREATE) {
    storage[id] = { id, text, syntax };
  } else if (method === DB.READ) {
    return storage[id];
  } else if (method === DB.DELETE) {
    delete storage[id];
  } else if (method === DB.UPDATE) {
    const session = storage[id];
    if (!session) return;
    if (text) session.text = text;
    if (syntax) session.syntax = syntax;
    storage[id] = session;
  }
}
