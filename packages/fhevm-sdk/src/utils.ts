import { Contract, Signer } from 'ethers';
import { FHEVMClient } from './client';

/**
 * Network configurations for common FHEVM-enabled networks
 */
export const NETWORKS = {
  SEPOLIA: {
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    name: 'Sepolia Testnet',
    explorer: 'https://sepolia.etherscan.io',
  },
  ZAMA_DEVNET: {
    chainId: 9000,
    rpcUrl: 'https://devnet.zama.ai',
    name: 'Zama Devnet',
    explorer: 'https://explorer.zama.ai',
  },
  LOCAL: {
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    name: 'Local Hardhat',
    explorer: '',
  },
} as const;

/**
 * Helper to create a contract instance with FHEVM support
 * @param address - Contract address
 * @param abi - Contract ABI
 * @param signer - Signer instance
 * @param fhevmClient - FHEVM client for encryption
 */
export function createFHEVMContract(
  address: string,
  abi: any[],
  signer: Signer,
  fhevmClient: FHEVMClient
) {
  const contract = new Contract(address, abi, signer);

  return {
    contract,
    fhevmClient,

    /**
     * Call a view function
     */
    async call(method: string, ...args: any[]) {
      return await contract[method](...args);
    },

    /**
     * Send a transaction
     */
    async send(method: string, ...args: any[]) {
      const tx = await contract[method](...args);
      return await tx.wait();
    },

    /**
     * Send a transaction with encrypted inputs
     */
    async sendEncrypted(
      method: string,
      encryptedInputs: any,
      ...additionalArgs: any[]
    ) {
      // Generate input proof
      const { handles, inputProof } = encryptedInputs.encrypt();

      // Call contract with encrypted inputs
      const tx = await contract[method](...handles, inputProof, ...additionalArgs);
      return await tx.wait();
    },

    /**
     * Get raw contract instance
     */
    getRawContract() {
      return contract;
    },
  };
}

/**
 * Format encrypted handle for display
 */
export function formatHandle(handle: bigint | number): string {
  return `0x${BigInt(handle).toString(16).padStart(64, '0')}`;
}

/**
 * Parse handle from string
 */
export function parseHandle(handleStr: string): bigint {
  return BigInt(handleStr);
}

/**
 * Check if a value is encrypted (basic heuristic)
 */
export function isEncrypted(value: any): boolean {
  if (typeof value === 'bigint') {
    // Encrypted handles are typically very large numbers
    return value > BigInt('0xffffffffffffffff');
  }
  if (typeof value === 'string' && value.startsWith('0x')) {
    try {
      const bi = BigInt(value);
      return bi > BigInt('0xffffffffffffffff');
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Delay helper for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry helper for network operations
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
        await delay(delayMs);
        delayMs *= 2; // Exponential backoff
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Format error messages for better UX
 */
export function formatError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  if (error?.reason) {
    return error.reason;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) {
    return address;
  }
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}

/**
 * Convert duration to human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  }
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  }
  return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
}

/**
 * Check if browser supports Web3
 */
export function hasWeb3Provider(): boolean {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Get current timestamp in seconds
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}
