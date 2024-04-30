# sandworm

To install:

```bash
bun install
```

To run locally:

```bash
bun run index.ts
```

To run in prod:

Note: `pm2 start pm2.config.cjs` does not work due to https://github.com/Unitech/pm2/issues/5751. Instead, use:

```bash
pm2 start --interpreter ~/.bun/bin/bun --name sandworm index.ts
```
