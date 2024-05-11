// Function to calculate total points based on dETHMintAmount
import { DepositorInfoJson } from './actions/types';
import { BASE_AMOUNT, BASE_POINTS, REF_SHARE } from '../config/spices';

export function calculateDETHDepositSpices(dETHMintAmount: bigint, isRef: boolean): bigint {
  if (isRef) {
    return (dETHMintAmount * BASE_POINTS * REF_SHARE) / (BASE_AMOUNT * 100n);
  }
  return (dETHMintAmount * BASE_POINTS) / BASE_AMOUNT;
}

export function getTotalDETHDeposit(deposit1: DepositorInfoJson, deposit2: DepositorInfoJson): DepositorInfoJson {
  const totalMintAmount = BigInt(deposit1.totalMintAmount) + BigInt(deposit2.totalMintAmount);
  const totalReferred = BigInt(deposit1.totalReferred) + BigInt(deposit2.totalReferred);
  const mintPoints = calculateDETHDepositSpices(totalMintAmount, false);
  const refPoints = calculateDETHDepositSpices(totalReferred, true);
  const totalPoints = mintPoints + refPoints;

  return {
    id: deposit1.id,
    depositor: deposit1.depositor,
    totalMintAmount: totalMintAmount.toString(),
    mintPoints: mintPoints.toString(),
    totalReferred: totalReferred.toString(),
    refPoints: refPoints.toString(),
    totalPoints: totalPoints.toString(),
  };
}
