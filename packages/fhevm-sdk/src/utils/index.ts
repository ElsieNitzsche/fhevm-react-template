export * from './encryption';
export * from './decryption';

import { Contract, Signer } from 'ethers';
import { FHEVMClient } from '../core/fhevm';

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

    async call(method: string, ...args: any[]) {
      return await contract[method](...args);
    },

    async send(method: string, ...args: any[]) {
      const tx = await contract[method](...args);
      return await tx.wait();
    },

    async sendEncrypted(
      method: string,
      encryptedInputs: any,
      ...additionalArgs: any[]
    ) {
      const { handles, inputProof } = encryptedInputs.encrypt();
      const tx = await contract[method](...handles, inputProof, ...additionalArgs);
      return await tx.wait();
    },

    getRawContract() {
      return contract;
    },
  };
}

export function formatHandle(handle: bigint | number): string {
  return `0x${BigInt(handle).toString(16).padStart(64, '0')}`;
}

export function parseHandle(handleStr: string): bigint {
  return BigInt(handleStr);
}

export function isEncrypted(value: any): boolean {
  if (typeof value === 'bigint') {
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

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
        delayMs *= 2;
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

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

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function truncateAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) {
    return address;
  }
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}

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

export function hasWeb3Provider(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}
