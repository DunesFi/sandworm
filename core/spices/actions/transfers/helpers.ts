import { parseAbiItem } from "viem";


export async function getAssetTransfersLogs(lastBlock: bigint, publicClient: any, asset: `0x${string}`) {
    const filter = await publicClient.createEventFilter({
        address: asset,
        event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)"),
        fromBlock: lastBlock,
    });

    return await publicClient.getFilterLogs({ filter });
}
