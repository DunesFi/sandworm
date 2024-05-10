export interface ChainConfiguration {
  DepositPool: string;
  DETH: `0x${string}`;
  deployBlock: bigint;
  rpcUrl: string | undefined;
  networkName: string;
  chainId: number
}

export interface ChainConfigurations {
  [chainId: number]: ChainConfiguration;
}

const chainConfig: ChainConfigurations = {
  1: {
    DepositPool: "0x41351AFc73E066CaC94ABC8efac0e4127a6583E3",
    DETH: "0x0C106Ce6CcCf2fEC68D6cEDD51F2c03a97FF87bB",
    deployBlock: 19825828n,
    rpcUrl: process.env.ETHEREUM_RPC_URL,
    networkName: "ethereum",
    chainId: 1
  },
  11_155_111: {
    DepositPool: "0x",
    DETH: "0x",
    deployBlock: 0n,
    rpcUrl: process.env.SEPOLIA_RPC_URL,
    networkName: "sepolia",
    chainId: 11_155_111
  },
  42161: {
    DepositPool: "0x",
    DETH: "0x",
    deployBlock: 0n,
    rpcUrl: process.env.ARBITRUM_RPC_URL,
    networkName: "arbitrum",
    chainId: 42161
  },
  421614: {
    DepositPool: "0x",
    DETH: "0x",
    deployBlock: 0n,
    rpcUrl: process.env.ARBITRUM_SEPOLIA_RPC_URL,
    networkName: "arbitrumSepolia",
    chainId: 421614
  },
};

export default chainConfig;

export function validateConfig(config: ChainConfiguration) {
  return config && config.DepositPool && config.DETH && config.deployBlock && config.rpcUrl;
}