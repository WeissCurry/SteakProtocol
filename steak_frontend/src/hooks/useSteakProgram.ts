import { useMemo } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { useAnchorProvider } from './useAnchorProvider';
import idl from '../constants/idl.json';

export const PROGRAM_ID = new anchor.web3.PublicKey('GY3PgUAPuXte7ZH7VUjixuSn4pKqLDsfREitaqbu6zmA');

export const useSteakProgram = () => {
  const provider = useAnchorProvider();

  return useMemo(() => {
    return new anchor.Program(idl as anchor.Idl, provider);
  }, [provider]);
};
