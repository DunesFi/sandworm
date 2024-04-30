import { decodeFunctionData, decodeFunctionResult, encodeFunctionData, type Hex, type PublicClient } from 'viem';
import abi from '../abis/PlanarPool';
import { multicall } from './multicall';
import { chunk } from '@/utilities/array';
import { sleep } from '@/utilities/time';

type Analytics = {
  address: Hex;
  reserve0: bigint;
  reserve1: bigint;
  fee0: number;
  fee1: number;
  klast: bigint;
  supply: bigint;
};

export async function analytics(client: PublicClient, pools: Hex[], size = 40, wait = 300) {
  const calls: [Hex, Hex][] = new Array(pools.length * 3);

  for (let i = 0, j = 0; i < calls.length; i += 3, j++) {
    calls[i + 0] = [pools[j], encodeFunctionData({ abi, functionName: 'getReserves' })];
    calls[i + 1] = [pools[j], encodeFunctionData({ abi, functionName: 'kLast' })];
    calls[i + 2] = [pools[j], encodeFunctionData({ abi, functionName: 'totalSupply' })];
  }

  const results = await multicall(client, calls, size, wait);

  const output = new Array<Analytics>(pools.length);

  for (let i = 0, j = 0; i < results.length; i += 3, j++) {
    const reserves = decodeFunctionResult({ abi, functionName: 'getReserves', data: results[i + 0] });
    const klast = decodeFunctionResult({ abi, functionName: 'kLast', data: results[i + 1] });
    const supply = decodeFunctionResult({ abi, functionName: 'totalSupply', data: results[i + 2] });

    output[j] = {
      address: pools[j],
      reserve0: reserves[0],
      reserve1: reserves[1],
      fee0: reserves[2],
      fee1: reserves[3],
      klast,
      supply
    };
  }

  return output;
}

export type Info = {
  address: Hex;
  name: string;
  symbol: string;
  stable: boolean;
  immutable: boolean;
  token0: Hex;
  token1: Hex;
};

export async function info(client: PublicClient, pools: Hex[], size = 40, wait = 300) {
  const calls: [Hex, Hex][] = new Array(pools.length * 6);

  for (let i = 0, j = 0; i < calls.length; i += 6, j++) {
    calls[i + 0] = [pools[j], encodeFunctionData({ abi, functionName: 'name' })];
    calls[i + 1] = [pools[j], encodeFunctionData({ abi, functionName: 'symbol' })];
    calls[i + 2] = [pools[j], encodeFunctionData({ abi, functionName: 'pairTypeImmutable' })];
    calls[i + 3] = [pools[j], encodeFunctionData({ abi, functionName: 'stableSwap' })];
    calls[i + 4] = [pools[j], encodeFunctionData({ abi, functionName: 'token0' })];
    calls[i + 5] = [pools[j], encodeFunctionData({ abi, functionName: 'token1' })];
  }

  const results = await multicall(client, calls, size, wait);

  const output = new Array<Info>(pools.length);

  for (let i = 0, j = 0; i < results.length; i += 6, j++) {
    const name = decodeFunctionResult({ abi, functionName: 'name', data: results[i + 0] });
    const symbol = decodeFunctionResult({ abi, functionName: 'symbol', data: results[i + 1] });
    const immutable = decodeFunctionResult({ abi, functionName: 'pairTypeImmutable', data: results[i + 2] });
    const stable = decodeFunctionResult({ abi, functionName: 'stableSwap', data: results[i + 3] });
    const token0 = decodeFunctionResult({ abi, functionName: 'token0', data: results[i + 4] });
    const token1 = decodeFunctionResult({ abi, functionName: 'token1', data: results[i + 5] });

    output[j] = { address: pools[j], name, symbol, stable, immutable, token0, token1 };
  }

  return output;
}
