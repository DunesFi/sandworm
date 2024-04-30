import type { Hex, PublicClient } from "viem";

import { parseAbiItem, zeroAddress } from "viem";

type SwapEvent = {
  pool: Hex;
  block: bigint;
  transaction: Hex;
  sender: Hex;
  to: Hex;
  amount0In: bigint;
  amount1In: bigint;
  amount0Out: bigint;
  amount1Out: bigint;
};

const ABI = parseAbiItem(
  "event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)"
);

export async function latest(client: PublicClient, pool: Hex, blocks: number) {
  const current = await client.getBlockNumber();
  const filter = await client.createEventFilter({
    address: pool,
    event: ABI,
    fromBlock: current - BigInt(blocks),
    toBlock: "latest",
  });

  const events = await client.getFilterLogs({ filter });

  return events.map<SwapEvent>((log) => ({
    pool,
    block: log.blockNumber,
    transaction: log.transactionHash,
    sender: log.args.sender ?? zeroAddress,
    to: log.args.to ?? zeroAddress,
    amount0In: log.args.amount0In ?? 0n,
    amount1In: log.args.amount1In ?? 0n,
    amount0Out: log.args.amount0Out ?? 0n,
    amount1Out: log.args.amount1Out ?? 0n,
  }));
}
