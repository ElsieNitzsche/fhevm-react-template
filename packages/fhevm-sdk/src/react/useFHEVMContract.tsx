import { useState, useEffect, useCallback, useMemo } from 'react';
import { Contract, Signer } from 'ethers';
import { FHEVMClient } from '../core/fhevm';
import { createFHEVMContract } from '../utils';

export interface UseFHEVMContractOptions {
  address: string;
  abi: any[];
  signer: Signer | null;
  fhevmClient: FHEVMClient | null;
}

export interface UseFHEVMContractReturn {
  contract: Contract | null;
  call: (method: string, ...args: any[]) => Promise<any>;
  send: (method: string, ...args: any[]) => Promise<any>;
  sendEncrypted: (method: string, encryptedInputs: any, ...args: any[]) => Promise<any>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * React hook for FHEVM-enabled contracts
 * Provides easy methods for calling and sending transactions with encryption
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { signer } = useSigner();
 *   const { client } = useFHEVM({ config });
 *
 *   const { call, send, sendEncrypted } = useFHEVMContract({
 *     address: '0x...',
 *     abi: [...],
 *     signer,
 *     fhevmClient: client
 *   });
 *
 *   // Call view function
 *   const result = await call('getResult');
 *
 *   // Send transaction
 *   await send('setPublicValue', 42);
 *
 *   // Send with encrypted input
 *   const input = client.createEncryptedInput(address, signer);
 *   input.add8(42);
 *   await sendEncrypted('setEncryptedValue', input);
 * }
 * ```
 */
export function useFHEVMContract(options: UseFHEVMContractOptions): UseFHEVMContractReturn {
  const { address, abi, signer, fhevmClient } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create contract instance
  const contract = useMemo(() => {
    if (!signer || !fhevmClient || !address || !abi) {
      return null;
    }

    try {
      return new Contract(address, abi, signer);
    } catch (err) {
      console.error('Failed to create contract:', err);
      return null;
    }
  }, [address, abi, signer, fhevmClient]);

  // Call view function
  const call = useCallback(
    async (method: string, ...args: any[]) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await contract[method](...args);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  // Send transaction
  const send = useCallback(
    async (method: string, ...args: any[]) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const tx = await contract[method](...args);
        const receipt = await tx.wait();
        return receipt;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );

  // Send transaction with encrypted inputs
  const sendEncrypted = useCallback(
    async (method: string, encryptedInputs: any, ...additionalArgs: any[]) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }
      if (!fhevmClient) {
        throw new Error('FHEVM client not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        // Generate input proof
        const { handles, inputProof } = encryptedInputs.encrypt();

        // Call contract with encrypted inputs
        const tx = await contract[method](...handles, inputProof, ...additionalArgs);
        const receipt = await tx.wait();
        return receipt;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract, fhevmClient]
  );

  return {
    contract,
    call,
    send,
    sendEncrypted,
    isLoading,
    error,
  };
}
