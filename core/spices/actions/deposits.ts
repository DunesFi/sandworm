import { Chain, createPublicClient, http } from 'viem';
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from '../../database/config';
import chainConfigs, { validateConfig } from '../../chains/config';
import {
  DatabaseBlockData,
  fetchLastProcessedBlocks,
  initializeLastProcessedBlock,
  updateDepositTable, updateLastProcessedBlock
} from '../../database/helpers';
import { getDETHDepositsLogs, processDETHDepositLogs } from '../../chains/helpers';
import { Deposit } from './types';

async function snapshotDETHDeposits(chain: Chain) {
  let currentChain = chain;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const config = chainConfigs[currentChain.id];
  if (!validateConfig(config)) {
    console.error("❌ Configuration error for chain:", chain.id);
  }

  const publicClient = createPublicClient({
    chain: currentChain,
    transport: http(config.rpcUrl),
  });

  // Get the last processed block.
  const lastBlocks = await fetchLastProcessedBlocks(supabase);
  let depositBlock: DatabaseBlockData = lastBlocks.find((d) => d.id === `${config.networkName}-deposits`);
  if (!depositBlock) {
    depositBlock = await initializeLastProcessedBlock(
      supabase,
      config,
      "deposits",
    );
  }
  // get AssetDeposit events starting from last block recorded
  const logs = await getDETHDepositsLogs(depositBlock.lastBlock, publicClient, config);

  // process events and get depositor, deposit amount, referralId ...
  let [deposits, lastEventBlock]: [Deposit[], bigint] = processDETHDepositLogs(logs);

  // create new depositors and update total deposits if depositors exist
  if (deposits.length > 0) await updateDepositTable(supabase, config, deposits);

  if (lastEventBlock > depositBlock.lastBlock) {
    depositBlock.lastBlock = lastEventBlock;
    // save last processed blocks
    await updateLastProcessedBlock(supabase, depositBlock);
  }
}