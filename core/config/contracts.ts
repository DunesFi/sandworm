export interface ContractConfiguration {
  DepositPool: `0x${string}`;
  DETH: `0x${string}`;
  LRTOracle: `0x${string}`;

}

export interface ContractConfigurations {
  [chainId: number]: ContractConfiguration;
}

const contractConfig: ContractConfigurations = {
  1: {
    DepositPool: "0x8a1229eDB53f55Bb09D472aFc95D12154590108E",
    DETH: "0xb23a076D4d6507bb309607026Ce5FdF8b45E155f",
    LRTOracle: "0x3Fd915Ad39daF8731D2DaFF3525f5Da2d9Aa9b20",
    // Add more contract addresses here
  },
  11155111: {
    DepositPool: "0x",
    DETH: "0x",
    LRTOracle: "0x",
    // Add more contract addresses here
  },
  42161: {
    DepositPool: "0x",
    DETH: "0x",
    LRTOracle: "0x",
    // Add more contract addresses here
  },
  421614: {
    DepositPool: "0x",
    DETH: "0x",
    LRTOracle: "0x",
    // Add more contract addresses here
  },
};

export default contractConfig;

// chain list Object.keys(supportedTokens)
//
export const supportedTokens = {
  'mainnet': {
    'DETH': contractConfig[1].DETH,
  }
};
