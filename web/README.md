# Fieldnotes frontend

This React and Tailwind CSS app uses the Fastify API for item data.

## Run locally

Start the API from the repository root:

```sh
npm run dev
```

In another terminal, start the frontend:

```sh
cd web
npm install
npm run dev
```

Open the local URL printed by Vite. During development, Vite proxies `/items` and
`/docs` to `http://127.0.0.1:5000`. Set `VITE_API_PROXY_TARGET` in `web/.env`
when the API uses a different address.

## Build

```sh
npm run build
```

The API currently stores items in memory, so changes are lost when the API
process restarts.
