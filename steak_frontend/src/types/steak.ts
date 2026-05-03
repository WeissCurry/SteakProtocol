import * as anchor from '@coral-xyz/anchor';

export interface BatchAccount {
  batchId: anchor.BN;
  lockDuration: anchor.BN;
  startTime: anchor.BN;
  isActive: boolean;
  totalStaked: anchor.BN;
  finalRevenue: anchor.BN;
  isHarvested: boolean;
  bump: number;
  maxCapacity: anchor.BN;
  apy: anchor.BN;
}

export interface ProgramAccount<T> {
  publicKey: anchor.web3.PublicKey;
  account: T;
}
