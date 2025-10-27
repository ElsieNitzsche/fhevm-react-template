import { FHEVMClient } from '../core/fhevm';
import { EncryptionBits } from '../types';

/**
 * Encrypt a number with specified bit size
 */
export async function encryptNumber(
  client: FHEVMClient,
  value: number,
  bits: EncryptionBits = 8
): Promise<Uint8Array> {
  return await client.encryptNumber(value, bits);
}

/**
 * Encrypt a boolean value
 */
export async function encryptBoolean(
  client: FHEVMClient,
  value: boolean
): Promise<Uint8Array> {
  return await client.encryptBoolean(value);
}

/**
 * Encrypt an Ethereum address
 */
export async function encryptAddress(
  client: FHEVMClient,
  address: string
): Promise<Uint8Array> {
  if (!isValidAddress(address)) {
    throw new Error(`Invalid Ethereum address: ${address}`);
  }
  return await client.encryptAddress(address);
}

/**
 * Validate Ethereum address format
 */
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Batch encrypt multiple values
 */
export async function encryptBatch(
  client: FHEVMClient,
  values: Array<{ value: number | boolean | string; type: 'number' | 'boolean' | 'address'; bits?: EncryptionBits }>
): Promise<Uint8Array[]> {
  const results: Uint8Array[] = [];

  for (const item of values) {
    let encrypted: Uint8Array;

    switch (item.type) {
      case 'number':
        encrypted = await encryptNumber(client, item.value as number, item.bits);
        break;
      case 'boolean':
        encrypted = await encryptBoolean(client, item.value as boolean);
        break;
      case 'address':
        encrypted = await encryptAddress(client, item.value as string);
        break;
      default:
        throw new Error(`Unsupported type: ${item.type}`);
    }

    results.push(encrypted);
  }

  return results;
}
