# frontend-learning

TypeScript, React etc

## Building containers

One needs a non-source-controlled secrets file to be in place at `docker/secrets/POSTGRES_PASSWORD.private`.
it should contain only the password value, eg:

```
cat docker/secrets/POSTGRES_PASSWORD.private
123
```

There's a convenience script at `bin/rebuild.sh` that tears down and rebuilds the containers:

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

## Run Vite server

```
docker exec -it frontend-learning-node-1 npx vite --host 0.0.0.0
```

This will expose the site on `http://localhost:5173/`

## PostgreSQL

Connecting to the DB from the container:

```
psql --dbname=fl --host=localhost --port=5432 --username=fl_user
```

No need for pwd using that approach as there's a `~/.pgpass` file in place in the container file system.
