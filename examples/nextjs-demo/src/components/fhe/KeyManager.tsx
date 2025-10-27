'use client';

import React, { useState, useEffect } from 'react';
import { useFHEContext } from './FHEProvider';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { isValidAddress, formatError } from '@fhevm/universal-sdk';

export const KeyManager: React.FC = () => {
  const { client, isInitialized, generatePermit } = useFHEContext();
  const [publicKey, setPublicKey] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [permitSignature, setPermitSignature] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isInitialized && client) {
      try {
        const key = client.getPublicKey();
        setPublicKey(key);
      } catch (error) {
        console.error('Failed to get public key:', error);
      }
    }
  }, [isInitialized, client]);

  const handleGeneratePermit = async () => {
    // Use SDK validation utility
    if (!isValidAddress(contractAddress)) {
      alert('Please enter a valid contract address');
      return;
    }

    setIsGenerating(true);
    try {
      // This would require a signer in real implementation
      alert('Permit generation requires wallet connection. See full demo for implementation.');
    } catch (error: any) {
      // Use SDK error formatting
      alert(`Failed to generate permit: ${formatError(error)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card title="Key Manager" description="Manage encryption keys and permissions">
      <div className="space-y-4">
        {/* Public Key Display */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">Public Key</h3>
          {publicKey ? (
            <div className="bg-white p-3 rounded border border-purple-200">
              <p className="text-xs font-mono text-gray-600 break-all">
                {publicKey.slice(0, 50)}...{publicKey.slice(-50)}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Initializing...</p>
          )}
        </div>

        {/* Permit Generation */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">Generate Permit Signature</h3>
          <p className="text-sm text-blue-700 mb-3">
            Generate an EIP-712 signature to allow contracts to access encrypted data
          </p>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="Contract Address (0x...)"
            className="w-full px-4 py-2 border border-blue-300 rounded-lg mb-3"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleGeneratePermit}
            disabled={!isInitialized || !contractAddress}
            isLoading={isGenerating}
            className="w-full"
          >
            Generate Permit
          </Button>
        </div>

        {/* Key Information */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Key Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Key Type:</span>
              <span className="text-gray-900 font-medium">TFHE Public Key</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Status:</span>
              <span className={`font-medium ${isInitialized ? 'text-green-600' : 'text-yellow-600'}`}>
                {isInitialized ? 'Active' : 'Initializing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Usage:</span>
              <span className="text-gray-900 font-medium">Client-side Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
