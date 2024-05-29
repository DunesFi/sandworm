import chainConfig, { ChainConfiguration } from './chains';
import contractConfig, { ChainContracts, ContractConfiguration } from './contracts';
import { privateKeyToAccount } from 'viem/accounts'
import { Chain, Hex, PrivateKeyAccount, WalletClient, createWalletClient, http } from 'viem'

export type MergedConfiguration = ChainConfiguration & { contracts: ChainContracts };

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

  if (!config.contracts.DETH.DepositPool || config.contracts.DETH.DepositPool === "0x") {
    console.error(`Invalid DepositPool address for ${config.networkName}`);
    return false;
  }

  if (!config.contracts.DETH.Asset || config.contracts.DETH.Asset === "0x") {
    console.error(`Invalid DETH address for ${config.networkName}`);
    return false;
  }

  if (!config.contracts.DETH.LRTOracle || config.contracts.DETH.LRTOracle === "0x") {
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



export async function getAccount(chain: Chain): Promise<{ client: WalletClient, pkAccount: PrivateKeyAccount }> {

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

  return { client, pkAccount };

}