/**
 * Validation utilities for user inputs and FHE operations
 */

import { FHEDataType } from '../fhe/types';

/**
 * Validate number input for encryption
 */
export function validateNumberForEncryption(
  value: number,
  bits: 8 | 16 | 32 | 64
): { valid: boolean; error?: string } {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: 'Value must be a valid number' };
  }

  if (!Number.isInteger(value)) {
    return { valid: false, error: 'Value must be an integer' };
  }

  if (value < 0) {
    return { valid: false, error: 'Value must be non-negative' };
  }

  const maxValues: Record<number, number> = {
    8: 255,
    16: 65535,
    32: 4294967295,
    64: Number.MAX_SAFE_INTEGER,
  };

  if (value > maxValues[bits]) {
    return { valid: false, error: `Value exceeds maximum for ${bits}-bit integer (${maxValues[bits]})` };
  }

  return { valid: true };
}

/**
 * Validate boolean input
 */
export function validateBoolean(value: any): { valid: boolean; error?: string } {
  if (typeof value !== 'boolean') {
    return { valid: false, error: 'Value must be a boolean' };
  }

  return { valid: true };
}

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): { valid: boolean; error?: string } {
  if (typeof address !== 'string') {
    return { valid: false, error: 'Address must be a string' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: false, error: 'Invalid Ethereum address format' };
  }

  return { valid: true };
}

/**
 * Validate encrypted handle
 */
export function validateHandle(handle: any): { valid: boolean; error?: string } {
  if (typeof handle !== 'bigint' && typeof handle !== 'number' && typeof handle !== 'string') {
    return { valid: false, error: 'Handle must be a bigint, number, or hex string' };
  }

  try {
    const handleBigInt = typeof handle === 'bigint' ? handle : BigInt(handle);
    if (handleBigInt < 0n) {
      return { valid: false, error: 'Handle must be non-negative' };
    }
  } catch {
    return { valid: false, error: 'Invalid handle format' };
  }

  return { valid: true };
}

/**
 * Validate FHE data type
 */
export function validateFHEDataType(type: string): { valid: boolean; error?: string } {
  const validTypes: FHEDataType[] = [
    'bool',
    'uint8',
    'uint16',
    'uint32',
    'uint64',
    'uint128',
    'uint256',
    'address',
  ];

  if (!validTypes.includes(type as FHEDataType)) {
    return { valid: false, error: `Invalid FHE data type. Must be one of: ${validTypes.join(', ')}` };
  }

  return { valid: true };
}

/**
 * Validate contract ABI
 */
export function validateContractABI(abi: any): { valid: boolean; error?: string } {
  if (!Array.isArray(abi)) {
    return { valid: false, error: 'ABI must be an array' };
  }

  if (abi.length === 0) {
    return { valid: false, error: 'ABI cannot be empty' };
  }

  return { valid: true };
}

/**
 * Validate encrypted input
 */
export function validateEncryptedInput(input: any): { valid: boolean; error?: string } {
  if (!input || typeof input !== 'object') {
    return { valid: false, error: 'Encrypted input must be an object' };
  }

  if (!Array.isArray(input.handles)) {
    return { valid: false, error: 'Encrypted input must have handles array' };
  }

  if (typeof input.inputProof !== 'string') {
    return { valid: false, error: 'Encrypted input must have inputProof string' };
  }

  return { valid: true };
}

/**
 * Validate gas limit
 */
export function validateGasLimit(gasLimit: any): { valid: boolean; error?: string } {
  try {
    const limit = typeof gasLimit === 'bigint' ? gasLimit : BigInt(gasLimit);

    if (limit <= 0n) {
      return { valid: false, error: 'Gas limit must be positive' };
    }

    if (limit > BigInt(30000000)) {
      return { valid: false, error: 'Gas limit too high' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid gas limit format' };
  }
}
