import { sepolia, mainnet, arbitrum, arbitrumSepolia, Chain } from 'viem/chains';

export interface ChainConfiguration {
  deployBlock: bigint;
  rpcUrl: string | undefined;
  networkName: string;
  chainId: number;
}

export interface ChainConfigurations {
  [chainId: number]: ChainConfiguration;
}

const chainConfig: ChainConfigurations = {
  1: {
    deployBlock: 19825828n,
    rpcUrl: process.env.ETHEREUM_RPC_URL,
    networkName: "ethereum",
    chainId: 1,
  },
  11155111: {
    deployBlock: 0n,
    rpcUrl: process.env.SEPOLIA_RPC_URL,
    networkName: "sepolia",
    chainId: 11155111,
  },
  42161: {
    deployBlock: 0n,
    rpcUrl: process.env.ARBITRUM_RPC_URL,
    networkName: "arbitrum",
    chainId: 42161,
  },
  421614: {
    deployBlock: 0n,
    rpcUrl: process.env.ARBITRUM_SEPOLIA_RPC_URL,
    networkName: "arbitrumSepolia",
    chainId: 421614,
  },
};

export const supportedChains = {
  mainnet: mainnet,
  ethereum: mainnet,
  arbitrum: arbitrum,
  sepolia: sepolia,
  arbitrumSepolia: arbitrumSepolia
};

export default chainConfig;