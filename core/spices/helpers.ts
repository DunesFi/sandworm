// Function to calculate total points based on dETHMintAmount
import { DepositorInfoJson } from './actions/types';
import { BASE_AMOUNT, BASE_POINTS, REF_SHARE } from '../config/spices';
import { sepolia, mainnet, arbitrum, arbitrumSepolia, Chain } from 'viem/chains';
import { MergedConfiguration, getMergedConfig } from '../config';

export function calculateDETHDepositSpices(dETHMintAmount: bigint, isRef: boolean): bigint {
  if (isRef) {
    return (dETHMintAmount * BASE_POINTS * REF_SHARE) / (BASE_AMOUNT * 100n);
  }
  return (dETHMintAmount * BASE_POINTS) / BASE_AMOUNT;
}

export function getTotalDETHDeposit(deposit1: DepositorInfoJson, deposit2: DepositorInfoJson): DepositorInfoJson {
  const totalMintAmount = BigInt(deposit1.totalMintAmount) + BigInt(deposit2.totalMintAmount);
  const totalReferred = BigInt(deposit1.totalReferred) + BigInt(deposit2.totalReferred);
  const mintPoints = calculateDETHDepositSpices(totalMintAmount, false);
  const refPoints = calculateDETHDepositSpices(totalReferred, true);
  const totalPoints = mintPoints + refPoints;

  return {
    id: deposit1.id,
    depositor: deposit1.depositor,
    totalMintAmount: totalMintAmount.toString(),
    mintPoints: mintPoints.toString(),
    totalReferred: totalReferred.toString(),
    refPoints: refPoints.toString(),
    totalPoints: totalPoints.toString(),
  };
}

export async function getChainAndAssetFromText(chainName: string, assetName: string) {
  const chains = {
    mainnet: mainnet,
    ethereum: mainnet,
    arbitrum: arbitrum,
    sepolia: sepolia,
    arbitrumSepolia: arbitrumSepolia
  };

  if (!(chainName in chains)) {
    throw new Error(`Invalid chain name: ${chainName}`);
  }

  const chain: Chain = chains[chainName];
  let assetAddress: string;
  // Fetch the merged configuration settings for the current chain
  const config: MergedConfiguration = getMergedConfig(chain.id);
  if (assetName.toLowerCase() == 'deth') {
    assetAddress = config.contracts.DETH
  } else {
    throw new Error(`Invalid deposit asset name: ${assetName}`);
  }

  return { chain, assetAddress };
}