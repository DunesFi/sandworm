import { Prisma } from '@prisma/client';

export function toDecimal(n: bigint) {
  return new Prisma.Decimal(n.toString());
}

export function fromDecimal(n: Prisma.Decimal) {
  return BigInt(n.toString());
}