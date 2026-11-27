# Fastify API

A small TypeScript REST API for managing items, with an optional React and
Tailwind CSS frontend in `web/`. The API uses Fastify 5, serves interactive
OpenAPI documentation, and listens on `127.0.0.1:5000` by default.

## Requirements

- Node.js 22 or later
- npm

## Run the API

Install dependencies and start the development server from the repository root:

```sh
npm install
npm run dev
```

The development command compiles the TypeScript API and starts it with nodemon.
To create a production build and run it:

```sh
npm run build
npm start
```

The server reads optional `PORT` and `HOST` variables from the environment or a
root-level `.env` file. Defaults are `PORT=5000` and `HOST=127.0.0.1`. To make
the API reachable from other devices or containers, set `HOST=0.0.0.0` and
configure your network access appropriately.

For example, a root-level `.env` file can contain:

```dotenv
PORT=5000
HOST=127.0.0.1
```

## API

All item endpoints use JSON. An item has this shape:

```json
{
  "id": "1",
  "name": "Item 1"
}
```

| Method | Path | Description | Success response |
| --- | --- | --- | --- |
| `GET` | `/items` | List all items | `200`, array of items |
| `GET` | `/items/:id` | Get one item | `200`, item |
| `POST` | `/items` | Create an item with a JSON `{ "name": "..." }` body | `201`, created item |
| `PUT` | `/items/:id` | Replace an item's name with a JSON `{ "name": "..." }` body | `200`, updated item |
| `DELETE` | `/items/:id` | Delete an item | `200`, deleted item |

Item IDs are strings. The API starts with three sample items (`1`, `2`, and
`3`); newly created items receive UUIDs. Requests for an unknown ID return
`404` with an `Item not found` message.

Interactive API documentation is available at [http://127.0.0.1:5000/docs/](http://127.0.0.1:5000/docs/)
while the API is running.

Example requests:

```sh
curl http://127.0.0.1:5000/items
curl http://127.0.0.1:5000/items/1
curl -X POST http://127.0.0.1:5000/items \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Notebook\"}"
```

## Frontend

The `web/` directory contains a Vite, React, TypeScript, and Tailwind CSS app
for browsing, searching, creating, editing, and deleting items. Start the API
first, then run the frontend in a second terminal:

```sh
cd web
npm install
npm run dev
```

Open the local address printed by Vite. Its development server proxies `/items`
and `/docs` to `http://127.0.0.1:5000`. Set `VITE_API_PROXY_TARGET` in
`web/.env` to point the proxy at a different API address.

Build the frontend for production with:

```sh
npm run build
```

## Data and scope

Items are held in memory in the API process. Changes are lost when the process
restarts, and separate API instances do not share data. This project has no
database, authentication, or authorization; do not expose it to untrusted
networks as-is.
