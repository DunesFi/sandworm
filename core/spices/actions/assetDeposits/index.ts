import { Chain, createPublicClient, http } from 'viem';
import { createClient } from "@supabase/supabase-js";
import {
    addDETHDepositEventsToDB,
    fetchLastDepositBlock
} from '../../../database/helpers';
import { SUPABASE_KEY, SUPABASE_URL } from '../../../config/database';
import { getMergedConfig, MergedConfiguration, validateConfig } from '../../../config';
import { getAssetDepositLogs } from './helpers';
import { getChainAndAssetFromText } from '../../helpers';


/**
 * Saves deposit event data to the database for a specified blockchain chain and asset.
 * @param {string} chain - The  chain name to query for deposit events.
 * @param {string} asset - The asset name for which to save deposit events. DETH or DUSD
 */
export async function saveAssetDepositEvents(chainName: string, assetName: string) {

    const { chain, assetAddress: asset } = await getChainAndAssetFromText(chainName.toLowerCase(), assetName.toUpperCase());
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
    let processedBlocks = await fetchLastDepositBlock(supabase, chain.id, asset);

    let startBlock = 0n; // Initialize the starting block number
    // Check if any blocks have been processed before, and determine the starting block number
    if (processedBlocks.length === 0) {
        console.log("No deposit records found. Starting from deploy block.");
        startBlock = BigInt(config.deployBlock); // Start from deployment block if no records are found
    } else {
        const lastProcessedBlock = processedBlocks[0].blockNumber;
        startBlock = BigInt(lastProcessedBlock) + 1n; // Start from the block after the last processed one
    }

    // Fetch the logs of asset deposits starting from the determined block
    let logs = await getAssetDepositLogs(startBlock, publicClient, config);

    // Add fetched deposit events to the database
    // TODO add condion for DETH DUSD events to seperate dethAmountMinted var
    await addDETHDepositEventsToDB(supabase, publicClient, config, logs, asset);
}

