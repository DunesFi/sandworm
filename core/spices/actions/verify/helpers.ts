import { SupabaseClient } from "@supabase/supabase-js";
import { SpiceConfiguration } from "../../../config/spices";
import { Chain } from "viem";
import { DepositSpice } from "../types";

export function calculateDepositSpices(
    totalMint: bigint,
    totalRef: bigint,
    config: SpiceConfiguration,
): { mintPoints: bigint; refPoints: bigint } {
    const mintPoints = (totalMint * config.BASE_MINT_POINTS) / config.BASE_MINT_AMOUNT;
    const refPoints = (totalRef * config.BASE_MINT_POINTS * config.REF_SHARE) / (config.BASE_MINT_AMOUNT * 100n);
    return { mintPoints, refPoints };
}

export async function getDepositSpicesForChainAndAsset(
    supabase: SupabaseClient,
    userAddress: string,
    chainId: number,
    asset: string,
    config: SpiceConfiguration,
): Promise<DepositSpice> {

    try {
        const { data: depositInfo, error: depositError } = await supabase
            .from("assetDeposits")
            .select("*")
            .eq("depositor", userAddress)
            .eq("chainId", chainId)
            .eq("asset", asset);

        if (depositError) {
            console.error("❌ Error failed to fetch user deposits:", depositError.message);
        }

        const { data: refInfo, error: refError } = await supabase
            .from("assetDeposits")
            .select("*")
            .eq("referralId", userAddress)
            .eq("chainId", chainId)
            .eq("asset", asset);

        if (depositError) {
            console.error("❌ Error failed to fetch ref deposits:", depositError.message);
        }

        // Initialize totals
        let totalDepositAmount: bigint = 0n;
        let totalRefAmount: bigint = 0n;

        if (depositInfo) {
            totalDepositAmount = depositInfo.reduce((total, item) => total + BigInt(item.amountToMintRaw), 0n);
        }
        if (refInfo) {
            totalRefAmount = refInfo.reduce((total, item) => total + BigInt(item.amountToMintRaw), 0n);
        }

        const { mintPoints, refPoints } = calculateDepositSpices(totalDepositAmount, totalRefAmount, config);
        return {
            asset: asset,
            chainId: chainId,
            totalMintAmount: totalDepositAmount,
            mintPoints: mintPoints,
            totalReferred: totalRefAmount,
            refPoints: refPoints
        };

    } catch (error) {
        console.error("❌ Error during deposit points:", error);
        throw error; // Rethrow to ensure error handling continues up the chain

    }
}
