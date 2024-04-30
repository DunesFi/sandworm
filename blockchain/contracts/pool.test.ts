import type { Hex } from 'viem';

import { describe, expect, it } from 'bun:test';

import client from '@/tests/client';

import { analytics, info } from './pool';

describe('Pool', () => {
  it('gets analytics for a pool', async () => {
    const pools: Hex[] = ['0x1eb5B4908508E97C3F5a0C49F04a87906610d079'];
    const response = await analytics(client.public, pools);

    expect(response).toHaveLength(pools.length);
  });

  it('gets info for a pool', async () => {
    const pools: Hex[] = ['0x1eb5B4908508E97C3F5a0C49F04a87906610d079', '0x1eb5B4908508E97C3F5a0C49F04a87906610d079'];
    const response = await info(client.public, pools);

    expect(response).toHaveLength(pools.length);
  });
});
