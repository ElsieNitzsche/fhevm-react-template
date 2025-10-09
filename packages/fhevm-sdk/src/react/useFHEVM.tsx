import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { BrowserProvider, Signer } from 'ethers';
import { FHEVMClient, FHEVMConfig, createFHEVMClient } from '../client';
import { hasWeb3Provider } from '../utils';

export interface UseFHEVMOptions {
  config: FHEVMConfig;
  autoInit?: boolean;
}

export interface UseFHEVMReturn {
  client: FHEVMClient | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  init: () => Promise<void>;
  encryptNumber: (value: number, bits?: 8 | 16 | 32 | 64) => Promise<Uint8Array>;
  encryptBoolean: (value: boolean) => Promise<Uint8Array>;
  encryptAddress: (address: string) => Promise<Uint8Array>;
  userDecrypt: (handle: bigint, contractAddress: string, signer: Signer) => Promise<bigint>;
  generatePermit: (contractAddress: string, signer: Signer) => Promise<string>;
}

/**
 * React hook for FHEVM client
 * Provides easy access to FHEVM encryption/decryption functionality
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, isInitialized, encryptNumber } = useFHEVM({
 *     config: {
 *       network: {
 *         chainId: 11155111,
 *         rpcUrl: 'https://rpc.sepolia.org'
 *       }
 *     }
 *   });
 *
 *   const encrypted = await encryptNumber(42, 8);
 * }
 * ```
 */
export function useFHEVM(options: UseFHEVMOptions): UseFHEVMReturn {
  const { config, autoInit = true } = options;

  const [client, setClient] = useState<FHEVMClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clientRef = useRef<FHEVMClient | null>(null);

  // Initialize client
  const init = useCallback(async () => {
    if (clientRef.current?.isInitialized()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newClient = createFHEVMClient(config);
      await newClient.init();

      clientRef.current = newClient;
      setClient(newClient);
      setIsInitialized(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Failed to initialize FHEVM client:', error);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  // Auto-initialize on mount if enabled
  useEffect(() => {
    if (autoInit && !clientRef.current) {
      init();
    }
  }, [autoInit, init]);

  // Encrypt number helper
  const encryptNumber = useCallback(
    async (value: number, bits: 8 | 16 | 32 | 64 = 8) => {
      if (!clientRef.current) {
        throw new Error('FHEVM client not initialized');
      }
      return clientRef.current.encryptNumber(value, bits);
    },
    []
  );

  // Encrypt boolean helper
  const encryptBoolean = useCallback(async (value: boolean) => {
    if (!clientRef.current) {
      throw new Error('FHEVM client not initialized');
    }
    return clientRef.current.encryptBoolean(value);
  }, []);

  // Encrypt address helper
  const encryptAddress = useCallback(async (address: string) => {
    if (!clientRef.current) {
      throw new Error('FHEVM client not initialized');
    }
    return clientRef.current.encryptAddress(address);
  }, []);

  // User decrypt helper
  const userDecrypt = useCallback(
    async (handle: bigint, contractAddress: string, signer: Signer) => {
      if (!clientRef.current) {
        throw new Error('FHEVM client not initialized');
      }
      return clientRef.current.userDecrypt(handle, contractAddress, signer);
    },
    []
  );

  // Generate permit signature helper
  const generatePermit = useCallback(
    async (contractAddress: string, signer: Signer) => {
      if (!clientRef.current) {
        throw new Error('FHEVM client not initialized');
      }
      return clientRef.current.generatePermitSignature(contractAddress, signer);
    },
    []
  );

  return {
    client,
    isInitialized,
    isLoading,
    error,
    init,
    encryptNumber,
    encryptBoolean,
    encryptAddress,
    userDecrypt,
    generatePermit,
  };
}
