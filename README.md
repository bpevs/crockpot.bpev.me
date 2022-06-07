# Crockpot

Think of this as a quick-access google docs with syntax highlighting. Built with [Deno](https://deno.land). Powered via websockets + [codemirror](https://github.com/codemirror/codemirror).

- Going to https://crockpot.bpev.me will create a new room.
- You can then copypasta the new url, and share it.
- Anyone else with the same url will see the same thing you do.

![Example of the app running](https://bpev.me/images/ad29754b.png)

# Usage

You need to have [deno](https://deno.land) installed to start this app.

You can run `make watch` to start the server. You can access at http://localhost:{CLIENT_PORT}

> If it is inaccessible, make sure you are `http`, and that you added a CLIENT_PORT to `.env`.
