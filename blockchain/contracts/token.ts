import type { Hex, PublicClient } from 'viem';

import { decodeFunctionResult, encodeFunctionData } from 'viem';

import { multicall } from './multicall';

import abi from '../abis/ERC20';

type Info = {
  address: Hex;
  name: string;
  symbol: string;
  decimals: number;
};

export async function info(client: PublicClient, tokens: Hex[], size = 40, wait = 300) {
  const calls: [Hex, Hex][] = new Array(tokens.length * 3);

  for (let i = 0, j = 0; i < calls.length; i += 3, j++) {
    calls[i + 0] = [tokens[j], encodeFunctionData({ abi, functionName: 'name' })];
    calls[i + 1] = [tokens[j], encodeFunctionData({ abi, functionName: 'symbol' })];
    calls[i + 2] = [tokens[j], encodeFunctionData({ abi, functionName: 'decimals' })];
  }

  const results = await multicall(client, calls, size, wait);

  const output = new Array<Info>(tokens.length);

  for (let i = 0, j = 0; i < results.length; i += 3, j++) {
    const name = decodeFunctionResult({ abi, functionName: 'name', data: results[i + 0] });
    const symbol = decodeFunctionResult({ abi, functionName: 'symbol', data: results[i + 1] });
    const decimals = decodeFunctionResult({ abi, functionName: 'decimals', data: results[i + 2] });
    output[j] = { address: tokens[j], name, symbol, decimals };
  }

  return output;
}
