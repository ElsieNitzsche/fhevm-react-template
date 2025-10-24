# FHEVM Universal SDK - API Reference

Complete API documentation for the FHEVM Universal SDK.

---

## Table of Contents

- [Core SDK](#core-sdk)
  - [createFHEVMClient](#createfhevmclient)
  - [FHEVMClient Class](#fhevmclient-class)
- [React Hooks](#react-hooks)
  - [useFHEVM](#usefhevm)
  - [useFHEVMContract](#usefhevmcontract)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)
- [Network Configurations](#network-configurations)

---

## Core SDK

### createFHEVMClient

Factory function to create a new FHEVM client instance.

**Signature:**
```typescript
function createFHEVMClient(config?: FHEVMConfig): FHEVMClient
```

**Parameters:**
- `config` (optional): Configuration object
  - `network`: Network configuration (default: `NETWORKS.SEPOLIA`)
  - `provider`: Custom ethers provider (optional)
  - `gatewayUrl`: Custom gateway URL (optional)
  - `aclAddress`: Custom ACL contract address (optional)

**Returns:** `FHEVMClient` instance

**Example:**
```typescript
import { createFHEVMClient, NETWORKS } from '@fhevm/universal-sdk';

// Use default Sepolia network
const client = createFHEVMClient();

// Use custom network
const client = createFHEVMClient({
  network: NETWORKS.ZAMA_DEVNET
});

// Use custom provider
const provider = new ethers.providers.Web3Provider(window.ethereum);
const client = createFHEVMClient({
  network: NETWORKS.SEPOLIA,
  provider
});
```

---

### FHEVMClient Class

Main class for interacting with FHEVM encryption and decryption.

#### Methods

##### `init()`

Initialize the FHEVM client. Must be called before using encryption/decryption methods.

**Signature:**
```typescript
async init(): Promise<void>
```

**Throws:** Error if initialization fails

**Example:**
```typescript
const client = createFHEVMClient();
await client.init();
```

---

##### `encrypt(value, bits)`

Encrypt a value with specified bit size.

**Signature:**
```typescript
async encrypt(
  value: number | bigint,
  bits: 8 | 16 | 32 | 64 | 128 | 256
): Promise<Uint8Array>
```

**Parameters:**
- `value`: Number or BigInt to encrypt
- `bits`: Bit size (8, 16, 32, 64, 128, or 256)

**Returns:** Encrypted value as Uint8Array

**Example:**
```typescript
const encrypted = await client.encrypt(42, 8);
await contract.submitValue(encrypted);
```

---

##### `encryptNumber(value, bits)`

Alias for `encrypt()`. Encrypt a numeric value.

**Signature:**
```typescript
async encryptNumber(
  value: number,
  bits: 8 | 16 | 32 | 64 | 128 | 256
): Promise<Uint8Array>
```

**Example:**
```typescript
const encrypted = await client.encryptNumber(100, 16);
```

---

##### `encryptBool(value)`

Encrypt a boolean value.

**Signature:**
```typescript
async encryptBool(value: boolean): Promise<Uint8Array>
```

**Parameters:**
- `value`: Boolean to encrypt

**Returns:** Encrypted boolean as Uint8Array

**Example:**
```typescript
const encrypted = await client.encryptBool(true);
await contract.setApproval(encrypted);
```

---

##### `encryptAddress(address)`

Encrypt an Ethereum address.

**Signature:**
```typescript
async encryptAddress(address: string): Promise<Uint8Array>
```

**Parameters:**
- `address`: Ethereum address (0x...)

**Returns:** Encrypted address as Uint8Array

**Throws:** Error if address is invalid

**Example:**
```typescript
const encrypted = await client.encryptAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
await contract.setOwner(encrypted);
```

---

##### `decrypt(ciphertext, contractAddress, userAddress)`

Decrypt a ciphertext value (user decrypt).

**Signature:**
```typescript
async decrypt(
  ciphertext: string,
  contractAddress: string,
  userAddress: string
): Promise<bigint>
```

**Parameters:**
- `ciphertext`: Encrypted value (hex string)
- `contractAddress`: Contract address that owns the ciphertext
- `userAddress`: User address requesting decryption

**Returns:** Decrypted value as BigInt

**Example:**
```typescript
const decrypted = await client.decrypt(
  ciphertext,
  '0x...',
  await signer.getAddress()
);
console.log('Decrypted value:', decrypted.toString());
```

---

##### `decryptPublic(ciphertext)`

Decrypt a public ciphertext (no permission required).

**Signature:**
```typescript
async decryptPublic(ciphertext: string): Promise<bigint>
```

**Parameters:**
- `ciphertext`: Public encrypted value (hex string)

**Returns:** Decrypted value as BigInt

**Example:**
```typescript
const result = await contract.getPublicResult();
const decrypted = await client.decryptPublic(result);
```

---

##### `generatePermitSignature(contractAddress, userAddress)`

Generate a permit signature for reencryption.

**Signature:**
```typescript
async generatePermitSignature(
  contractAddress: string,
  userAddress: string
): Promise<PermitSignature>
```

**Parameters:**
- `contractAddress`: Contract address
- `userAddress`: User address

**Returns:** Permit signature object

**Example:**
```typescript
const permit = await client.generatePermitSignature(
  contractAddress,
  userAddress
);
await contract.grantAccess(permit);
```

---

##### `getPublicKey()`

Get the FHE public key.

**Signature:**
```typescript
getPublicKey(): string
```

**Returns:** Public key as hex string

**Example:**
```typescript
const publicKey = client.getPublicKey();
```

---

##### `isInitialized()`

Check if client is initialized.

**Signature:**
```typescript
isInitialized(): boolean
```

**Returns:** `true` if initialized

**Example:**
```typescript
if (!client.isInitialized()) {
  await client.init();
}
```

---

## React Hooks

### useFHEVM

React hook for FHEVM client management.

**Signature:**
```typescript
function useFHEVM(options?: UseFHEVMOptions): UseFHEVMReturn
```

**Parameters:**
- `options.config`: FHEVMConfig (optional)
- `options.autoInit`: Auto-initialize on mount (default: true)

**Returns:**
```typescript
{
  client: FHEVMClient | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  init: () => Promise<void>;
  encrypt: (value: number, bits: number) => Promise<Uint8Array>;
  encryptNumber: (value: number, bits: number) => Promise<Uint8Array>;
  encryptBool: (value: boolean) => Promise<Uint8Array>;
  encryptAddress: (address: string) => Promise<Uint8Array>;
  decrypt: (ciphertext: string, contractAddress: string, userAddress: string) => Promise<bigint>;
  decryptPublic: (ciphertext: string) => Promise<bigint>;
  generatePermitSignature: (contractAddress: string, userAddress: string) => Promise<PermitSignature>;
}
```

**Example:**
```typescript
import { useFHEVM, NETWORKS } from '@fhevm/universal-sdk/react';

function MyComponent() {
  const {
    client,
    isInitialized,
    encryptNumber,
    error
  } = useFHEVM({
    config: { network: NETWORKS.SEPOLIA },
    autoInit: true
  });

  const handleEncrypt = async () => {
    if (!isInitialized) return;

    const encrypted = await encryptNumber(42, 8);
    // Use encrypted value...
  };

  if (error) return <div>Error: {error.message}</div>;
  if (!isInitialized) return <div>Initializing...</div>;

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

---

### useFHEVMContract

React hook for FHEVM-enabled contract interactions.

**Signature:**
```typescript
function useFHEVMContract(
  address: string,
  abi: any[],
  options?: UseFHEVMContractOptions
): UseFHEVMContractReturn
```

**Parameters:**
- `address`: Contract address
- `abi`: Contract ABI
- `options.config`: FHEVMConfig (optional)
- `options.signer`: Ethers signer (optional)

**Returns:**
```typescript
{
  contract: Contract | null;
  client: FHEVMClient | null;
  isReady: boolean;
  error: Error | null;
  callWithEncryption: (method: string, ...args: any[]) => Promise<any>;
  readWithDecryption: (method: string, ...args: any[]) => Promise<any>;
}
```

**Example:**
```typescript
import { useFHEVMContract } from '@fhevm/universal-sdk/react';

function VotingApp() {
  const {
    contract,
    isReady,
    callWithEncryption
  } = useFHEVMContract(
    '0x...',
    CONTRACT_ABI
  );

  const vote = async (choice: number) => {
    if (!isReady) return;

    await callWithEncryption('submitVote', choice);
  };

  return (
    <button onClick={() => vote(1)}>
      Vote Yes
    </button>
  );
}
```

---

## Utility Functions

### `formatEncrypted(encrypted)`

Format encrypted value for display.

**Signature:**
```typescript
function formatEncrypted(encrypted: Uint8Array): string
```

**Returns:** Hex string with "0x" prefix

---

### `validateAddress(address)`

Validate Ethereum address.

**Signature:**
```typescript
function validateAddress(address: string): boolean
```

**Returns:** `true` if valid

---

### `retry(fn, options)`

Retry a function with exponential backoff.

**Signature:**
```typescript
async function retry<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    delay?: number;
    backoff?: number;
  }
): Promise<T>
```

**Parameters:**
- `fn`: Async function to retry
- `options.maxRetries`: Max retry attempts (default: 3)
- `options.delay`: Initial delay in ms (default: 1000)
- `options.backoff`: Backoff multiplier (default: 2)

---

## Type Definitions

### FHEVMConfig

```typescript
interface FHEVMConfig {
  network?: NetworkConfig;
  provider?: ethers.providers.Provider;
  gatewayUrl?: string;
  aclAddress?: string;
}
```

### NetworkConfig

```typescript
interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  gatewayUrl: string;
  aclAddress: string;
}
```

### PermitSignature

```typescript
interface PermitSignature {
  signature: string;
  publicKey: string;
}
```

---

## Network Configurations

### NETWORKS.SEPOLIA

```typescript
{
  chainId: 11155111,
  name: 'Sepolia',
  rpcUrl: 'https://sepolia.infura.io/v3/...',
  gatewayUrl: 'https://gateway.sepolia.fhevm.io',
  aclAddress: '0x...'
}
```

### NETWORKS.ZAMA_DEVNET

```typescript
{
  chainId: 9000,
  name: 'Zama Devnet',
  rpcUrl: 'https://devnet.zama.ai',
  gatewayUrl: 'https://gateway.devnet.zama.ai',
  aclAddress: '0x...'
}
```

### NETWORKS.LOCAL

```typescript
{
  chainId: 31337,
  name: 'Local',
  rpcUrl: 'http://localhost:8545',
  gatewayUrl: 'http://localhost:8547',
  aclAddress: '0x...'
}
```

---

## Error Handling

All async methods can throw errors. Always use try-catch:

```typescript
try {
  const encrypted = await client.encryptNumber(42, 8);
  await contract.submitValue(encrypted);
} catch (error) {
  console.error('Encryption failed:', error);
  // Handle error...
}
```

---

## Best Practices

1. **Always initialize before use:**
   ```typescript
   await client.init();
   ```

2. **Use appropriate bit sizes:**
   - Small numbers (0-255): 8 bits
   - Medium numbers (0-65535): 16 bits
   - Large numbers: 32, 64, 128, or 256 bits

3. **Validate inputs:**
   ```typescript
   if (!validateAddress(address)) {
     throw new Error('Invalid address');
   }
   ```

4. **Handle errors gracefully:**
   ```typescript
   const { error } = useFHEVM();
   if (error) {
     // Show error to user
   }
   ```

5. **Use React hooks in components:**
   - Prefer `useFHEVM` over direct client usage
   - Leverage automatic state management

---

## Version Compatibility

- **SDK Version**: 1.0.0
- **fhevmjs**: ^0.6.0
- **ethers**: ^5.7.0
- **React**: ^18.0.0 (for React hooks)

---

## Support

- **GitHub Issues**: [Report bugs](https://github.com/your-repo/issues)
- **Documentation**: [Main README](../README.md)
- **Examples**: [Next.js Demo](../examples/nextjs-demo)

---

**Last Updated**: 2025-10-24
