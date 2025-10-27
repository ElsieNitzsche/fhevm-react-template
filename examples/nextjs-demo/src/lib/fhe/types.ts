import { Signer, Contract } from 'ethers';

/**
 * FHE data types supported by FHEVM
 */
export type FHEDataType =
  | 'bool'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'address';

/**
 * Encrypted handle returned from encryption operations
 */
export type EncryptedHandle = bigint;

/**
 * Encrypted input for contract functions
 */
export interface FHEEncryptedInput {
  handles: Uint8Array[];
  inputProof: string;
}

/**
 * Decryption request
 */
export interface DecryptionRequest {
  handle: EncryptedHandle;
  contractAddress: string;
  userAddress: string;
  signature: string;
}

/**
 * Decryption result
 */
export interface DecryptionResult {
  handle: EncryptedHandle;
  value: bigint;
  timestamp: number;
}

/**
 * Permission grant for encrypted data access
 */
export interface PermissionGrant {
  contractAddress: string;
  userAddress: string;
  signature: string;
  expiresAt: number;
}

/**
 * FHE computation operation
 */
export interface FHEOperation {
  type: 'add' | 'sub' | 'mul' | 'div' | 'and' | 'or' | 'xor' | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';
  operands: EncryptedHandle[];
}

/**
 * FHE computation result
 */
export interface FHEComputationResult {
  operation: FHEOperation;
  resultHandle: EncryptedHandle;
  gasUsed?: bigint;
}

/**
 * Contract with FHE support
 */
export interface FHEContract extends Contract {
  address: string;
  signer: Signer | null;
}

/**
 * FHE transaction options
 */
export interface FHETransactionOptions {
  gasLimit?: bigint;
  gasPrice?: bigint;
  value?: bigint;
  nonce?: number;
}

/**
 * FHE network configuration
 */
export interface FHENetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  gatewayUrl?: string;
  aclAddress?: string;
  blockExplorer?: string;
}
