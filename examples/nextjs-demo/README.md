# FHEVM Universal SDK - Next.js Demo

A Next.js application demonstrating the FHEVM Universal SDK integration.

## Features

✨ **SDK Integration** - Shows how to use `@fhevm/universal-sdk` in Next.js
🎣 **React Hooks** - Demonstrates `useFHEVM` hook
🔐 **Encryption Demo** - Interactive FHE encryption
💼 **Wallet Connection** - MetaMask integration
🎨 **Modern UI** - Built with Tailwind CSS

## Quick Start

```bash
# From project root
npm run dev:nextjs

# Or from this directory
npm install
npm run dev
```

Visit: http://localhost:3000

## SDK Integration

### 1. Install the SDK

```bash
npm install @fhevm/universal-sdk
```

### 2. Use in Your Component

```tsx
import { useFHEVM, NETWORKS } from '@fhevm/universal-sdk/react';

function MyComponent() {
  const { client, isInitialized, encryptNumber } = useFHEVM({
    config: {
      network: NETWORKS.SEPOLIA
    }
  });

  const handleEncrypt = async () => {
    const encrypted = await encryptNumber(42, 8);
    // Use encrypted value...
  };

  return (
    <button onClick={handleEncrypt} disabled={!isInitialized}>
      Encrypt
    </button>
  );
}
```

## What This Demo Shows

### 1. SDK Initialization
- Automatic initialization with `autoInit: true`
- Status tracking (loading, initialized, error)
- Network configuration

### 2. Wallet Connection
- MetaMask integration
- Provider setup with ethers.js
- Address display

### 3. Encryption
- Number encryption (uint8)
- Real-time encryption demo
- Display encrypted bytes

### 4. Error Handling
- SDK initialization errors
- Encryption failures
- User-friendly error messages

## Code Structure

```
nextjs-demo/
├── src/
│   └── app/
│       ├── layout.tsx       # Root layout
│       ├── page.tsx         # Main demo page
│       └── globals.css      # Global styles
├── next.config.js           # Next.js config
├── tailwind.config.js       # Tailwind config
├── postcss.config.js        # PostCSS config
└── package.json
```

## Key Components

### Main Page (`page.tsx`)

Demonstrates:
- **useFHEVM Hook** - SDK initialization and management
- **Wallet Connection** - BrowserProvider setup
- **Encryption UI** - Interactive number encryption
- **Status Display** - Real-time SDK status
- **Feature Cards** - SDK capabilities overview

## SDK Features Demonstrated

| Feature | Implementation |
|---------|----------------|
| Initialization | `useFHEVM({ config, autoInit: true })` |
| Encryption | `encryptNumber(value, bits)` |
| Status Tracking | `isInitialized`, `isLoading`, `error` |
| Network Config | `NETWORKS.SEPOLIA` |

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

No environment variables required for the demo! The SDK uses public Sepolia RPC.

## Browser Support

- ✅ Chrome/Brave (recommended)
- ✅ Firefox
- ✅ Edge
- ⚠️ Safari (may have issues with MetaMask)

## Troubleshooting

### "FHEVM SDK is still initializing..."
- Wait a few seconds for initialization to complete
- Check browser console for errors
- Ensure you have a stable internet connection

### Wallet connection fails
- Install MetaMask extension
- Ensure MetaMask is unlocked
- Check if connected to Sepolia network

### Encryption fails
- Verify SDK is initialized (`isInitialized === true`)
- Check number is within valid range (0-255 for uint8)
- Look for error messages in browser console

## Learn More

- [FHEVM Universal SDK](../../packages/fhevm-sdk/README.md)
- [Main Project README](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM](https://docs.zama.ai)

## License

MIT
