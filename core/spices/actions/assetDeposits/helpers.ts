import { parseAbiItem } from "viem";
import { MergedConfiguration } from "../../../config";


export async function getAssetDepositLogs(lastBlock: bigint, publicClient: any, config: MergedConfiguration) {
    const filter = await publicClient.createEventFilter({
        address: config.contracts.DepositPool as `0x${string}`,
        event: parseAbiItem(
            "event AssetDeposit(address indexed depositor, address indexed asset, uint256 depositAmount, uint256 dETHMintAmount, string referralId)",
        ),
        fromBlock: lastBlock,
    });

    return await publicClient.getFilterLogs({ filter });
}
