/*
import { PrismaClient } from '@prisma/client';
import { client } from './blockchain/client';
import { sync as syncPools } from './core/pools';
import { sync as syncSwaps } from './core/swaps';
import { sync as syncTokens } from './core/tokens';

const prisma = new PrismaClient();

await syncPools(client, prisma);
await syncTokens(client, prisma);
await syncSwaps(client, prisma);
*/

import express from 'express';

const app = express();
const port = 80;

app.get("/", (req, res) => {
    res.send("Shai-Hulud!");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});