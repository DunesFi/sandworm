import { Chain, createPublicClient, http } from "viem";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../../../config/database";
import { getAccount, getMergedConfig, MergedConfiguration, validateConfig } from "../../../config";
import { getChainAndAssetFromText, getChainFromText, getTokenAddressesForName, processInputNames, validateAssetName, validateChainName } from "../../helpers";
import { supportedTokens } from "../../../config/contracts";
import { updatePriceCall } from "./helpers";
import { sepolia } from "viem/chains";

export async function updatePrices(
    chainName?: string,
    assetName?: string,
): Promise<string[]> {

    let { chainNames, assetNames } = processInputNames(chainName, assetName)


    const updateMessages: string[] = [];

    // Handling different conditions based on provided inputs
    for (const chainNm of chainNames) {
        if (supportedTokens[chainNm]) {

            //const { chain } = getChainFromText(chainNm);
            const chain = sepolia
            // Fetch the merged configuration settings for the current chain
            const config: MergedConfiguration = getMergedConfig(chain.id);
            const { client: acClient, pkAccount } = await getAccount(chain);
            // Create a public client for interacting with the blockchain

            const publicClient = createPublicClient({
                chain: chain,
                transport: http(config.rpcUrl),
            });

            const balance = await publicClient.getBalance({
                address: pkAccount.address,
            })

            const ethBalance = Number(balance) / 1e18;  // Convert bigint to number and then to ETH
            const balanceMessage = `${chainNm}  ETH Balance::${ethBalance} `;
            updateMessages.push(balanceMessage);

            for (const assetNm of assetNames) {
                if (supportedTokens[chainNm] && supportedTokens[chainNm][assetNm]) {
                    const { chain, assetAddress: assetAddress } = await getChainAndAssetFromText(chainNm, assetNm);

                    const tx = await updatePriceCall(acClient, pkAccount, config.contracts.LRTOracle, chain);
                    await publicClient.waitForTransactionReceipt({ hash: tx });

                    const message = `${chainNm} ${assetNm} price updated`;
                    updateMessages.push(message);
                }
            }
        }
    }

    return updateMessages;

}