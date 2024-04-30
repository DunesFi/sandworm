import type { Hex, PublicClient } from 'viem';

import { decodeFunctionResult, encodeFunctionData, parseAbi } from 'viem';

import { Contract } from './config';

import abi from '../abis/Multicall';
import { chunk } from '@/utilities/array';

export async function multicall(provider: PublicClient, calls: [Hex, Hex][], size = 40, wait = 300) {
  if (!provider?.chain?.id) throw new Error('Chain id not found');

  const parts = chunk(calls, size);
  const results: Hex[] = [];
  
  for (const calls of parts) {
    const { data } = await provider.call({
      to: Contract['Multicall'],
      data: encodeFunctionData({ abi, functionName: 'aggregate', args: [calls] })
    });

    if (!data) throw new Error('No data returned');
    const [, result] = decodeFunctionResult({ abi, functionName: 'aggregate', data });
    results.push(...result);
  }

  return results;
}
