import { createClient } from "@supabase/supabase-js";
import { getMergedConfig, validateConfig } from '../../../config';
import { getChainFromText } from '../../helpers';
import { SUPABASE_KEY, SUPABASE_URL } from '../../../config/database';


export async function purgeData(tableName: string, chainName?: string, assetAddress?: string) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    try {
        // Scenario 1: No chainName or assetAddress, delete all data from the table
        if (!chainName && !assetAddress) {
            const { data, error } = await supabase.from(tableName).delete().neq('id', 0);
            if (error) throw new Error(`Failed to delete all data: ${error.message}`);
            return data;
        }

        // Scenario 2: Chain name provided, delete data for specific chain
        if (chainName) {
            const { chain } = await getChainFromText(chainName);
            const config = getMergedConfig(chain.id);

            if (!validateConfig(config)) {
                console.error("Configuration error for chain:", chain.id);
                return;
            }

            const { data, error } = await supabase
                .from(tableName)
                .delete()
                .eq('chainId', chain.id);

            if (error) throw new Error(`Failed to delete data for chain ${chain.id}: ${error.message}`);
            return data;
        }

        // Scenario 3: Asset address provided, delete data for specific asset
        if (assetAddress) {
            const { data, error } = await supabase
                .from(tableName)
                .delete()
                .eq('asset', assetAddress);

            if (error) throw new Error(`Failed to delete data for asset ${assetAddress}: ${error.message}`);
            return data;
        }
    } catch (error) {
        console.error("Error in purgeData function:", error.message);
        // Optionally re-throw the error to be handled by the caller
        throw error;
    }
}



