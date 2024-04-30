import type { PrismaClient } from '@prisma/client';
import type { Hex } from 'viem';

export async function missing(client: PrismaClient) {
  const result = await client.$queryRaw`SELECT ARRAY(
    SELECT DISTINCT
    token FROM (
        SELECT token0 AS token FROM public.pool 
        UNION
        SELECT token1 AS token
        FROM public.pool
    ) as tokens
    WHERE NOT EXISTS ( SELECT 1 FROM public.token WHERE public.token.address = token )) AS missing;`;
  return (result as [{ missing: Hex[] }])[0].missing;
}
