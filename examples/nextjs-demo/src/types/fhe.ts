/**
 * FHE-specific type definitions for the Next.js demo
 */

import { Signer, Contract } from 'ethers';

export type { FHEVMClient, FHEVMConfig, EncryptedInput } from '@fhevm/universal-sdk';

/**
 * Wallet connection state
 */
export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  signer: Signer | null;
}

/**
 * FHE client state
 */
export interface FHEClientState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Encrypted value with metadata
 */
export interface EncryptedValue {
  value: Uint8Array;
  type: 'number' | 'boolean' | 'address';
  bits?: 8 | 16 | 32 | 64;
  timestamp: number;
}

/**
 * Decryption request with signature
 */
export interface DecryptRequest {
  handle: bigint;
  contractAddress: string;
  signature: string;
}

/**
 * Component props for demo components
 */
export interface DemoComponentProps {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Contract interaction state
 */
export interface ContractState {
  contract: Contract | null;
  isLoading: boolean;
  error: Error | null;
}
