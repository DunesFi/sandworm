import type { PrismaClient } from '@prisma/client';
import type { PublicClient } from 'viem';

import { latest } from '@/blockchain/events/swap';
import { time as timePerBlock } from '@/blockchain/block';
import { outdated } from '@/storage/swap';
import { toDecimal } from '@/utilities/bigint';
import { sleep } from '@/utilities/time';

export async function sync(blockchain: PublicClient, storage: PrismaClient) {
  const perBlock = await timePerBlock(blockchain, 10);
  const perHour = Math.round((1 / perBlock) * 60 * 60);

  console.log(`Average block time: ${perBlock} seconds | ${perHour} blocks per hour`);
  const block = await blockchain.getBlockNumber();

  const pools = await outdated(storage, Number(block) - perHour);
  console.log(`[Syncing Swaps] ${pools.length} pools to sync`);

  for (let i = 0; i < pools.length; i++) {
    const log = await latest(blockchain, pools[i], perHour);
    const data = log.map((log) => ({
      pool: log.pool,
      block: toDecimal(log.block),
      transaction: log.transaction,
      sender: log.sender,
      to: log.to,
      time: new Date(),
      amount0_in: toDecimal(log.amount0In),
      amount1_in: toDecimal(log.amount1In),
      amount0_out: toDecimal(log.amount0Out),
      amount1_out: toDecimal(log.amount1Out)
    }));

    const created = log.length ? await storage.swapEvent.createMany({ data, skipDuplicates: true }) : { count: 0 };
    console.log(`[Syncend] ${i}/${pools.length} pools | ${pools[i]} | ${created.count} events`);
    sleep(200);
  }
}
