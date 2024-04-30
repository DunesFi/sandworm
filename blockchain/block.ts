import { GetBlockReturnType, PublicClient } from "viem";
import { chunk } from "utilities/array";
import { sleep } from "utilities/time";

export async function time(
  client: PublicClient,
  size = 10,
  split = 20,
  delay = 500
) {
  const current = await client.getBlockNumber();
  const numbers = Array.from({ length: size }, (_, i) => current - BigInt(i));
  const chunks = chunk(numbers, split);

  const blocks: GetBlockReturnType[] = [];

  for (const chunk of chunks) {
    const promises = chunk.map((n) => client.getBlock({ blockNumber: n }));
    const result = await Promise.all(promises);
    await sleep(delay);
    blocks.push(...result);
  }

  blocks.sort((a, b) => Number(b.number - a.number));

  const total = blocks.slice(1).reduce((total, block, i) => {
    return total + (blocks[i].timestamp - block.timestamp);
  }, 0n);

  const average = (total * BigInt(1e5)) / BigInt(size - 1);

  return Number(average) / 1e5;
}
