import {
  FHEVMClient,
  NETWORKS,
  batchUserDecrypt,
  createFHEVMClient,
  createFHEVMContract,
  delay,
  encryptAddress,
  encryptBatch,
  encryptBoolean,
  encryptNumber,
  formatDuration,
  formatError,
  formatHandle,
  generatePermit,
  getCurrentTimestamp,
  hasWeb3Provider,
  isEncrypted,
  isValidAddress,
  parseHandle,
  publicDecrypt,
  retry,
  safeUserDecrypt,
  truncateAddress,
  userDecrypt
} from "../chunk-7VTB6K2E.mjs";

// src/react/useFHEVM.tsx
import { useState, useEffect, useCallback, useRef } from "react";
function useFHEVM(options) {
  const { config, autoInit = true } = options;
  const [client, setClient] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const clientRef = useRef(null);
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
      const error2 = err instanceof Error ? err : new Error(String(err));
      setError(error2);
      console.error("Failed to initialize FHEVM client:", error2);
    } finally {
      setIsLoading(false);
    }
  }, [config]);
  useEffect(() => {
    if (autoInit && !clientRef.current) {
      init();
    }
  }, [autoInit, init]);
  const encryptNumber2 = useCallback(
    async (value, bits = 8) => {
      if (!clientRef.current) {
        throw new Error("FHEVM client not initialized");
      }
      return clientRef.current.encryptNumber(value, bits);
    },
    []
  );
  const encryptBoolean2 = useCallback(async (value) => {
    if (!clientRef.current) {
      throw new Error("FHEVM client not initialized");
    }
    return clientRef.current.encryptBoolean(value);
  }, []);
  const encryptAddress2 = useCallback(async (address) => {
    if (!clientRef.current) {
      throw new Error("FHEVM client not initialized");
    }
    return clientRef.current.encryptAddress(address);
  }, []);
  const userDecrypt2 = useCallback(
    async (handle, contractAddress, signer) => {
      if (!clientRef.current) {
        throw new Error("FHEVM client not initialized");
      }
      return clientRef.current.userDecrypt(handle, contractAddress, signer);
    },
    []
  );
  const generatePermit2 = useCallback(
    async (contractAddress, signer) => {
      if (!clientRef.current) {
        throw new Error("FHEVM client not initialized");
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
    encryptNumber: encryptNumber2,
    encryptBoolean: encryptBoolean2,
    encryptAddress: encryptAddress2,
    userDecrypt: userDecrypt2,
    generatePermit: generatePermit2
  };
}

// src/react/useFHEVMContract.tsx
import { useState as useState2, useCallback as useCallback2, useMemo as useMemo2 } from "react";
import { Contract } from "ethers";
function useFHEVMContract(options) {
  const { address, abi, signer, fhevmClient } = options;
  const [isLoading, setIsLoading] = useState2(false);
  const [error, setError] = useState2(null);
  const contract = useMemo2(() => {
    if (!signer || !fhevmClient || !address || !abi) {
      return null;
    }
    try {
      return new Contract(address, abi, signer);
    } catch (err) {
      console.error("Failed to create contract:", err);
      return null;
    }
  }, [address, abi, signer, fhevmClient]);
  const call = useCallback2(
    async (method, ...args) => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      setIsLoading(true);
      setError(null);
      try {
        const result = await contract[method](...args);
        return result;
      } catch (err) {
        const error2 = err instanceof Error ? err : new Error(String(err));
        setError(error2);
        throw error2;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );
  const send = useCallback2(
    async (method, ...args) => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      setIsLoading(true);
      setError(null);
      try {
        const tx = await contract[method](...args);
        const receipt = await tx.wait();
        return receipt;
      } catch (err) {
        const error2 = err instanceof Error ? err : new Error(String(err));
        setError(error2);
        throw error2;
      } finally {
        setIsLoading(false);
      }
    },
    [contract]
  );
  const sendEncrypted = useCallback2(
    async (method, encryptedInputs, ...additionalArgs) => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      if (!fhevmClient) {
        throw new Error("FHEVM client not initialized");
      }
      setIsLoading(true);
      setError(null);
      try {
        const { handles, inputProof } = encryptedInputs.encrypt();
        const tx = await contract[method](...handles, inputProof, ...additionalArgs);
        const receipt = await tx.wait();
        return receipt;
      } catch (err) {
        const error2 = err instanceof Error ? err : new Error(String(err));
        setError(error2);
        throw error2;
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
    error
  };
}
export {
  FHEVMClient,
  NETWORKS,
  batchUserDecrypt,
  createFHEVMClient,
  createFHEVMContract,
  delay,
  encryptAddress,
  encryptBatch,
  encryptBoolean,
  encryptNumber,
  formatDuration,
  formatError,
  formatHandle,
  generatePermit,
  getCurrentTimestamp,
  hasWeb3Provider,
  isEncrypted,
  isValidAddress,
  parseHandle,
  publicDecrypt,
  retry,
  safeUserDecrypt,
  truncateAddress,
  useFHEVM,
  useFHEVMContract,
  userDecrypt
};
