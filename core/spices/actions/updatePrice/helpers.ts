import { parseAbi } from 'abitype';
import { Chain, Hex, PrivateKeyAccount, WalletClient, encodeFunctionData } from 'viem';

export const LRTOracleAbi = parseAbi([
    'function updateDAssetPrice()',
]);


export function updatePriceCall(client: WalletClient, pkAccount: PrivateKeyAccount, oracleAddress: Hex, chain: Chain) {

    const data = encodeFunctionData({ abi: LRTOracleAbi, functionName: 'updateDAssetPrice', args: [] });
    return client.sendTransaction({
        account: pkAccount,
        to: oracleAddress,
        data,
        chain: chain
    });

}
