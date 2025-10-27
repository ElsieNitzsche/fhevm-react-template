/**
 * Key management utilities for FHE operations
 */

export interface NetworkKeys {
  publicKey: string;
  aclContract: string;
  gatewayUrl: string;
  networkUrl: string;
  chainId: number;
}

/**
 * Get FHE public key for the network
 */
export async function getNetworkPublicKey(chainId: number): Promise<string> {
  // In a real implementation, this would fetch from the network
  console.log('Fetching public key for chain:', chainId);

  // Simulated public key
  return '0x' + 'a'.repeat(128);
}

/**
 * Get ACL contract address for the network
 */
export function getACLContractAddress(chainId: number): string {
  const aclAddresses: Record<number, string> = {
    11155111: '0x' + 'b'.repeat(40), // Sepolia
    31337: '0x' + 'c'.repeat(40), // Localhost
  };

  return aclAddresses[chainId] || '0x0000000000000000000000000000000000000000';
}

/**
 * Get gateway URL for the network
 */
export function getGatewayUrl(chainId: number): string {
  const gatewayUrls: Record<number, string> = {
    11155111: 'https://gateway.sepolia.fhevm.io',
    31337: 'http://localhost:8545',
  };

  return gatewayUrls[chainId] || '';
}

/**
 * Get all network keys and configuration
 */
export async function getNetworkKeys(chainId: number): Promise<NetworkKeys> {
  const publicKey = await getNetworkPublicKey(chainId);
  const aclContract = getACLContractAddress(chainId);
  const gatewayUrl = getGatewayUrl(chainId);

  const networkUrls: Record<number, string> = {
    11155111: 'https://rpc.sepolia.org',
    31337: 'http://localhost:8545',
  };

  return {
    publicKey,
    aclContract,
    gatewayUrl,
    networkUrl: networkUrls[chainId] || '',
    chainId,
  };
}

/**
 * Validate public key format
 */
export function isValidPublicKey(publicKey: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(publicKey) && publicKey.length > 10;
}

/**
 * Generate EIP-712 permit message data
 */
export function generatePermitMessage(
  contractAddress: string,
  userAddress: string,
  chainId: number
) {
  return {
    types: {
      Permit: [
        { name: 'user', type: 'address' },
        { name: 'contract', type: 'address' },
        { name: 'timestamp', type: 'uint256' },
      ],
    },
    domain: {
      name: 'FHEVM ACL',
      version: '1',
      chainId,
      verifyingContract: contractAddress,
    },
    message: {
      user: userAddress,
      contract: contractAddress,
      timestamp: Math.floor(Date.now() / 1000),
    },
  };
}
