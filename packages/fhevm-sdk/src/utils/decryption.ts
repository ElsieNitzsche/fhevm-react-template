import { Signer } from 'ethers';
import { FHEVMClient } from '../core/fhevm';
import { DecryptionResult } from '../types';

/**
 * User-initiated decryption with EIP-712 signature
 */
export async function userDecrypt(
  client: FHEVMClient,
  handle: bigint,
  contractAddress: string,
  signer: Signer
): Promise<bigint> {
  return await client.userDecrypt(handle, contractAddress, signer);
}

/**
 * Public decryption (via gateway/KMS)
 */
export async function publicDecrypt(
  client: FHEVMClient,
  handles: bigint[],
  contractAddress: string
): Promise<bigint[]> {
  return await client.publicDecrypt(handles, contractAddress);
}

/**
 * Safe decryption with error handling
 */
export async function safeUserDecrypt(
  client: FHEVMClient,
  handle: bigint,
  contractAddress: string,
  signer: Signer
): Promise<DecryptionResult> {
  try {
    const value = await userDecrypt(client, handle, contractAddress, signer);
    return {
      value,
      success: true,
    };
  } catch (error) {
    return {
      value: BigInt(0),
      success: false,
      error: error instanceof Error ? error.message : 'Decryption failed',
    };
  }
}

/**
 * Batch decrypt multiple handles
 */
export async function batchUserDecrypt(
  client: FHEVMClient,
  handles: bigint[],
  contractAddress: string,
  signer: Signer
): Promise<DecryptionResult[]> {
  const results: DecryptionResult[] = [];

  for (const handle of handles) {
    const result = await safeUserDecrypt(client, handle, contractAddress, signer);
    results.push(result);
  }

  return results;
}

/**
 * Generate permit signature for contract access
 */
export async function generatePermit(
  client: FHEVMClient,
  contractAddress: string,
  signer: Signer
): Promise<string> {
  return await client.generatePermitSignature(contractAddress, signer);
}
