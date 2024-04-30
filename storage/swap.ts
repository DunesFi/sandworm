import type { PrismaClient } from '@prisma/client';
import type { Hex } from 'viem';

export async function outdated(client: PrismaClient, block: number) {
  const result = await client.$queryRaw`
    SELECT ARRAY (
        SELECT address
        FROM public.pool
        LEFT JOIN (SELECT pool, MAX(block) AS latest FROM event.swap GROUP BY pool) AS swaps 
        ON address = swaps.pool 
        WHERE swaps.latest IS NULL OR swaps.latest < ${block}
    ) as outdated`;
  return (result as [{ outdated: Hex[] }])[0].outdated;
}
