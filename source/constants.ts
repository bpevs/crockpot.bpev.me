export enum DB_EVENT_METHOD {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export interface DbEvent {
  method: DB_EVENT_METHOD;
  sessionId: string;
  syntax?: string;
  text?: string;
}

export interface DbResponse {
  id: string;
  syntax?: string;
  text?: string;
}

export enum CLIENT_EVENT_METHOD {
  INIT = "INIT", // start a session (create/read from db)
  CHANGE = "CHANGE", // send updates to other open sockets (no db access)
  SAVE = "SAVE", // save: write updates to db (write to db)
}

interface CodeMirrorPosition {
  line: number;
  ch: number;
}

interface CodeMirrorChange {
  from: CodeMirrorPosition;
  to: CodeMirrorPosition;
  text: string[];
  origin: string;
}

export interface ClientEvent {
  method: CLIENT_EVENT_METHOD;
  sessionId: string;
  change?: CodeMirrorChange; // some obj defined by codemirror
  syntax?: string;
  text?: string;
}
