import { SupabaseClient } from '@supabase/supabase-js';
import { ChainConfiguration } from '../chains/config';
import { Deposit, DepositorInfo, DepositorInfoJson } from '../spices/actions/types';
import { calculateDETHDepositSpices, getTotalDETHDeposit } from '../spices/helpers';

export type DatabaseBlockData = {
  id: string,
  lastBlock: bigint
  chainId: bigint
}

export async function fetchLastProcessedBlocks(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("lastProcessedBlocks").select("*");
  if (error) throw new Error("❌ Failed to fetch last processed blocks");
  return data || [];
}

export async function initializeLastProcessedBlock(
  supabase: SupabaseClient,
  config: ChainConfiguration,
  idName: string,
): Promise<DatabaseBlockData> {
  const newBlockData: DatabaseBlockData = {
    id: `${config.networkName}-${idName}`,
    lastBlock: config.deployBlock - 1n,
    chainId: BigInt(config.chainId),
  };

  const { data, error } = await supabase.from("lastProcessedBlocks").insert([newBlockData]);
  if (error) {
    console.log(error);
    throw new Error("❌ Failed to initialize deposit block");
  }

  return newBlockData;
}

export async function updateDepositTable(
  supabase: SupabaseClient,
  config: ChainConfiguration,
  deposits: Deposit[],
) {
  const depositors = new Map<string, DepositorInfo>();
  const depositorsJs = new Map<string, DepositorInfoJson>();

  deposits.forEach((deposit) => {
    updateMintAmounts(deposit, depositors, config.chainId);
  });

  depositors.forEach((depositorInfo) => {
    const mintPoints = calculateDETHDepositSpices(depositorInfo.totalMintAmount, false);
    depositorInfo.mintPoints = mintPoints;
    const refPoints = calculateDETHDepositSpices(depositorInfo.totalReferred, true);
    depositorInfo.refPoints = refPoints;
    depositorInfo.totalPoints = mintPoints + refPoints;

    depositorsJs.set(depositorInfo.id, {
      id: depositorInfo.id,
      depositor: depositorInfo.depositor,
      totalMintAmount: depositorInfo.totalMintAmount.toString(),
      mintPoints: depositorInfo.mintPoints.toString(),
      totalReferred: depositorInfo.totalReferred.toString(),
      refPoints: depositorInfo.refPoints.toString(),
      totalPoints: depositorInfo.totalPoints.toString(),
    });
  });

  await processDETHDeposits(supabase, config, Array.from(depositorsJs.values()));
}

function updateMintAmounts(deposit: Deposit, depositors: Map<string, DepositorInfo>, chainId: number) {
  const depositor = deposit.id;
  const referrer = deposit.referralId;
  const dETHMintAmount = deposit.dETHMintAmount;

  if (!depositors.has(depositor)) {
    // Initialize depositor info if not present
    depositors.set(depositor, {
      id: depositor.concat("-").concat(chainId.toString()),
      depositor: depositor,
      totalMintAmount: 0n,
      mintPoints: 0n,
      totalReferred: 0n,
      refPoints: 0n,
      totalPoints: 0n,
    });
  }

  if (referrer !== "0" && !depositors.has(referrer)) {
    // Initialize referrer info if not present
    depositors.set(referrer, {
      id: referrer.concat("-").concat(chainId.toString()),
      depositor: referrer,
      totalMintAmount: 0n,
      mintPoints: 0n,
      totalReferred: 0n,
      refPoints: 0n,
      totalPoints: 0n,
    });
  }

  // Update totalMintAmount for the depositor
  const depositorInfo = depositors.get(depositor)!;
  depositorInfo.totalMintAmount += dETHMintAmount;

  if (referrer !== "0") {
    const refInfo = depositors.get(referrer)!;
    refInfo.totalReferred += dETHMintAmount;
  }
}

async function processDETHDeposits(supabase: SupabaseClient, config: ChainConfiguration, depositorJs: DepositorInfoJson[]) {
  // Iterate through deposits to check if they exist in Supabase
  for (const deposit of depositorJs) {
    const table_name = config.networkName.concat("_deposits");

    let { data: existingDeposit, error } = await supabase
      .from(table_name)
      .select("*")
      .eq("depositor", deposit.depositor);

    if (error) {
      console.error("❌ Error checking existing deposit:", error.message);
      continue;
    }

    if (!existingDeposit || existingDeposit.length === 0) {
      // Insert the deposit into Supabase if it doesn't exist
      let { data: newDeposit, error: insertError } = await supabase
        .from(table_name)
        .insert([deposit]);

      if (insertError) {
        console.error("❌ Error inserting new deposit:", insertError.message);
      }
    } else {
      let newDeposit = getTotalDETHDeposit(existingDeposit[0], deposit);

      // Update the deposit in Supabase if it already exists
      let { data: updatedDeposit, error: updateError } = await supabase
        .from(table_name)
        .update(newDeposit)
        .match({ id: newDeposit.id });

      if (updateError) {
        console.error("❌ Error updating deposit:", updateError.message);
      }
    }
  }
}

export async function updateLastProcessedBlock(
  supabase: SupabaseClient,
  depositBlock: DatabaseBlockData
) {
  try {
    const { data, error } = await supabase
      .from("lastProcessedBlocks")
      .update(depositBlock)
      .match({ id: depositBlock.id });
    if (error) {
      throw new Error(`❌ Error updating last processed block: ${error.message}`);
    }
  } catch (error) {
    console.log("❌ Failed to update last processed block\n", { depositBlock, error });
  }
}