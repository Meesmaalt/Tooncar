# ToonCar GP

3D arcade racing with six circuits, cartoon cars, AI opponents, drift and power-ups.

## Portainer (Docker Standalone)

Create a Stack with the **Repository** method:

- Repository URL: `https://github.com/Meesmaalt/Tooncar`
- Repository reference: `refs/heads/main`
- Compose path: `docker-compose.yml`

Deploy the stack. Portainer builds the image from the repository and starts the production Node server. Open `http://YOUR-SERVER-IP:8080`.

If port 8080 is occupied, add the stack environment variable `TOONCAR_PORT` (for example `8090`) before deployment. The internal container port remains 8080. Pull the current repository revision and rebuild when updating. No database, authentication credentials, or bind mounts are required for the current game.

This Compose file builds locally and targets Docker Standalone. Docker Swarm requires a prebuilt image pushed to a registry and an `image:` service definition; Swarm does not build Dockerfiles from stacks.

## Local Docker

```sh
docker compose up --build -d
```

The multi-stage Dockerfile builds Nitro with the `node-server` preset and copies only the standalone `.output` into the runtime image. It runs as the non-root `node` user and includes an HTTP health check.

## Development

```sh
npm ci
npm run dev
npm run typecheck
npm run test:game
```

The existing `npm run build` defaults to Vercel. Set `NITRO_PRESET=node-server` to produce the portable Node output used in Docker:

```sh
NITRO_PRESET=node-server VITE_AUTH_ENABLED=false npm run build
HOST=0.0.0.0 PORT=8080 node .output/server/index.mjs
```
