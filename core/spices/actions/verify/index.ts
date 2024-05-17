import { Chain, createPublicClient, http } from "viem";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../../../config/database";
import { getMergedConfig, MergedConfiguration, validateConfig } from "../../../config";
import { getChainAndAssetFromText, getTokenAddressesForName, processInputNames, validateAssetName, validateChainName } from "../../helpers";
import spiceConfig, { SpiceConfiguration } from "../../../config/spices";
import { getDepositSpicesForChainAndAsset, getHolderSpicesForChainAndAsset } from "./helpers";
import { DepositSpice, HolderSpice } from "../types";
import { supportedTokens } from "../../../config/contracts";

export async function verifyDepositPoints(
    userAddress: string,
    chainName?: string,
    assetName?: string,
): Promise<DepositSpice[]> {

    let { chainNames, assetNames } = processInputNames(chainName, assetName)
    // Create a Supabase client using the configured URL and Key
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const depositSpices: DepositSpice[] = [];

    // Handling different conditions based on provided inputs
    for (const chainNm of chainNames) {
        for (const assetNm of assetNames) {
            if (supportedTokens[chainNm] && supportedTokens[chainNm][assetNm]) {
                const { chain, assetAddress: assetAddress } = await getChainAndAssetFromText(chainNm, assetNm);
                const spiceConf = spiceConfig[assetNm];  // Ensure spiceConfig is defined properly to use here
                const result = await getDepositSpicesForChainAndAsset(supabase, userAddress, chain.id, assetAddress, spiceConf, assetNm);
                if (result.totalMintAmount != 0n || result.totalReferred != 0n) depositSpices.push(result);
            }
        }
    }
    return depositSpices;
}

export async function verifyHolderPoints(
    userAddress: string,
    chainName?: string,
    assetName?: string,
): Promise<HolderSpice[]> {

    let { chainNames, assetNames } = processInputNames(chainName, assetName)
    // Create a Supabase client using the configured URL and Key
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const holderSpices: HolderSpice[] = [];
    // Handling different conditions based on provided inputs
    for (const chainNm of chainNames) {
        for (const assetNm of assetNames) {
            if (supportedTokens[chainNm] && supportedTokens[chainNm][assetNm]) {
                const { chain, assetAddress: assetAddress } = await getChainAndAssetFromText(chainNm, assetNm);
                const spiceConf = spiceConfig[assetNm];  // Ensure spiceConfig is defined properly to use here
                const result = await getHolderSpicesForChainAndAsset(supabase, userAddress, chain.id, assetAddress, spiceConf, assetNames[0]);
                if (result.holdPoints != 0n) holderSpices.push(result);
            }
        }
    }
    return holderSpices;
}
