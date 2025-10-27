import { useState, useCallback } from 'react';
import { useFHEContext } from '../components/fhe/FHEProvider';
import { isValidAddress } from '@fhevm/universal-sdk';

interface UseEncryptionReturn {
  encrypt: (value: number | boolean | string, type: 'number' | 'boolean' | 'address', bits?: 8 | 16 | 32 | 64) => Promise<Uint8Array>;
  isEncrypting: boolean;
  error: Error | null;
  lastEncrypted: Uint8Array | null;
}

/**
 * Hook for encryption operations
 * Uses FHEVM SDK utilities for validation
 */
export function useEncryption(): UseEncryptionReturn {
  const { encryptNumber, encryptBoolean, encryptAddress, isInitialized } = useFHEContext();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastEncrypted, setLastEncrypted] = useState<Uint8Array | null>(null);

  const encrypt = useCallback(
    async (
      value: number | boolean | string,
      type: 'number' | 'boolean' | 'address',
      bits: 8 | 16 | 32 | 64 = 8
    ): Promise<Uint8Array> => {
      if (!isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        let encrypted: Uint8Array;

        switch (type) {
          case 'number':
            if (typeof value !== 'number') {
              throw new Error('Value must be a number');
            }
            encrypted = await encryptNumber(value, bits);
            break;

          case 'boolean':
            if (typeof value !== 'boolean') {
              throw new Error('Value must be a boolean');
            }
            encrypted = await encryptBoolean(value);
            break;

          case 'address':
            if (typeof value !== 'string') {
              throw new Error('Value must be a string address');
            }
            // Use SDK validation utility
            if (!isValidAddress(value)) {
              throw new Error('Invalid Ethereum address format');
            }
            encrypted = await encryptAddress(value);
            break;

          default:
            throw new Error(`Unsupported encryption type: ${type}`);
        }

        setLastEncrypted(encrypted);
        return encrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [isInitialized, encryptNumber, encryptBoolean, encryptAddress]
  );

  return {
    encrypt,
    isEncrypting,
    error,
    lastEncrypted,
  };
}
