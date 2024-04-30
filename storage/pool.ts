import { PrismaClient, Prisma } from '@prisma/client';

type Pool = Prisma.PoolCreateInput;

export async function missing(client: PrismaClient, size: number) {
  const result = await client.$queryRaw`
    SELECT ARRAY(
        SELECT s.pid FROM generate_series(0, ${size - 1}) s(pid) 
        LEFT JOIN public.pool ON pool.pid = s.pid 
        WHERE public.pool.pid IS NULL
    ) AS missing;`;
  return (result as [{ missing: bigint[] }])[0].missing;
}

export function save(client: PrismaClient, pools: Pool[]) {
  return client.pool.createMany({ data: pools, skipDuplicates: true });
}

export function byToken(client: PrismaClient, tokens: string[], stable?: boolean, take?: number, skip?: number) {
  const filter = { in: tokens.map((token) => token.toLowerCase()) };
  return client.pool.findMany({ take, skip, where: { AND: { stable }, OR: [{ token0: filter }, { token1: filter }] } });
}

export function all(client: PrismaClient, stable?: boolean, take?: number, skip?: number) {
  return client.pool.findMany({ take, skip, where: { stable } });
}

export function count(client: PrismaClient) {
  return client.pool.count();
}
