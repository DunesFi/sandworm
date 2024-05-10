import { Chain, createPublicClient, http } from 'viem';
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from '../../../database/config';
import chainConfigs, { validateConfig } from '../../../chains/config';
import {
  DatabaseBlockData,
  fetchLastProcessedBlocks,
  initializeLastProcessedBlock,
  processTransferLogs, updateLastProcessedBlock
} from '../../../database/helpers';
import { getDETHTransfersLogs } from '../../../chains/helpers';
import { processDETHBlockBalances } from './helpers';

async function snapshotDETHBalances(chain: Chain) {
  let currentChain = chain;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const config = chainConfigs[currentChain.id];
  if (!validateConfig(config)) {
    console.error("❌ Configuration error for chain", currentChain.id);
    return;
  }

  const publicClient = createPublicClient({
    chain: currentChain,
    transport: http(config.rpcUrl),
  });

  const lastBlocks = await fetchLastProcessedBlocks(supabase);

  // Get the last processed block.
  let holdersBlock: DatabaseBlockData = lastBlocks.find((d) => d.id === `${config.networkName}-holders`);

  if (!holdersBlock) {
    holdersBlock = await initializeLastProcessedBlock(
      supabase,
      config,
      "holders",
    );
  }

  // get Transfer events starting from last block recorded
  const logs = await getDETHTransfersLogs(holdersBlock.lastBlock, publicClient, config);

  // Process Transfer events to update DETH holders in DB
  let lastEventBlock = await processTransferLogs(supabase, config, logs);

  // get current balances using accounts in the holders table
  // This will update balances once a day. it is run multiple times a day, it won't update balance more than once
  await processDETHBlockBalances(supabase, publicClient, config);

  if (lastEventBlock > BigInt(holdersBlock.lastBlock)) {
    holdersBlock.lastBlock = lastEventBlock;
    // Update last processed block for transfer event
    await updateLastProcessedBlock(supabase, holdersBlock);
  }
}