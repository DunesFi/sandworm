// Function to calculate total points based on dETHMintAmount
import { DepositorInfoJson } from './actions/types';
import { BASE_AMOUNT, BASE_POINTS, REF_SHARE } from '../config/spices';
import { sepolia, mainnet, arbitrum, arbitrumSepolia, Chain } from 'viem/chains';
import { MergedConfiguration, getMergedConfig } from '../config';
import { supportedChains } from '../config/chains';
import { supportedTokens } from '../config/contracts';

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

  const { chain } = getChainFromText(chainName);

  // Fetch the merged configuration settings for the current chain
  const config: MergedConfiguration = getMergedConfig(chain.id);
  let assetAddress = supportedTokens[chainName][assetName]

  if (!assetAddress) {
    throw new Error(`Invalid deposit asset name: ${assetName}`);
  }

  return { chain, assetAddress };
}

export function getChainFromText(chainName: string) {
  if (!(chainName in supportedChains)) {
    throw new Error(`Invalid chain name: ${chainName}`);
  }
  const chain: Chain = supportedChains[chainName];
  return { chain };
}

export function getTokenAddressesForName(tokenName: string): string[] {
  let addresses: string[] = [];

  tokenName = tokenName.toUpperCase()
  for (const chain in supportedTokens) {
    const tokens = supportedTokens[chain];
    if (tokens[tokenName]) {  // Check if the token name exists in the current chain's configuration
      addresses.push(tokens[tokenName]);
    }
  }
  return addresses;
}

export function validateChainName(chainName: string,) {
  if (!supportedTokens[chainName]) {
    throw new Error(`Chain '${chainName}' is not supported.`);
  }
}

