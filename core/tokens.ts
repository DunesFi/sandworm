import type { PublicClient } from 'viem';
import type { PrismaClient } from '@prisma/client';

import { chunk } from '@/utilities/array';
import { missing } from '@/storage/token';
import { info } from '@/blockchain/contracts/token';

export async function sync(blockchain: PublicClient, storage: PrismaClient) {
  const toLookup = await missing(storage);

  console.log(`[Syncing Tokens] ${toLookup.length} new token to lookup`);

  let synced = 0;

  const chunks = chunk(toLookup, 40);
  for (const chunk of chunks) {
    console.log(`[Syncing Pools] fetching details`);
    const details = await info(blockchain, chunk, 30, 300);
    const created = await storage.token.createMany({ data: details, skipDuplicates: true });
    synced += created.count;
    console.log(`[Syncend] created ${synced}/${toLookup.length} pools`);
  }
}
