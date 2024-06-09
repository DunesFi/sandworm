export interface ContractConfiguration {
  DepositPool: `0x${string}`;
  Asset: `0x${string}`;
  LRTOracle: `0x${string}`;

}

export interface ChainContracts {
  DETH: ContractConfiguration;
  DUSD: ContractConfiguration;
}


export interface ContractConfigurations {
  [chainId: number]: ChainContracts;
}

const contractConfig: ContractConfigurations = {
  1: {
    DETH: {
      DepositPool: "0x8a1229eDB53f55Bb09D472aFc95D12154590108E",
      Asset: "0xb23a076D4d6507bb309607026Ce5FdF8b45E155f",
      LRTOracle: "0x3Fd915Ad39daF8731D2DaFF3525f5Da2d9Aa9b20",
    },
    DUSD: {
      DepositPool: "0x634598473B91a6870c1DB151142db0b61C5de8CC",
      Asset: "0xFAEb812D7aBBe567AEeF2d56c87B8C75FEf5aB90",
      LRTOracle: "0xE2b8f0B872D7e72015Ad41cf44d5aeCa80BAee0D",
    },
    // Add more contracts as needed
  },
  11155111: {
    DETH: {
      DepositPool: "0x",
      Asset: "0x",
      LRTOracle: "0x",
    },
    DUSD: {
      DepositPool: "0x",
      Asset: "0x",
      LRTOracle: "0x",
    },
    // Initialize other contracts similarly
  },
  42161: {
    DETH: {
      DepositPool: "0x",
      Asset: "0x",
      LRTOracle: "0x",
    },
    DUSD: {
      DepositPool: "0x",
      Asset: "0x",
      LRTOracle: "0x",
    },
    // Initialize other contracts similarly
  },
  421614: {
    DETH: {
      DepositPool: "0x",
      Asset: "0x",
      LRTOracle: "0x",
    },
    DUSD: {
      DepositPool: "0x",
      Asset: "0x",
      LRTOracle: "0x",
    },
    // Initialize other contracts similarly
  },
};

export default contractConfig;

// chain list Object.keys(supportedTokens)
//
export const supportedTokens = {
  'mainnet': {
    'DETH': contractConfig[1].DETH.Asset,
    'DUSD': contractConfig[1].DUSD.Asset

  }
};
