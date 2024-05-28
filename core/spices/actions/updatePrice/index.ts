import { Chain, createPublicClient, http } from "viem";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../../../config/database";
import { getAccount, getMergedConfig, MergedConfiguration, validateConfig } from "../../../config";
import { getChainAndAssetFromText, getTokenAddressesForName, processInputNames, validateAssetName, validateChainName } from "../../helpers";
import { supportedTokens } from "../../../config/contracts";
import { updatePriceCall } from "./helpers";

export async function updatePrices(
    chainName?: string,
    assetName?: string,
): Promise<string[]> {

    let { chainNames, assetNames } = processInputNames(chainName, assetName)


    const updateMessages: string[] = [];

    // Handling different conditions based on provided inputs
    for (const chainNm of chainNames) {
        for (const assetNm of assetNames) {
            if (supportedTokens[chainNm] && supportedTokens[chainNm][assetNm]) {
                const { chain, assetAddress: assetAddress } = await getChainAndAssetFromText(chainNm, assetNm);


                // Fetch the merged configuration settings for the current chain
                const config: MergedConfiguration = getMergedConfig(chain.id);

                const { client: acClient, account } = await getAccount(chain);
                const tx = await updatePriceCall(acClient, account, config.contracts.LRTOracle, chain);

                // Create a public client for interacting with the blockchain
                const publicClient = createPublicClient({
                    chain: chain,
                    transport: http(config.rpcUrl),
                });

                await publicClient.waitForTransactionReceipt({ hash: tx });

                const message = `${chainNm} ${assetNm} price updated`;
                updateMessages.push(message);
            }
        }
    }

    return updateMessages;

}

