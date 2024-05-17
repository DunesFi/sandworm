import { Chain, createPublicClient, http } from 'viem';
import { createClient } from "@supabase/supabase-js";
import {
    addTransferEventsToDB,
    fetchLastTransferBlock
} from '../../../database/helpers';
import { SUPABASE_KEY, SUPABASE_URL } from '../../../config/database';
import { getMergedConfig, MergedConfiguration, validateConfig } from '../../../config';
import { getAssetTransfersLogs } from './helpers';
import { getChainAndAssetFromText, processInputNames, validateAssetName, validateChainName } from '../../helpers';
import { supportedTokens } from '../../../config/contracts';


/**
 * Saves transfer event data to the database for a specified blockchain chain and asset.
 * @param {string} chain - The  chain name to query for transfer events.
 * @param {string} asset - The asset name for which to save transfer events.
 */
export async function saveTransferEvents(chainName?: string, assetName?: string) {

    let { chainNames, assetNames } = processInputNames(chainName, assetName)
    // Create a Supabase client using the configured URL and Key
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Handling different conditions based on provided inputs
    for (const chainNm of chainNames) {
        for (const assetNm of assetNames) {
            if (supportedTokens[chainNm] && supportedTokens[chainNm][assetNm]) {
                const { chain, assetAddress: assetAddress } = await getChainAndAssetFromText(chainNm, assetNm);

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
                let processedBlocks = await fetchLastTransferBlock(supabase, chain.id, assetAddress);

                let startBlock = 0n; // Initialize the starting block number
                // Check if any blocks have been processed before, and determine the starting block number
                if (processedBlocks.length === 0) {
                    startBlock = BigInt(config.deployBlock); // Start from deployment block if no records are found
                } else {
                    const lastProcessedBlock = processedBlocks[0].blockNumber;
                    startBlock = BigInt(lastProcessedBlock) + 1n; // Start from the block after the last processed one
                }
                // Fetch the logs of asset transfers starting from the determined block
                let logs = await getAssetTransfersLogs(startBlock, publicClient, assetAddress as `0x${string}`);
                // Add fetched transfer events to the database
                await addTransferEventsToDB(supabase, publicClient, config, logs, assetAddress);

            }
        }


    }

}
