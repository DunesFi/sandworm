import chainConfig, { ChainConfiguration } from './chains';
import contractConfig, { ContractConfiguration } from './contracts';

export type MergedConfiguration = ChainConfiguration & { contracts: ContractConfiguration };

export function getMergedConfig(chainId: number): MergedConfiguration {
  const chain = chainConfig[chainId];
  const contracts = contractConfig[chainId];

  if (!chain || !contracts) {
    throw Error(`Could not create merged config for chain ID: ${chainId}`);
  }

  return { ...chain, contracts };
}

export function validateConfig(config: MergedConfiguration): boolean {
  if (!config) {
    console.error("Config is undefined or null");
    return false;
  }

  if (!config.contracts.DepositPool || config.contracts.DepositPool === "0x") {
    console.error(`Invalid DepositPool address for ${config.networkName}`);
    return false;
  }

  if (!config.contracts.DETH || config.contracts.DETH === "0x") {
    console.error(`Invalid DETH address for ${config.networkName}`);
    return false;
  }

  if (!config.deployBlock) {
    console.error(`Invalid deploy block for ${config.networkName}`);
    return false;
  }

  if (!config.rpcUrl) {
    console.error(`Invalid rpc url for ${config.networkName}`);
    return false;
  }

  return true;
}

export function validateAsset(config: MergedConfiguration, asset: string): boolean {
  return asset in config.contracts;
}