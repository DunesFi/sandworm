import { parseAbiItem, PublicClient } from 'viem';
import { MergedConfiguration } from '../../../../config';
import { Deposit } from '../../types';

export async function getDETHDepositsLogs(lastBlock: bigint, client: PublicClient, config: MergedConfiguration) {
  const filter = await client.createEventFilter({
    address: config.contracts.DepositPool as `0x${string}`,
    event: parseAbiItem(
      "event AssetDeposit(address indexed depositor, address indexed asset, uint256 depositAmount, uint256 dAssetAmountToMint, string referralId)",
    ),
    fromBlock: lastBlock + 1n,
  });

  return await client.getFilterLogs({ filter });
}

export function processDETHDepositLogs(logs: any[]): [Deposit[], bigint] {
  const processedDeposits: Deposit[] = [];
  let lastBlockNumber: bigint = 0n;

  logs.forEach((log) => {
    const args = log.args;
    const blockNumber = BigInt(log.blockNumber);

    if (blockNumber > lastBlockNumber) {
      lastBlockNumber = blockNumber;
    }

    if (args.depositor && args.depositAmount && args.dAssetAmountToMint) {
      const deposit: Deposit = {
        id: args.depositor,
        depositor: args.depositor,
        asset: args.asset || "0",
        depositAmount: args.depositAmount,
        dAssetAmountToMint: args.dAssetAmountToMint,
        referralId: args.referralId || "0",
        blockNumber: blockNumber,
        tx: log.transactionHash,
      };
      processedDeposits.push(deposit);

    } else {
      throw new Error("❌ Missing required properties in event log args");
    }
  });

  return [processedDeposits, lastBlockNumber];
}
