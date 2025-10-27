import { useState, useEffect, useCallback, useRef } from 'react';
import { Signer } from 'ethers';
import { FHEVMClient, FHEVMConfig, createFHEVMClient } from '../core/fhevm';

export interface UseFhevmOptions {
  config: FHEVMConfig;
  autoInit?: boolean;
}

export interface UseFhevmReturn {
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

export function useFhevm(options: UseFhevmOptions): UseFhevmReturn {
  const { config, autoInit = true } = options;

  const [client, setClient] = useState<FHEVMClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clientRef = useRef<FHEVMClient | null>(null);

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

  useEffect(() => {
    if (autoInit && !clientRef.current) {
      init();
    }
  }, [autoInit, init]);

  const encryptNumber = useCallback(
    async (value: number, bits: 8 | 16 | 32 | 64 = 8) => {
      if (!clientRef.current) {
        throw new Error('FHEVM client not initialized');
      }
      return clientRef.current.encryptNumber(value, bits);
    },
    []
  );

  const encryptBoolean = useCallback(async (value: boolean) => {
    if (!clientRef.current) {
      throw new Error('FHEVM client not initialized');
    }
    return clientRef.current.encryptBoolean(value);
  }, []);

  const encryptAddress = useCallback(async (address: string) => {
    if (!clientRef.current) {
      throw new Error('FHEVM client not initialized');
    }
    return clientRef.current.encryptAddress(address);
  }, []);

  const userDecrypt = useCallback(
    async (handle: bigint, contractAddress: string, signer: Signer) => {
      if (!clientRef.current) {
        throw new Error('FHEVM client not initialized');
      }
      return clientRef.current.userDecrypt(handle, contractAddress, signer);
    },
    []
  );

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
