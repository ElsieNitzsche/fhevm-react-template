# Anonymous Property Voting dApp

A real-world example demonstrating the FHEVM Universal SDK in a property management voting system.

## Features

🔐 **Anonymous Voting** - Using FHE encryption
🏘️ **Resident Registration** - Encrypted unit numbers
📊 **Proposal Management** - Create and manage community proposals
🗳️ **Secret Ballots** - Votes remain encrypted until tallying
✨ **Privacy Preserving** - Only final results are revealed

## Architecture

This example demonstrates:
- **Frontend**: Vanilla HTML/CSS/JavaScript with ethers.js
- **SDK Integration**: Uses `@fhevm/universal-sdk` for all FHE operations
- **Smart Contract**: `AnonymousPropertyVoting.sol` with FHE primitives
- **Network**: Deployed on Sepolia Testnet

## Quick Start

```bash
# From project root
npm run dev:voting

# Or from this directory
npm install
npm run dev
```

Visit: http://localhost:3001

## How It Uses the SDK

### 1. Client Initialization

```javascript
import { createFHEVMClient, NETWORKS } from '@fhevm/universal-sdk';

const client = createFHEVMClient({
  network: NETWORKS.SEPOLIA
});
await client.init();
```

### 2. Encrypting Resident Registration

```javascript
// Encrypt unit number
const encryptedUnit = await client.encryptNumber(unitNumber, 8);

// Register with contract
await contract.registerResident(encryptedUnit);
```

### 3. Submitting Encrypted Votes

```javascript
// Create encrypted input
const input = client.createEncryptedInput(contractAddress, signer);
input.add8(voteChoice); // 0 = No, 1 = Yes

// Generate proof and submit
const { handles, inputProof } = input.encrypt();
await contract.submitVote(proposalId, ...handles, inputProof);
```

### 4. Decrypting Results

```javascript
// User decrypt with EIP-712 signature
const result = await client.userDecrypt(
  resultHandle,
  contractAddress,
  signer
);
```

## Contract Features

- **Encrypted Resident Data**: Unit numbers stored encrypted
- **Anonymous Voting**: Votes are FHE-encrypted
- **Decryption Gateway**: Results decrypted via KMS
- **Access Control**: Only manager can create proposals

## File Structure

```
property-voting/
├── public/
│   ├── index.html        # Main UI
│   └── config.js         # Contract configuration
├── package.json
└── README.md
```

## SDK Methods Used

| SDK Method | Usage |
|------------|-------|
| `createFHEVMClient()` | Initialize FHE client |
| `client.init()` | Setup encryption instance |
| `client.encryptNumber()` | Encrypt unit numbers |
| `client.createEncryptedInput()` | Build encrypted vote data |
| `client.userDecrypt()` | Decrypt results with signature |
| `client.generatePermitSignature()` | Grant contract permissions |

## Contract Address

**Sepolia**: `0xD30412C56d2E50dE333512Bd91664d98475E8eFf`

View on Etherscan: https://sepolia.etherscan.io/address/0xD30412C56d2E50dE333512Bd91664d98475E8eFf

## User Flow

1. **Connect Wallet** → MetaMask connection
2. **Register as Resident** → Submit encrypted unit number
3. **View Proposal** → See active community proposals
4. **Cast Vote** → Submit encrypted YES/NO vote
5. **Wait for Results** → Admin ends proposal and decrypts votes
6. **View Results** → See final tally (approved/rejected)

## Testing

1. Connect with MetaMask to Sepolia
2. Register as a resident (unit 1-200)
3. Wait for an active proposal or create one (if manager)
4. Submit your encrypted vote
5. Check results after proposal ends

## Privacy Guarantees

- ✅ Individual votes never revealed
- ✅ Unit numbers kept encrypted
- ✅ Only final tallies are decrypted
- ✅ On-chain privacy via FHE

## Learn More

- [FHEVM Universal SDK](../../packages/fhevm-sdk/README.md)
- [Main Project README](../../README.md)
- [Smart Contract](../../contracts/AnonymousPropertyVoting.sol)

## License

MIT
