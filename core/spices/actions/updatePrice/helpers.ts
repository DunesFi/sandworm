import { parseAbi } from 'abitype';
import { Chain, Hex, WalletClient, encodeFunctionData } from 'viem';

export const LRTOracleAbi = parseAbi([
    'function updateDAssetPrice()',
]);


export function updatePriceCall(client: WalletClient, account: Hex, oracleAddress: Hex, chain: Chain) {

    const data = encodeFunctionData({ abi: LRTOracleAbi, functionName: 'updateDAssetPrice', args: [] });
    return client.sendTransaction({
        account,
        to: oracleAddress,
        data,
        chain: chain
    });

}
