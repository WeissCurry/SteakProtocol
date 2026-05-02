import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

export const getGlobalStateAddress = (programId: PublicKey) => {
  return PublicKey.findProgramAddressSync([Buffer.from('global_state')], programId)[0];
};

export const getBatchAddress = (batchId: number, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('batch'), new anchor.BN(batchId).toArrayLike(Buffer, 'le', 8)],
    programId,
  )[0];
};

export const getBatchVaultAddress = (batchId: number, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('batch_vault'), new anchor.BN(batchId).toArrayLike(Buffer, 'le', 8)],
    programId,
  )[0];
};

export const getUserStakeAddress = (user: PublicKey, batchId: number, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('user_stake'),
      user.toBuffer(),
      new anchor.BN(batchId).toArrayLike(Buffer, 'le', 8),
    ],
    programId,
  )[0];
};
