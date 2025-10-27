'use client';

import React, { useState } from 'react';
import { useFHEContext } from './FHEProvider';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { isValidAddress, formatError } from '@fhevm/universal-sdk';

export const EncryptionDemo: React.FC = () => {
  const { isInitialized, encryptNumber, encryptBoolean, encryptAddress } = useFHEContext();
  const [numberValue, setNumberValue] = useState<string>('42');
  const [boolValue, setBoolValue] = useState<boolean>(true);
  const [addressValue, setAddressValue] = useState<string>('');
  const [encryptedResult, setEncryptedResult] = useState<string>('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleEncryptNumber = async () => {
    setIsEncrypting(true);
    try {
      const num = parseInt(numberValue);
      if (isNaN(num) || num < 0 || num > 255) {
        alert('Please enter a valid number (0-255)');
        return;
      }
      const encrypted = await encryptNumber(num, 8);
      setEncryptedResult(`Number encrypted: ${Array.from(encrypted).slice(0, 10).join(', ')}...`);
    } catch (error: any) {
      // Use SDK error formatting
      alert(`Encryption failed: ${formatError(error)}`);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleEncryptBoolean = async () => {
    setIsEncrypting(true);
    try {
      const encrypted = await encryptBoolean(boolValue);
      setEncryptedResult(`Boolean encrypted: ${Array.from(encrypted).slice(0, 10).join(', ')}...`);
    } catch (error: any) {
      // Use SDK error formatting
      alert(`Encryption failed: ${formatError(error)}`);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleEncryptAddress = async () => {
    setIsEncrypting(true);
    try {
      // Use SDK validation utility
      if (!isValidAddress(addressValue)) {
        alert('Please enter a valid Ethereum address');
        return;
      }
      const encrypted = await encryptAddress(addressValue);
      setEncryptedResult(`Address encrypted: ${Array.from(encrypted).slice(0, 10).join(', ')}...`);
    } catch (error: any) {
      // Use SDK error formatting
      alert(`Encryption failed: ${formatError(error)}`);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <Card title="Encryption Demo" description="Encrypt different data types using FHE">
      <div className="space-y-6">
        {/* Number Encryption */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-3">Encrypt Number (uint8)</h3>
          <Input
            type="number"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            min="0"
            max="255"
            placeholder="Enter number (0-255)"
            className="mb-3"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleEncryptNumber}
            disabled={!isInitialized}
            isLoading={isEncrypting}
            className="w-full"
          >
            Encrypt Number
          </Button>
        </div>

        {/* Boolean Encryption */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">Encrypt Boolean</h3>
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={boolValue === true}
                onChange={() => setBoolValue(true)}
                className="w-4 h-4"
              />
              <span>True</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={boolValue === false}
                onChange={() => setBoolValue(false)}
                className="w-4 h-4"
              />
              <span>False</span>
            </label>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleEncryptBoolean}
            disabled={!isInitialized}
            isLoading={isEncrypting}
            className="w-full"
          >
            Encrypt Boolean
          </Button>
        </div>

        {/* Address Encryption */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-3">Encrypt Address</h3>
          <Input
            type="text"
            value={addressValue}
            onChange={(e) => setAddressValue(e.target.value)}
            placeholder="0x..."
            className="mb-3"
          />
          <Button
            variant="success"
            size="sm"
            onClick={handleEncryptAddress}
            disabled={!isInitialized}
            isLoading={isEncrypting}
            className="w-full"
          >
            Encrypt Address
          </Button>
        </div>

        {/* Result Display */}
        {encryptedResult && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-700 font-medium mb-2">Result:</p>
            <p className="text-gray-600 font-mono text-xs break-all">{encryptedResult}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
