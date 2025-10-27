import {
  createFHEVMClient,
  NETWORKS,
  hasWeb3Provider,
  isValidAddress,
  retry
} from '@fhevm/universal-sdk';
import type { FHEVMConfig, FHEVMClient } from '@fhevm/universal-sdk';
import { BrowserProvider } from 'ethers';

/**
 * Initialize FHEVM client for browser environment
 */
export async function initFHEVMClient(network: 'SEPOLIA' | 'LOCALHOST' = 'SEPOLIA'): Promise<FHEVMClient> {
  const config: FHEVMConfig = {
    network: NETWORKS[network],
  };

  // Retry initialization with exponential backoff
  return await retry(async () => {
    const client = createFHEVMClient(config);
    await client.init();
    return client;
  }, 3, 1000);
}

/**
 * Get wallet provider from browser
 */
export function getWalletProvider(): BrowserProvider | null {
  if (!hasWeb3Provider()) {
    return null;
  }

  return new BrowserProvider(window.ethereum);
}

/**
 * Request wallet connection
 */
export async function connectWallet(): Promise<string> {
  const provider = getWalletProvider();

  if (!provider) {
    throw new Error('No wallet provider found. Please install MetaMask.');
  }

  const accounts = await provider.send('eth_requestAccounts', []);

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts found');
  }

  const address = accounts[0];

  // Validate address using SDK utility
  if (!isValidAddress(address)) {
    throw new Error('Invalid Ethereum address returned from wallet');
  }

  return address;
}

/**
 * Get signer from connected wallet
 */
export async function getWalletSigner() {
  const provider = getWalletProvider();

  if (!provider) {
    throw new Error('No wallet provider found');
  }

  return await provider.getSigner();
}

/**
 * Check if wallet is connected
 */
export async function isWalletConnected(): Promise<boolean> {
  const provider = getWalletProvider();

  if (!provider) {
    return false;
  }

  try {
    const accounts = await provider.send('eth_accounts', []);
    return accounts && accounts.length > 0;
  } catch {
    return false;
  }
}
