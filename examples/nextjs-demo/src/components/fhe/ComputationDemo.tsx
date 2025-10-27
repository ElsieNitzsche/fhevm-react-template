'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ComputationDemo: React.FC = () => {
  const [value1, setValue1] = useState<string>('10');
  const [value2, setValue2] = useState<string>('20');
  const [operation, setOperation] = useState<'add' | 'multiply' | 'compare'>('add');
  const [result, setResult] = useState<string>('');

  const handleCompute = () => {
    const num1 = parseInt(value1);
    const num2 = parseInt(value2);

    if (isNaN(num1) || isNaN(num2)) {
      alert('Please enter valid numbers');
      return;
    }

    let computedResult: number | string;
    switch (operation) {
      case 'add':
        computedResult = num1 + num2;
        setResult(`Encrypted result: ${computedResult} (computation performed on encrypted data)`);
        break;
      case 'multiply':
        computedResult = num1 * num2;
        setResult(`Encrypted result: ${computedResult} (computation performed on encrypted data)`);
        break;
      case 'compare':
        computedResult = num1 > num2 ? 'First value is greater' : 'Second value is greater or equal';
        setResult(`Encrypted comparison: ${computedResult}`);
        break;
    }
  };

  return (
    <Card title="Homomorphic Computation Demo" description="Perform computations on encrypted data">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="First Value"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder="Enter first number"
          />
          <Input
            type="number"
            label="Second Value"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder="Enter second number"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Operation</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setOperation('add')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                operation === 'add'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Add
            </button>
            <button
              onClick={() => setOperation('multiply')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                operation === 'multiply'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Multiply
            </button>
            <button
              onClick={() => setOperation('compare')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                operation === 'compare'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Compare
            </button>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleCompute}
          className="w-full"
        >
          Compute on Encrypted Data
        </Button>

        {result && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-indigo-900 font-medium mb-2">Computation Result:</p>
            <p className="text-indigo-700">{result}</p>
            <p className="text-indigo-600 text-sm mt-2">
              Note: In a real scenario, this computation would happen on encrypted values without decryption
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
