import { Chain, createPublicClient, http } from 'viem';
import { createClient } from "@supabase/supabase-js";
import {
    addTransferEventsToDB,
    fetchLastTransferBlock
} from '../../../database/helpers';
import { Deposit } from '../types';
import { SUPABASE_KEY, SUPABASE_URL } from '../../../config/database';
import { getMergedConfig, MergedConfiguration, validateConfig } from '../../../config';
import { sepolia, mainnet, } from 'viem/chains';
import { getAssetTransfersLogs } from './helpers';


/**
 * Saves transfer event data to the database for a specified blockchain chain and asset.
 * @param {Chain} chain - The blockchain chain to query for transfer events.
 * @param {string} asset - The asset address for which to save transfer events.
 */
async function saveTransferEvents(chain: Chain, asset: string) {

    // Create a Supabase client using the configured URL and Key
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Fetch the merged configuration settings for the current chain
    const config: MergedConfiguration = getMergedConfig(chain.id);
    // Validate the configuration and log an error if invalid
    if (!validateConfig(config)) {
        console.error("❌ Configuration error for chain:", chain.id);
        return; // Exit if configuration is not valid
    }

    // Create a public client for interacting with the blockchain
    const publicClient = createPublicClient({
        chain: chain,
        transport: http(config.rpcUrl),
    });

    // Fetch the last processed block number for the given asset
    let processedBlocks = await fetchLastTransferBlock(supabase, chain.id, asset);

    let startBlock = 0n; // Initialize the starting block number
    // Check if any blocks have been processed before, and determine the starting block number
    if (processedBlocks.length === 0) {
        console.log("No transfer records found. Starting from deploy block.");
        startBlock = BigInt(config.deployBlock); // Start from deployment block if no records are found
    } else {
        const lastProcessedBlock = processedBlocks[0].blockNumber;
        startBlock = BigInt(lastProcessedBlock) + 1n; // Start from the block after the last processed one
    }

    // Fetch the logs of asset transfers starting from the determined block
    let logs = await getAssetTransfersLogs(startBlock, publicClient, asset as `0x${string}`);

    // Add fetched transfer events to the database
    await addTransferEventsToDB(supabase, publicClient, config, logs, asset);
}

