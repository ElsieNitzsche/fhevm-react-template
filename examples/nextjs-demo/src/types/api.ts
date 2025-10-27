/**
 * API type definitions for Next.js routes
 */

/**
 * Standard API response
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Encryption API request
 */
export interface EncryptRequest {
  value: number | boolean | string;
  type: 'number' | 'boolean' | 'address';
  bits?: 8 | 16 | 32 | 64;
}

/**
 * Encryption API response
 */
export interface EncryptResponse {
  success: boolean;
  encryptedHandle: string;
  type: string;
  originalValue?: any;
  message: string;
}

/**
 * Decryption API request
 */
export interface DecryptRequest {
  handle: string;
  contractAddress: string;
  signature: string;
}

/**
 * Decryption API response
 */
export interface DecryptResponse {
  success: boolean;
  handle: string;
  decryptedValue: number | boolean | string;
  message: string;
}

/**
 * Computation API request
 */
export interface ComputeRequest {
  operation: 'add' | 'multiply' | 'compare' | 'subtract';
  operands: string[];
}

/**
 * Computation API response
 */
export interface ComputeResponse {
  success: boolean;
  operation: string;
  operandCount: number;
  resultHandle: string;
  message: string;
}

/**
 * Keys API response
 */
export interface KeysResponse {
  success: boolean;
  network: string;
  publicKey: string;
  aclContract: string;
  gatewayUrl: string;
  message: string;
}

/**
 * Permit generation request
 */
export interface PermitRequest {
  action: 'generatePermit';
  contractAddress: string;
  userAddress: string;
}

/**
 * Permit generation response
 */
export interface PermitResponse {
  success: boolean;
  permitData: {
    types: any;
    domain: any;
    message: any;
  };
  message: string;
}
