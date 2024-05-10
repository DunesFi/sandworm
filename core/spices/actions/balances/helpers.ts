import { SupabaseClient } from '@supabase/supabase-js';
import { erc20Abi, PublicClient } from 'viem';
import { ChainConfiguration } from '../../../chains/config';

export async function processDETHBlockBalances(
  supabase: SupabaseClient,
  client: PublicClient,
  config: ChainConfiguration,
) {
  const lastChainBlock = await client.getBlockNumber();
  const today = new Date();
  const dayString = today.toISOString().slice(0, 10);
  const table_name = `${config.networkName}_balances`;

  console.log(table_name);

  // Fetch the latest balance date for the specific user and chain
  let { data: latestBalances, error: fetchError } = await supabase
    .from(table_name)
    .select("date")
    .order("date", { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error("❌ Error fetching latest balance:", fetchError.message);
    return; // Stop execution if there's an error fetching the data
  }

  if (latestBalances && latestBalances[0]) {
    const lastDay = new Date(latestBalances[0].date);

    if (lastDay.toISOString().slice(0, 10) === dayString) {
      console.log("⚠️ Today is already processed");
      return; // Exit if today has already been processed
    }
  }

  const table_name2 = `${config.networkName}_holders`;

  let { data: existingUsers, error } = await supabase.from(table_name2).select("*");
  if (error) {
    console.error("❌ Error fetching existing users:", error.message);
    return; // Stop execution if there's an error fetching the data
  }
  if (!existingUsers || existingUsers.length === 0) {
    console.error("❌ No users");
    return; // Exit if there are no existing users
  }

  // Extract unique user addresses using a Set to avoid duplicates
  const addressSet: Set<`0x${string}`> = new Set(existingUsers.map(user => user.user));
  const uniqueHolders = Array.from(addressSet);

  const results: bigint[] = await Promise.all(
    uniqueHolders.map((address) =>
      client.readContract({
        address: config.DETH,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      })
    ),
  );

  if (!results) {
    console.error("❌ No DETH balance results");
    return; // Exit if no results are returned
  }

  const newBalances = uniqueHolders.map((user, i) => {
    const amount = results[i];

    return amount !== 0n
      ? {
        id: `${user}-${dayString}`,
        user,
        balance: amount.toString(),
        block: lastChainBlock.toString(),
        date: today,
      }
      : null;
  }).filter(balance => balance !== null);

  if (newBalances.length > 0) {
    try {
      let { data: insertData, error: insertError } = await supabase.from(table_name).insert(newBalances);
      if (insertError) {
        console.error("❌ Error inserting new balances:", insertError.message);
      }
    } catch (error) {
      console.error("❌ Error during batch insertion:", error);
    }
  } else {
    console.log("⚠️ No balances to insert");
  }
}