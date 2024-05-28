import chainConfig, { ChainConfiguration } from './chains';
import contractConfig, { ContractConfiguration } from './contracts';
import { privateKeyToAccount } from 'viem/accounts'
import { Chain, Hex, WalletClient, createWalletClient, http } from 'viem'

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

  if (!config.contracts.LRTOracle || config.contracts.LRTOracle === "0x") {
    console.error(`Invalid LRTOracle address for ${config.networkName}`);
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

export async function getAccount(chain: Chain): Promise<{ client: WalletClient, account: Hex }> {

  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    throw Error("FATAL: Missing account PK!");
  }
  const pkAccount = privateKeyToAccount(privateKey as '0x${string}');

  const client = createWalletClient({
    account: pkAccount,
    chain: chain,
    transport: http()
  })

  const [account] = await client.getAddresses();
  return { client, account };

}