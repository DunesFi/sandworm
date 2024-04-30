import type { Hex } from 'viem';

import { describe, expect, it } from 'bun:test';

import client from '@/tests/client';

import { info } from './token';

describe('Token', () => {
  it('gets info for tokens', async () => {
    const tokens: Hex[] = ['0xedc56465EAbced2937b8DD9F34382Bf569C828aE', '0xE780bA929c065172A3b9956166f0200A0cDE5485'];
    const response = await info(client.public, tokens);
    expect(response).toHaveLength(tokens.length);
    for (const info of response) {
      expect(info).toHaveProperty('name');
      expect(info).toHaveProperty('symbol');
      expect(info).toHaveProperty('decimals');
      expect(info.symbol).toBeTypeOf('string');
      expect(info.name).toBeTypeOf('string');
      expect(info.decimals).toBeTypeOf('number');
    }
  });
});
