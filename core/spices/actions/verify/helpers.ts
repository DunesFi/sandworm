import { SupabaseClient } from "@supabase/supabase-js";
import { SpiceConfiguration } from "../../../config/spices";
import { Chain } from "viem";
import { DepositSpice, HolderSpice, UserBalances } from "../types";

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
    assetName: string,
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

        if (refError) {
            console.error("❌ Error failed to fetch ref deposits:", refError.message);
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
            refPoints: refPoints,
            assetName: assetName,
        };
    } catch (error) {
        console.error("❌ Error during deposit points:", error);
        throw error; // Rethrow to ensure error handling continues up the chain
    }
}

export async function getHolderSpicesForChainAndAsset(
    supabase: SupabaseClient,
    userAddress: string,
    chainId: number,
    asset: string,
    config: SpiceConfiguration,
    assetName: string,
): Promise<HolderSpice> {
    try {
        const { data: transfers, error: transfersError } = await supabase
            .from("transfers")
            .select("*")
            .or(`from.eq.${userAddress},to.eq.${userAddress}`)
            .eq("chainId", chainId)
            .eq("asset", asset)
            .order("timestamp", { ascending: true })  // Order by blockNumber in descending order

        if (transfersError) {
            console.error("❌ Error failed to fetch user transfers:", transfersError.message);
        }

        if (!transfers) {
            return {
                asset: asset,
                chainId: chainId,
                holdPoints: 0n,
                assetName: assetName,
            };
        }

        const userBalances: UserBalances = {};

        transfers.forEach((transfer) => {
            const amountBigInt = BigInt(transfer.amountRaw);
            const timestampSeconds = new Date(transfer.timestamp).getTime() / 1000;

            // Initialize the user's balance history if not already
            if (transfer.from == userAddress) {
                if (!userBalances[transfer.from]) {
                    userBalances[transfer.from] = [{ balance: amountBigInt, timestamp: timestampSeconds }];
                } else {
                    // Update the sender's balance
                    const fromLastBalance = userBalances[transfer.from][userBalances[transfer.from].length - 1].balance;
                    userBalances[transfer.from].push({
                        balance: fromLastBalance - amountBigInt,
                        timestamp: timestampSeconds,
                    });
                }
            }

            if (transfer.to == userAddress) {
                if (!userBalances[transfer.to]) {
                    userBalances[transfer.to] = [{ balance: amountBigInt, timestamp: timestampSeconds }];
                } else {
                    // Update the recipient's balance
                    const toLastBalance = userBalances[transfer.to][userBalances[transfer.to].length - 1].balance;
                    userBalances[transfer.to].push({
                        balance: toLastBalance + amountBigInt,
                        timestamp: timestampSeconds,
                    });
                }
            }
        });


        // Add a current timestamp entry for each user to calculate points up to the present moment
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
        Object.keys(userBalances).forEach(user => {
            const lastBalanceEntry = userBalances[user][userBalances[user].length - 1];
            if (lastBalanceEntry.timestamp !== currentTimestamp) {
                userBalances[user].push({
                    balance: lastBalanceEntry.balance,
                    timestamp: currentTimestamp,
                });
            }
        });

        const userPoints = {};

        Object.keys(userBalances).forEach(user => {
            const balances = userBalances[user];
            let points = 0n;

            balances.forEach((balance, i) => {
                if (i < balances.length - 1) {
                    const durationSeconds = BigInt(balances[i + 1].timestamp - balances[i].timestamp);
                    const durationHours = durationSeconds / 3600n; // Convert seconds to hours using BigInt
                    const tokenAmount = balance.balance; // Normalize balance to whole tokens as BigInt

                    // Calculate points: 100 points per token per day
                    // Convert hours to days in BigInt, adjust points calculation to use hours
                    const pointsForPeriod = (tokenAmount * durationHours * config.HOLD_POINTS) / (24n * config.HOLD_AMOUNT); // Adjusted for hours
                    points += pointsForPeriod;
                }
            });

            userPoints[user] = points;
        });
        return {
            asset: asset,
            chainId: chainId,
            holdPoints: userPoints[userAddress],
            assetName: assetName,
        };
    } catch (error) {
        console.error("❌ Error during deposit points:", error);
        throw error; // Rethrow to ensure error handling continues up the chain
    }
}
