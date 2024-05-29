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
      DepositPool: "0x",
      Asset: "0x",
      LRTOracle: "0x",
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
  }
};
