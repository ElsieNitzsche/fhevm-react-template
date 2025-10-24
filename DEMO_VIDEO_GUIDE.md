# Demo Video Guide (demo.mp4)

This guide outlines what should be included in the hackathon submission video.

## Video Requirements

- **Duration**: 3-5 minutes
- **Format**: MP4
- **Resolution**: 1080p minimum
- **Audio**: Clear narration (English)

## Video Structure

### 1. Introduction (30 seconds)
- **Show**: Title screen "FHEVM Universal SDK"
- **Say**:
  - "Welcome to the FHEVM Universal SDK demonstration"
  - "A framework-agnostic SDK for building confidential smart contracts"
  - "Let me show you how easy it is to get started"

### 2. Quick Setup (<10 lines) (1 minute)
- **Show**: Terminal/code editor
- **Demonstrate**:
```bash
# Installation
npm install @fhevm/universal-sdk

# Usage (show in editor)
import { createFHEVMClient, NETWORKS } from '@fhevm/universal-sdk';

const client = createFHEVMClient({ network: NETWORKS.SEPOLIA });
await client.init();

const encrypted = await client.encryptNumber(42, 8);
await contract.submitValue(encrypted);
```

- **Say**:
  - "Installation is just one line"
  - "Getting started requires less than 10 lines of code"
  - "The SDK handles all the complexity for you"

### 3. Next.js Integration (1 minute)
- **Show**: Browser with Next.js demo running
- **Demonstrate**:
  - Open http://localhost:3000
  - Show SDK status (initialized)
  - Connect MetaMask wallet
  - Enter a number to encrypt
  - Click "Encrypt Number"
  - Show encrypted output

- **Say**:
  - "Here's our Next.js demo running"
  - "The SDK automatically initializes"
  - "Using React hooks makes integration seamless"
  - "Notice how the SDK provides real-time status"

### 4. React Hooks API (1 minute)
- **Show**: Code editor with hooks example
- **Demonstrate**:
```tsx
const { client, isInitialized, encryptNumber } = useFHEVM({
  config: { network: NETWORKS.SEPOLIA }
});

const handleEncrypt = async () => {
  const encrypted = await encryptNumber(42, 8);
};
```

- **Say**:
  - "The React hooks are familiar to web3 developers"
  - "Similar to wagmi's API structure"
  - "Automatic initialization and state management"
  - "Error handling built-in"

### 5. Property Voting Example (1 minute)
- **Show**: Browser with property-voting demo
- **Demonstrate**:
  - Open http://localhost:3001
  - Connect wallet
  - Register as resident (encrypted unit number)
  - Show active proposal
  - Submit encrypted vote
  - Show vote confirmation

- **Say**:
  - "This is a real-world use case"
  - "Anonymous property management voting"
  - "All sensitive data is encrypted with FHE"
  - "Unit numbers and votes remain private"

### 6. Framework Agnostic (30 seconds)
- **Show**: Code comparison slide
- **Demonstrate**:
```typescript
// Works with vanilla JS
const client = createFHEVMClient(config);

// Works with React
const { client } = useFHEVM({ config });

// Works with Vue
const client = useFhevmClient(config);
```

- **Say**:
  - "The core SDK is framework-agnostic"
  - "Optional adapters for React and Vue"
  - "Use it in any JavaScript environment"

### 7. Design Choices (1 minute)
- **Show**: Architecture diagram or slides
- **Explain**:
  - **Modular Design**: Core + Adapters
  - **Zero Config**: Sensible defaults
  - **Type Safe**: Full TypeScript support
  - **Developer First**: Easy to use, hard to misuse

- **Say**:
  - "We designed the SDK to be modular"
  - "The core is framework-agnostic"
  - "Adapters provide framework-specific conveniences"
  - "Everything is type-safe with TypeScript"

### 8. Key Features (30 seconds)
- **Show**: Feature list with animations
- **Highlight**:
  - ✅ Framework Agnostic
  - ✅ <10 Lines to Start
  - ✅ Wagmi-like API
  - ✅ Complete FHE Workflows
  - ✅ Production Ready

### 9. Live Deployment (30 seconds)
- **Show**: Browser with deployed demos
- **Demonstrate**:
  - Open Vercel deployment
  - Quick interaction
  - Show it working in production

- **Say**:
  - "Both examples are deployed and live"
  - "You can try them yourself"
  - "Links are in the README"

### 10. Closing (30 seconds)
- **Show**: Thank you slide with links
- **Say**:
  - "Thank you for watching"
  - "Check out the GitHub repository"
  - "Try the SDK in your next project"
  - "We're excited to see what you build"

## Recording Tips

### Setup
1. **Clean Desktop**: Remove distractions
2. **Browser**: Use incognito mode (clean state)
3. **Terminal**: Use clear, readable theme
4. **Code Editor**: Large font size (16-18pt)

### During Recording
1. **Pace**: Speak slowly and clearly
2. **Cursor**: Use zoom/highlight for code
3. **Transitions**: Smooth between sections
4. **Errors**: Edit out mistakes

### Technical Setup
1. **Screen Recording**: Use OBS Studio or similar
2. **Microphone**: Use good quality mic
3. **Resolution**: Record at 1080p minimum
4. **Frame Rate**: 30fps or 60fps

## Script Outline

```
[0:00-0:30] Introduction
[0:30-1:30] Quick Setup Demo
[1:30-2:30] Next.js Integration
[2:30-3:00] React Hooks API
[3:00-4:00] Property Voting Example
[4:00-4:30] Framework Agnostic
[4:30-5:30] Design Choices
[5:30-6:00] Key Features
[6:00-6:30] Live Deployment
[6:30-7:00] Closing
```

## Post-Production

1. **Edit**: Remove dead air and mistakes
2. **Music**: Add subtle background music (optional)
3. **Captions**: Add subtitles for accessibility
4. **Export**: MP4, H.264 codec, 1080p

## Checklist Before Recording

- [ ] All demos working locally
- [ ] Next.js app running on port 3000
- [ ] Property voting running on port 3001
- [ ] MetaMask installed and configured
- [ ] Test accounts have Sepolia ETH
- [ ] Code examples prepared and tested
- [ ] Screen recording software tested
- [ ] Microphone working properly
- [ ] Script reviewed and practiced

## Example Opening Script

> "Hello! I'm excited to show you the FHEVM Universal SDK - a framework-agnostic solution for building confidential smart contract frontends.
>
> Unlike existing templates that are tied to specific frameworks, our SDK works everywhere. Whether you're using React, Vue, or just vanilla JavaScript, the same core SDK powers your FHE encryption needs.
>
> And the best part? You can get started in less than 10 lines of code. Let me show you..."

## Example Closing Script

> "As you've seen, the FHEVM Universal SDK makes it incredibly easy to add FHE encryption to any web application. With support for multiple frameworks, comprehensive documentation, and real-world examples, we believe this represents the future of confidential smart contract development.
>
> All the code is open source and available on GitHub. Both demos are deployed and live for you to try. We can't wait to see what you build with it.
>
> Thank you for watching, and happy coding!"

---

**File Name**: `demo.mp4`
**Location**: Root of project directory
**Max Size**: <100MB (optimize if needed)
