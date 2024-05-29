import { parseAbiItem } from "viem";
import { MergedConfiguration } from "../../../config";
import { getDepositPoolForAsset } from "../../helpers";


export async function getAssetDepositLogs(lastBlock: bigint, publicClient: any, config: MergedConfiguration, assetName: string) {
    const depositPool = getDepositPoolForAsset(config, assetName);
    const filter = await publicClient.createEventFilter({
        address: depositPool,
        event: parseAbiItem(
            "event AssetDeposit(address indexed depositor, address indexed asset, uint256 depositAmount, uint256 dAssetAmountToMint, string referralId)",
        ),
        fromBlock: lastBlock,
    });

    return await publicClient.getFilterLogs({ filter });
}
