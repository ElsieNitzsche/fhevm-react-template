/**
 * Security utilities for FHE operations
 * Uses FHEVM SDK utilities where applicable
 */

import {
  isValidAddress as sdkIsValidAddress,
  truncateAddress,
  formatError,
  getCurrentTimestamp
} from '@fhevm/universal-sdk';

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input.replace(/[^\w\s.-]/gi, '');
}

/**
 * Validate Ethereum address format (using SDK utility)
 */
export function isValidAddress(address: string): boolean {
  return sdkIsValidAddress(address);
}

/**
 * Display shortened address for UI (using SDK utility)
 */
export function displayAddress(address: string, chars = 4): string {
  return truncateAddress(address, chars);
}

/**
 * Format error for user display (using SDK utility)
 */
export function formatErrorMessage(error: any): string {
  return formatError(error);
}

/**
 * Validate signature format
 */
export function isValidSignature(signature: string): boolean {
  return /^0x[a-fA-F0-9]{130}$/.test(signature);
}

/**
 * Check if value is within safe range for encryption
 */
export function isWithinSafeRange(value: number, bits: 8 | 16 | 32 | 64): boolean {
  const maxValues: Record<number, number> = {
    8: 255,
    16: 65535,
    32: 4294967295,
    64: Number.MAX_SAFE_INTEGER,
  };

  return value >= 0 && value <= maxValues[bits];
}

/**
 * Rate limiting check (simple in-memory implementation)
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetAt) {
    requestCounts.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Hash sensitive data before logging
 */
export function hashForLogging(data: string): string {
  if (data.length <= 10) {
    return '***';
  }
  return `${data.slice(0, 6)}...${data.slice(-4)}`;
}

/**
 * Validate transaction parameters
 */
export function validateTransactionParams(params: {
  to?: string;
  value?: bigint;
  data?: string;
}): { valid: boolean; error?: string } {
  if (params.to && !isValidAddress(params.to)) {
    return { valid: false, error: 'Invalid recipient address' };
  }

  if (params.value && params.value < 0n) {
    return { valid: false, error: 'Invalid transaction value' };
  }

  if (params.data && !/^0x[a-fA-F0-9]*$/.test(params.data)) {
    return { valid: false, error: 'Invalid transaction data' };
  }

  return { valid: true };
}

/**
 * Check if timestamp is expired (using SDK utility)
 */
export function isExpired(timestamp: number, expirySeconds: number = 3600): boolean {
  return getCurrentTimestamp() > timestamp + expirySeconds;
}
