export interface ContractConfiguration {
  DepositPool: `0x${string}`;
  DETH: `0x${string}`;
}

export interface ContractConfigurations {
  [chainId: number]: ContractConfiguration;
}

const contractConfig: ContractConfigurations = {
  1: {
    DepositPool: "0x41351AFc73E066CaC94ABC8efac0e4127a6583E3",
    DETH: "0x0C106Ce6CcCf2fEC68D6cEDD51F2c03a97FF87bB",
    // Add more contract addresses here
  },
  11155111: {
    DepositPool: "0x",
    DETH: "0x",
    // Add more contract addresses here
  },
  42161: {
    DepositPool: "0x",
    DETH: "0x",
    // Add more contract addresses here
  },
  421614: {
    DepositPool: "0x",
    DETH: "0x",
    // Add more contract addresses here
  },
};

export default contractConfig;