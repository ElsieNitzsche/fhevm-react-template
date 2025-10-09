'use client';

import { useState, useEffect } from 'react';
import { useFHEVM, NETWORKS } from '@fhevm/universal-sdk/react';
import { BrowserProvider } from 'ethers';

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState<string>('');
  const [numberToEncrypt, setNumberToEncrypt] = useState<string>('42');
  const [encryptedValue, setEncryptedValue] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize FHEVM SDK
  const {
    client,
    isInitialized,
    isLoading: sdkLoading,
    error: sdkError,
    encryptNumber,
  } = useFHEVM({
    config: {
      network: NETWORKS.SEPOLIA,
    },
    autoInit: true,
  });

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setProvider(provider);
      setAddress(accounts[0]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Encrypt number
  const handleEncrypt = async () => {
    if (!isInitialized) {
      alert('FHEVM SDK is still initializing...');
      return;
    }

    try {
      const num = parseInt(numberToEncrypt);
      if (isNaN(num)) {
        alert('Please enter a valid number');
        return;
      }

      const encrypted = await encryptNumber(num, 8);
      setEncryptedValue(Array.from(encrypted).join(','));
      alert('Number encrypted successfully!');
    } catch (error: any) {
      console.error('Encryption failed:', error);
      alert(`Encryption failed: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            FHEVM Universal SDK Demo
          </h1>
          <p className="text-gray-600">
            Framework-agnostic SDK for confidential smart contracts
          </p>
        </div>

        {/* SDK Status */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">SDK Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Initialization:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isInitialized
                    ? 'bg-green-100 text-green-800'
                    : sdkLoading
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isInitialized ? '✅ Ready' : sdkLoading ? '⏳ Loading...' : '❌ Not Ready'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Network:</span>
              <span className="text-gray-600">Sepolia Testnet</span>
            </div>
            {sdkError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  <strong>Error:</strong> {sdkError.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Wallet Connection</h2>
          {address ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  ✅ Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Address:</span>
                <span className="text-gray-600 font-mono text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          )}
        </div>

        {/* Encryption Demo */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Encryption Demo</h2>
          <p className="text-gray-600 mb-6">
            Encrypt a number using FHE. The encrypted value can be used in smart contracts while
            keeping the data private.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Number to Encrypt (0-255):
              </label>
              <input
                type="number"
                value={numberToEncrypt}
                onChange={(e) => setNumberToEncrypt(e.target.value)}
                min="0"
                max="255"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter a number"
              />
            </div>

            <button
              onClick={handleEncrypt}
              disabled={!isInitialized || sdkLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isInitialized ? 'Waiting for SDK...' : 'Encrypt Number'}
            </button>

            {encryptedValue && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-700 font-medium mb-2">Encrypted Value (bytes):</p>
                <p className="text-gray-600 font-mono text-xs break-all">{encryptedValue}</p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">SDK Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">🔐 Encryption</h3>
              <p className="text-purple-700 text-sm">
                Encrypt numbers, booleans, and addresses using FHE
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🔓 Decryption</h3>
              <p className="text-blue-700 text-sm">
                User decrypt with EIP-712 signatures
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">⚡ Fast Setup</h3>
              <p className="text-green-700 text-sm">
                Less than 10 lines of code to get started
              </p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-2">🎯 Framework Agnostic</h3>
              <p className="text-indigo-700 text-sm">
                Works with React, Vue, and vanilla JS
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white">
          <p className="text-sm opacity-90">
            Built with ❤️ using FHEVM Universal SDK
          </p>
          <p className="text-xs opacity-75 mt-2">
            <a
              href="https://docs.zama.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Learn more about FHEVM
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
