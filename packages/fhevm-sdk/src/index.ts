/**
 * FHEVM Universal SDK
 * Framework-agnostic SDK for building confidential smart contract frontends
 *
 * @packageDocumentation
 */

export { FHEVMClient, createFHEVMClient } from './client';
export type { FHEVMConfig, EncryptedInput } from './client';

export {
  NETWORKS,
  createFHEVMContract,
  formatHandle,
  parseHandle,
  isEncrypted,
  delay,
  retry,
  formatError,
  isValidAddress,
  truncateAddress,
  formatDuration,
  hasWeb3Provider,
  getCurrentTimestamp,
} from './utils';

// Re-export commonly used types from dependencies
export type { BrowserProvider, JsonRpcProvider, Signer, Contract } from 'ethers';
