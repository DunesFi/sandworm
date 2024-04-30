import { describe, expect, it } from "bun:test";

import client from '@/tests/client';

import { multicall } from './multicall';

describe('Multicall', () => {
  it('fetchs multicall contract', async () => {
    const response = await multicall(client.public, []);
    expect(response).toHaveLength(2);
    expect(response[0]).toBeTypeOf('bigint');
  });
});
