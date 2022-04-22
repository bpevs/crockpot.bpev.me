# Crockpot

Think of this as a quick-access google docs with syntax highlighting. Powered via websockets + codemirror.

Going to https://crockpot.bpev.me will create a new room.
You can then copypasta the new url, and share it.
Anyone else with the same url will see the same thing you do.

![Example of the app running](https://bpev.me/images/ad29754b.png)

# Usage

You need to have [deno](https://deno.land) installed and [postgres db](https://www.postgresql.org) running to start this app.

Create and fill out a `.env` file, based on `.env.example`.

```
CLIENT_PORT=8080
DB_DATABASE="crockpot"
DB_HOSTNAME="localhost"
DB_PASSWORD=""
DB_PORT=5432
DB_USER="ben"
```
Then start the app with `make watch`.

A crockpot server should now start.
You should be able to access at http://localhost:{CLIENT_PORT}
If it is inaccessible, make sure you are `http`, and that you added a CLIENT_PORT to `.env`.
If no CLIENT_PORT is given, we default to 8080.
