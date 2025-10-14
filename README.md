# frontend-learning

TypeScript, React etc

## Building containers

There's a convenience script at `bin/rebuild.sh` that does this:

```
docker compose -f docker/docker-compose.yml down --volumes --remove-orphans
docker compose -f docker/docker-compose.yml build
docker compose -f docker/docker-compose.yml up --detach
```

## Starting test watcher

```
docker exec -it frontend-learning-node-1 npm run test:ui
```

### UI

The UI runs on `http://localhost:51204/__vitest__/#/`

### Code coverage

Open `/coverage/index.html` in a browser (using a file URL).
For me it's `file://wsl.localhost/Ubuntu/home/adam/source/frontend-learning/coverage/index.html`

## Running ESLint

```
docker exec -it frontend-learning-node-1 npx eslint
```

## Getting tsc to check the code

```
docker exec -it frontend-learning-node-1 npx tsc --noEmit

# and watch for changes
docker exec -it frontend-learning-node-1 npx tsc --watch --noEmit
```

## Run Vite server

```
docker exec -it frontend-learning-node-1 npx vite --host 0.0.0.0
```

This will expose the site on `http://localhost:5173/`