export interface Deposit {
  id: `0x${string}`;
  depositor: `0x${string}` | string;
  asset: `0x${string}` | string;
  depositAmount: bigint;
  dETHMintAmount: bigint;
  referralId: `0x${string}` | string;
  blockNumber: bigint;
  tx: `0x${string}` | string;
}

export interface DepositorInfo {
  id: string;
  depositor: `0x${string}` | string;
  totalMintAmount: bigint;
  mintPoints: bigint;
  totalReferred: bigint;
  refPoints: bigint;
  totalPoints: bigint;
}

export interface DepositorInfoJson {
  id: string;
  depositor: `0x${string}` | string;
  totalMintAmount: string;
  mintPoints: string;
  totalReferred: string;
  refPoints: string;
  totalPoints: string;
}
