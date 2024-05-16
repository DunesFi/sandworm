import { Chain, createPublicClient, http } from "viem";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../../../config/database";
import { getMergedConfig, MergedConfiguration, validateConfig } from "../../../config";
import { getChainAndAssetFromText, getTokenAddressesForName, validateChainName } from "../../helpers";
import spiceConfig, { SpiceConfiguration } from "../../../config/spices";
import { calculateDepositSpices, getDepositSpicesForChainAndAsset } from "./helpers";
import { DepositSpice } from "../types";
import { supportedTokens } from "../../../config/contracts";

export async function verifyDepositPoints(
    userAddress: string,
    chainName?: string,
    assetName?: string,
): Promise<DepositSpice[]> {

    if (chainName) validateChainName(chainName);
    let assetNames: string[] = assetName ? [assetName.toUpperCase()] : [];
    let chainNames: string[] = chainName ? [chainName.toLowerCase()] : Object.keys(supportedTokens);

    // Create a Supabase client using the configured URL and Key
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const depositSpices: DepositSpice[] = [];

    // If no assetName is provided, we need all assets for the specified chains
    if (!assetName) {
        chainNames.forEach(chain => {
            Object.keys(supportedTokens[chain]).forEach(token => {
                if (assetNames.indexOf(token) === -1) {
                    assetNames.push(token.toUpperCase());
                }
            });
        });
    }

    // Handling different conditions based on provided inputs
    for (const chainNm of chainNames) {
        for (const assetNm of assetNames) {
            if (supportedTokens[chainNm] && supportedTokens[chainNm][assetNm]) {

                const { chain, assetAddress: assetAddress } = await getChainAndAssetFromText(chainNm, assetNm);
                const spiceConf = spiceConfig[assetNm];  // Ensure spiceConfig is defined properly to use here
                const result = await getDepositSpicesForChainAndAsset(supabase, userAddress, chain.id, assetAddress, spiceConf);
                if (result.totalMintAmount != 0n || result.totalReferred != 0n) depositSpices.push(result);
            }
        }
    }
    return depositSpices;
}

async function main() {
    await verifyDepositPoints("0xd0408c929a05aC439caF6355B1305C90C404B014",);
}

main().catch(console.error);
