window.onload = function () {
  const location = document.location;
  let scheme = 'ws';
  if (location.protocol === 'https:') scheme += 's';

  const serverUrl = `${scheme}://${location.hostname}:${location.port}`;
  const socket = new WebSocket(serverUrl);

  const sessionId = window.location.pathname.substring(1);
  let editor;

  const el = {
    syntax: document.getElementById("syntax"),
    color: document.getElementById("color"),
    text: document.getElementById("text"),
  };

  socket.onopen = () => {
    socket.send(JSON.stringify({ method: "INIT", sessionId }));
  };

  socket.onmessage = (event) => {
    const { method, sessionId, syntax, text, change } = JSON.parse(event.data);
    console.log("MESSAGE: ", method);

    if (method === "INIT") {
      el.syntax.value = syntax || "text";
      el.color.value = window.localStorage.getItem("color") || "default";

      editor = CodeMirror(el.text, {
        lineNumbers: true,
        mode: syntax || "text",
        theme: window.localStorage.getItem("color") || "default",
        tabSize: 2,
      });

      editor.setValue(text || "");

      editor.on("change", (mirror, change) => {
        if (change.origin !== undefined && change.origin !== "setValue") {
          socket.send(JSON.stringify({ method: "CHANGE", sessionId, change }));
          socket.send(
            JSON.stringify({
              method: "SAVE",
              sessionId,
              text: editor.getValue(),
            }),
          );
        }
      });

      el.syntax.addEventListener("change", () => {
        socket.send(
          JSON.stringify({
            method: "CHANGE",
            sessionId,
            syntax: el.syntax.value,
          }),
        );
        editor.setOption("mode", el.syntax.value);
      });

      el.color.addEventListener("change", (event) => {
        window.localStorage.setItem("color", el.color.value);
        editor.setOption("theme", el.color.value);
      });
    } else if (method === "CHANGE") {
      // Update for changes to an existing session, on update from server
      if (change) {
        const { text, from, to } = change;
        editor.replaceRange(text, from, to);
      }

      if (syntax) {
        editor.setOption("mode", syntax);
        el.syntax.value = syntax || "text";
      }
    }
  };
};
