'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useFHEContext } from '../fhe/FHEProvider';
import { isValidAddress, truncateAddress, formatError } from '@fhevm/universal-sdk';

interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: string;
  timestamp: Date;
  encrypted: boolean;
}

export const BankingExample: React.FC = () => {
  const { isInitialized, encryptNumber } = useFHEContext();
  const [balance, setBalance] = useState<number>(1000);
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    try {
      // Encrypt the amount
      await encryptNumber(Math.floor(depositAmount), 32);

      // Simulate transaction
      setBalance(balance + depositAmount);
      setTransactions([
        {
          id: Date.now(),
          type: 'deposit',
          amount: amount,
          timestamp: new Date(),
          encrypted: true,
        },
        ...transactions,
      ]);
      setAmount('');
      alert('Deposit successful! Amount was encrypted before processing.');
    } catch (error: any) {
      // Use SDK error formatting
      alert(`Deposit failed: ${formatError(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawal = async () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (withdrawAmount > balance) {
      alert('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    try {
      // Encrypt the amount
      await encryptNumber(Math.floor(withdrawAmount), 32);

      setBalance(balance - withdrawAmount);
      setTransactions([
        {
          id: Date.now(),
          type: 'withdrawal',
          amount: amount,
          timestamp: new Date(),
          encrypted: true,
        },
        ...transactions,
      ]);
      setAmount('');
      alert('Withdrawal successful! Amount was encrypted before processing.');
    } catch (error: any) {
      // Use SDK error formatting
      alert(`Withdrawal failed: ${formatError(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransfer = async () => {
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Use SDK validation utility
    if (!isValidAddress(recipient)) {
      alert('Please enter a valid recipient address');
      return;
    }

    if (transferAmount > balance) {
      alert('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    try {
      // Encrypt both amount and recipient
      await encryptNumber(Math.floor(transferAmount), 32);

      setBalance(balance - transferAmount);
      setTransactions([
        {
          id: Date.now(),
          type: 'transfer',
          // Use SDK truncate utility
          amount: `${amount} to ${truncateAddress(recipient)}`,
          timestamp: new Date(),
          encrypted: true,
        },
        ...transactions,
      ]);
      setAmount('');
      setRecipient('');
      alert('Transfer successful! Amount and recipient were encrypted.');
    } catch (error: any) {
      // Use SDK error formatting
      alert(`Transfer failed: ${formatError(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card title="Confidential Banking" description="Banking operations with encrypted balances and transactions">
      <div className="space-y-6">
        {/* Balance Display */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white">
          <p className="text-sm opacity-90 mb-1">Current Balance</p>
          <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
          <p className="text-xs opacity-75 mt-2">Encrypted on-chain</p>
        </div>

        {/* Transaction Input */}
        <div className="space-y-4">
          <Input
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            helperText="Amount will be encrypted before transaction"
          />

          <Input
            type="text"
            label="Recipient Address (for transfers)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            helperText="Optional: Only needed for transfers"
          />

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="success"
              size="sm"
              onClick={handleDeposit}
              disabled={!isInitialized || isProcessing}
              isLoading={isProcessing}
            >
              Deposit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleWithdrawal}
              disabled={!isInitialized || isProcessing}
              isLoading={isProcessing}
            >
              Withdraw
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleTransfer}
              disabled={!isInitialized || isProcessing}
              isLoading={isProcessing}
            >
              Transfer
            </Button>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Recent Transactions</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No transactions yet</p>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800 capitalize">{tx.type}</p>
                    <p className="text-sm text-gray-600">{tx.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {tx.timestamp.toLocaleTimeString()}
                    </p>
                    {tx.encrypted && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        Encrypted
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
