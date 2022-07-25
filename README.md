# LinkButtons

## Requirements

-   Node.js ^16.9.0

## Run / Installation

Install all required packages:

```bash
$ npm install
```

You can run the bot in two different ways.

Regardless of what way you will choose, you have to install TypeScript:

```bash
$ npm install -g typescript
```

> Look at [Build](#build) if you want to run vanilla JavaScript with the normal `node` interpreter.

If you want to run the TypeScript files directly, have to to install `ts-node`.

```bash
$ npm install -g ts-node
```

After that you can run the bot.

```bash
$ cd src
$ ts-node index.ts
```

> Don't forget to create a .env file inside your `src` directory! <br/>
> Look at the .env_example file!

## Build

You could either run the bot directly witht `ts-node` or transpile it to vanilla JavaScript and run it with `node`.

> Look at [Run](#run) if you want to run the TypeScript files directly.

Here is how you transpile to plain JavaScript:

```bash
$ tsc
```

After that you can run the bot:

```bash
$ cd dist
$ node index.js
```

> Don't forget to create a .env file inside your `dist` directory! <br/>
> Look at the .env_example file!
