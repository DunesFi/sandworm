import { Hex } from "viem";

const { MULTICALL, POOL_FACTORY, NFTPOOL_FACTORY } = process.env;

if(!MULTICALL) throw new Error("Missing Multicall Address");
if(!POOL_FACTORY) throw new Error("Missing Pool Factory Address");
if(!NFTPOOL_FACTORY) throw new Error("Missing NFT Pool Factory Address");

export const Contract = Object.freeze({
  PoolFactory: POOL_FACTORY,
  NFTPoolFactory: NFTPOOL_FACTORY,
  Multicall: MULTICALL
});

export const Hash = Object.freeze({
  // Pool: process.env.POOL_INIT_HASH,
  // NFTPool: process.env.NFTPOOL_INIT_HASH,
});
