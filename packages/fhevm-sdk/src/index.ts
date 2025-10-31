/**
 * FHEVM Universal SDK
 * Framework-agnostic SDK for building confidential smart contract frontends
 *
 * @packageDocumentation
 */

export { FHEVMClient, createFHEVMClient } from './core/fhevm';
export type { FHEVMConfig, EncryptedInput } from './core/fhevm';

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
  encryptNumber,
  encryptBoolean,
  encryptAddress,
  encryptBatch,
  userDecrypt,
  publicDecrypt,
  safeUserDecrypt,
  batchUserDecrypt,
  generatePermit,
} from './utils/index';

export type {
  NetworkConfig,
  EncryptionBits,
  EncryptionResult,
  DecryptionResult,
} from './types';

export type { BrowserProvider, JsonRpcProvider, Signer, Contract } from 'ethers';
