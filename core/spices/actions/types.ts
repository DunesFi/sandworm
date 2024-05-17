import { N } from "vite-node/dist/index-6fb787b2.js";

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


export interface Transfers {
  id: `0x${string}`;
  from: `0x${string}` | string;
  to: `0x${string}` | string;
  amount: bigint;
  amountRaw: string;
  blockNumber: bigint;
  timestamp: string;
  chainId: number,
  asset: `0x${string}` | string;
}

export interface AssetDeposits {
  id: `0x${string}`;
  depositor: `0x${string}` | string;
  depositAsset: `0x${string}` | string;
  depositAmount: bigint;
  amountToMint: bigint;
  amountToMintRaw: string;
  referralId: string;
  blockNumber: bigint;
  timestamp: string;
  chainId: number,
  asset: `0x${string}` | string;
}


export interface DepositSpice {
  asset: `0x${string}` | string;
  assetName: string,
  chainId: number,
  totalMintAmount: bigint;
  mintPoints: bigint;
  totalReferred: bigint;
  refPoints: bigint;
}

export interface HolderSpice {
  asset: `0x${string}` | string;
  assetName: string,
  chainId: number,
  holdPoints: bigint;
}

export interface BalanceChange {
  balance: bigint;
  timestamp: number;  // Assuming timestamp is a Unix timestamp in seconds
}

export interface UserBalances {
  [address: string]: BalanceChange[];
}
