# frontend-learning

TypeScript, React etc

## Building containers

There's a convenience script at `bin/rebuild.sh` that does this:

```
docker compose -f docker/docker-compose.yml down --volumes --remove-orphans
docker compose -f docker/docker-compose.yml build
docker compose -f docker/docker-compose.yml up --detach
```

## Build Vite app

```
docker exec -it frontend-learning-node-1  npm run build
```

## Run Vite server

```
docker exec -it frontend-learning-node-1 npx vite --host 0.0.0.0
```

This will expose the site on `http://localhost:5173/`

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
# ad-hoc
docker exec -it frontend-learning-node-1 npx eslint

# using a file watcher:
docker exec -it frontend-learning-node-1 npm run lint:watch
```

## Running Prettier manually

It should run fine as you save any files, but in case you need to run it manually:

```
# all files:
docker exec -it frontend-learning-node-1 npm run prettier-format

# subset of files:
docker exec -it frontend-learning-node-1 npx prettier --write [filespec]
# eg: docker exec -it frontend-learning-node-1 npx prettier --write tests/baseline.test.ts
```

## Getting tsc to check the code

```
# compile all
docker exec -it frontend-learning-node-1 npx tsc --project tsconfig.app.json --noEmit

# and watch for changes
docker exec -it frontend-learning-node-1 npx tsc --project tsconfig.app.json --watch --noEmit
```

## External dependencies

The code herein requires the frontend-learning API to be running.
See `https://github.com/adamcameron/frontend-learning-api/blob/main/README.md`;
but in short:

```
docker exec -it frontend-learning-api-node-1 npm run dev
```

(Obvs provided the containers are built etc).

From there, we should be able to fetch some data:

```
curl http://localhost:3000/profiles
[{"id":1,"src":"/images/happy.png","alt":"Happy person"},{"id":2,"src":"/images/neutral.png","alt":"Neutral person"},{"id":3,"src":"/images/sad.png","alt":"Sad person"}]
```
