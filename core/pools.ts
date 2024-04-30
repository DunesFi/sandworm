import type { PublicClient } from 'viem';
import type { PrismaClient } from '@prisma/client';

import { analytics, info } from '@/blockchain/contracts/pool';
import { length, pools } from '@/blockchain/contracts/pool-factory';
import { toDecimal } from '@/utilities/bigint';
import { chunk } from '@/utilities/array';
import { missing } from '@/storage/pool';

export async function sync(blockchain: PublicClient, storage: PrismaClient) {
  const inFactory = await length(blockchain);
  const toLookup = await missing(storage, Number(inFactory));

  console.log(`[Syncing Pools] ${toLookup.length} new pools to lookup`);

  let synced = 0;

  const chunks = chunk(toLookup, 20);
  for (const chunk of chunks) {
    console.log(`[Syncing Pools] fetching addresses`);
    const addresses = await pools(blockchain, chunk, 20, 300);
    console.log(`[Syncing Pools] fetching details`);
    const details = await info(blockchain, addresses, 20, 300);
    console.log(`[Syncing Pools] fetching metrics`);
    const metrics = await analytics(blockchain, addresses, 20, 300);

    const data = chunk.map((pid, i) => ({
      ...details[i],
      pid: Number(pid),
      fee0: metrics[i].fee0,
      fee1: metrics[i].fee1,
      reserve0: toDecimal(metrics[i].reserve0),
      reserve1: toDecimal(metrics[i].reserve1),
      klast: toDecimal(metrics[i].klast),
      supply: toDecimal(metrics[i].supply)
    }));
    const created = await storage.pool.createMany({ data, skipDuplicates: true });
    synced += created.count;
    console.log(`[Syncend] created ${synced}/${toLookup.length} pools`);
  }
}
