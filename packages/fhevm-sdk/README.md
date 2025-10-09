# FHEVM Universal SDK

A framework-agnostic SDK for building confidential smart contract frontends with Fully Homomorphic Encryption (FHE).

## Features

✨ **Framework Agnostic** - Works with any frontend framework (React, Vue, Vanilla JS, Node.js)
🔐 **Full FHE Support** - Complete encryption and decryption workflows
🎣 **React Hooks** - Optional React adapters for seamless integration
📦 **Zero Config** - Get started with less than 10 lines of code
🛠️ **Type Safe** - Full TypeScript support
🚀 **Production Ready** - Built on official Zama FHEVM libraries

## Installation

```bash
npm install @fhevm/universal-sdk
```

## Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { createFHEVMClient, NETWORKS } from '@fhevm/universal-sdk';

// Create client
const client = createFHEVMClient({
  network: NETWORKS.SEPOLIA
});

// Initialize
await client.init();

// Encrypt a number
const encrypted = await client.encryptNumber(42, 8);

// Use in contract call
const tx = await contract.setEncryptedValue(encrypted);
```

### React

```tsx
import { useFHEVM, useFHEVMContract, NETWORKS } from '@fhevm/universal-sdk/react';

function MyComponent() {
  // Initialize FHEVM
  const { client, isInitialized, encryptNumber } = useFHEVM({
    config: { network: NETWORKS.SEPOLIA }
  });

  // Connect to contract
  const { send, sendEncrypted } = useFHEVMContract({
    address: '0x...',
    abi: [...],
    signer,
    fhevmClient: client
  });

  const handleEncryptedSubmit = async () => {
    // Create encrypted input
    const input = client.createEncryptedInput(contractAddress, signer);
    input.add8(42);

    // Send encrypted transaction
    await sendEncrypted('submitVote', input);
  };

  return (
    <button onClick={handleEncryptedSubmit}>
      Submit Encrypted Vote
    </button>
  );
}
```

## Core API

### FHEVMClient

Main client class for encryption/decryption operations.

#### Methods

- `init()` - Initialize the client (required before use)
- `encryptNumber(value, bits)` - Encrypt a number (8, 16, 32, or 64 bits)
- `encryptBoolean(value)` - Encrypt a boolean
- `encryptAddress(address)` - Encrypt an Ethereum address
- `createEncryptedInput(contractAddress, signer)` - Create encrypted input builder
- `userDecrypt(handle, contractAddress, signer)` - Decrypt with EIP-712 signature
- `generatePermitSignature(contractAddress, signer)` - Generate permit for contract access

### Utility Functions

- `createFHEVMContract(address, abi, signer, client)` - Create contract with FHE support
- `formatHandle(handle)` - Format encrypted handle for display
- `isEncrypted(value)` - Check if value is encrypted
- `truncateAddress(address)` - Truncate address for UI display
- `retry(fn, maxAttempts)` - Retry helper for network operations

## React Hooks

### useFHEVM

Main hook for FHEVM client management.

```tsx
const {
  client,           // FHEVMClient instance
  isInitialized,    // Initialization status
  isLoading,        // Loading state
  error,            // Error state
  init,             // Manual init function
  encryptNumber,    // Encrypt number helper
  encryptBoolean,   // Encrypt boolean helper
  encryptAddress,   // Encrypt address helper
  userDecrypt,      // User decrypt helper
  generatePermit    // Generate permit helper
} = useFHEVM({ config, autoInit: true });
```

### useFHEVMContract

Hook for contract interactions with FHE.

```tsx
const {
  contract,         // Contract instance
  call,             // Call view functions
  send,             // Send transactions
  sendEncrypted,    // Send with encrypted inputs
  isLoading,        // Loading state
  error             // Error state
} = useFHEVMContract({
  address,
  abi,
  signer,
  fhevmClient
});
```

## Network Configurations

Pre-configured networks:

```typescript
import { NETWORKS } from '@fhevm/universal-sdk';

NETWORKS.SEPOLIA      // Sepolia Testnet
NETWORKS.ZAMA_DEVNET  // Zama Devnet
NETWORKS.LOCAL        // Local Hardhat
```

## Examples

### Encrypting Contract Inputs

```typescript
// Create encrypted input
const input = client.createEncryptedInput(contractAddress, signer);

// Add encrypted values
input.add8(42);           // uint8
input.add16(1000);        // uint16
input.add32(100000);      // uint32
input.addBool(true);      // bool
input.addAddress('0x...'); // address

// Get encrypted data
const { handles, inputProof } = input.encrypt();

// Send to contract
await contract.submitEncryptedData(...handles, inputProof);
```

### Decrypting Values

```typescript
// User decrypt (with EIP-712 signature)
const decrypted = await client.userDecrypt(
  handle,
  contractAddress,
  signer
);

// Public decrypt (via gateway)
const results = await client.publicDecrypt(
  [handle1, handle2],
  contractAddress
);
```

### Error Handling

```typescript
import { formatError, retry } from '@fhevm/universal-sdk';

try {
  await retry(async () => {
    const tx = await contract.someFunction();
    return await tx.wait();
  }, 3);
} catch (error) {
  console.error(formatError(error));
}
```

## TypeScript Support

Full TypeScript support with type definitions included:

```typescript
import type {
  FHEVMClient,
  FHEVMConfig,
  EncryptedInput,
  Signer,
  Contract
} from '@fhevm/universal-sdk';
```

## Advanced Usage

### Custom Network Configuration

```typescript
const client = createFHEVMClient({
  network: {
    chainId: 12345,
    rpcUrl: 'https://custom-rpc.example.com',
    gatewayUrl: 'https://gateway.example.com',
    aclAddress: '0x...'
  }
});
```

### Manual Initialization Control

```tsx
const { client, init } = useFHEVM({
  config: { network: NETWORKS.SEPOLIA },
  autoInit: false  // Don't auto-initialize
});

// Initialize manually when needed
await init();
```

## License

MIT

## Links

- [GitHub Repository](https://github.com/your-repo/fhevm-universal-sdk)
- [Zama Documentation](https://docs.zama.ai)
- [FHEVM Specification](https://github.com/zama-ai/fhevm)
