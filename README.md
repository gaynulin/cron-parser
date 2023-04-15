# Cron Instruction Handler

## Run as NPM-package

1. `node` (version > 16) [is needed](https://nodejs.org/en/download/package-manager/)
2. `npm install`
3. command example: 
   1. ` ./node_modules/.bin/ts-node ./src/app.ts "*/5 2,4-7,3,17,*/3 1,12 * 1-5 /command"`
   2. or if ts-node is installed **_globally_**: `ts-node ./src/app.ts "*/5 2,4-7,3,17,*/3 1,12 * 1-5 /command"`
4. run tests: `npm test`

## Run in Docker
* No additional packages are needed to be installed except `Docker` tool.
* Commands to run:
* ```docker build . -t cron-cli```
* ```docker run -it cron-cli```
  * In the Docker container:
    * ```npm test``` (to run tests)
    * ```ts-node ./src/app.ts "*/5 2,4-7,3,17,*/3 1,12 * 1-5 /command"```
    * ```exit``` (to exit the Docker container)

## Folder description

```
├── cron                
│   ├── src
│   │   ├── app.ts          <!-- Entrypoint of the app
│   │   ├── cron.ts
│   │   ├── error.ts
│   │   ├── parser.ts
│   │   ├── types.ts
│   ├── tests
│   │   ├── cron.spec.ts
│   │   ├── parser.spec.ts
│   ├── .mocharc.json
│   ├── Dockerfile
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
```
