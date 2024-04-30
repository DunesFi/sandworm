import { Hex, PublicClient, decodeFunctionResult, encodeFunctionData, zeroAddress } from 'viem';
import abi from '../abis/PlanarFactory';
import { Contract } from './config';
import { multicall } from './multicall';
import { chunk } from '@/utilities/array';
import { sleep } from 'bun';

export async function length(client: PublicClient) {
  const data = encodeFunctionData({ abi, functionName: 'allPairsLength' });
  const result = await client.call({ to: Contract['PoolFactory'], data });
  if (!result.data) throw new Error('No data returned from allPairsLength');
  return decodeFunctionResult({ abi, functionName: 'allPairsLength', data: result.data });
}

export async function pools(client: PublicClient, indices: bigint[], size = 20, wait = 300) {
  const calls = indices.map<[Hex, Hex]>((i) => [
    Contract['PoolFactory'],
    encodeFunctionData({ abi, functionName: 'allPairs', args: [i] })
  ]);

  const results = await multicall(client, calls, size, wait);

  return results.map((data) => decodeFunctionResult({ abi, functionName: 'allPairs', data }));
}
