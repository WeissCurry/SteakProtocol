import { useMemo } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { useAnchorProvider } from './useAnchorProvider';
import idl from '../constants/idl.json';

export const PROGRAM_ID = new anchor.web3.PublicKey('BRtHP3yGJNVyBi3mvYBvNFu4fTQevF6TJ6avX98KNSak');

export const useSteakProgram = () => {
  const provider = useAnchorProvider();

  return useMemo(() => {
    return new anchor.Program(idl as anchor.Idl, provider);
  }, [provider]);
};
