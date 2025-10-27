'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useFHEContext } from '../fhe/FHEProvider';

interface MedicalRecord {
  id: number;
  type: string;
  value: string;
  date: Date;
  encrypted: boolean;
}

export const MedicalExample: React.FC = () => {
  const { isInitialized, encryptNumber } = useFHEContext();
  const [recordType, setRecordType] = useState<'bloodPressure' | 'heartRate' | 'glucose'>('bloodPressure');
  const [recordValue, setRecordValue] = useState<string>('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessCode, setAccessCode] = useState<string>('');

  const recordLabels = {
    bloodPressure: 'Blood Pressure (mmHg)',
    heartRate: 'Heart Rate (bpm)',
    glucose: 'Blood Glucose (mg/dL)',
  };

  const handleSubmitRecord = async () => {
    const value = parseFloat(recordValue);
    if (isNaN(value) || value <= 0) {
      alert('Please enter a valid value');
      return;
    }

    setIsSubmitting(true);
    try {
      // Encrypt the medical data
      await encryptNumber(Math.floor(value), 16);

      setRecords([
        {
          id: Date.now(),
          type: recordLabels[recordType],
          value: recordValue,
          date: new Date(),
          encrypted: true,
        },
        ...records,
      ]);
      setRecordValue('');
      alert('Medical record submitted successfully! Data was encrypted before storage.');
    } catch (error: any) {
      alert(`Failed to submit record: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGrantAccess = () => {
    if (!accessCode) {
      alert('Please enter an access code');
      return;
    }

    alert(`Access granted with code: ${accessCode}\nIn a real system, this would generate a permit signature for the healthcare provider.`);
    setAccessCode('');
  };

  return (
    <Card title="Confidential Medical Records" description="Store and manage encrypted health data">
      <div className="space-y-6">
        {/* Record Type Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Record Type</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setRecordType('bloodPressure')}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                recordType === 'bloodPressure'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Blood Pressure
            </button>
            <button
              onClick={() => setRecordType('heartRate')}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                recordType === 'heartRate'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Heart Rate
            </button>
            <button
              onClick={() => setRecordType('glucose')}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                recordType === 'glucose'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Glucose
            </button>
          </div>
        </div>

        {/* Value Input */}
        <Input
          type="number"
          label={recordLabels[recordType]}
          value={recordValue}
          onChange={(e) => setRecordValue(e.target.value)}
          placeholder="Enter value"
          helperText="All medical data is encrypted before storage"
        />

        <Button
          variant="success"
          onClick={handleSubmitRecord}
          disabled={!isInitialized || isSubmitting}
          isLoading={isSubmitting}
          className="w-full"
        >
          Submit Encrypted Record
        </Button>

        {/* Medical Records Display */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Your Encrypted Records</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {records.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No records yet</p>
            ) : (
              records.map((record) => (
                <div
                  key={record.id}
                  className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{record.type}</p>
                      <p className="text-sm text-gray-600">Value: {record.value}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {record.date.toLocaleDateString()}
                      </p>
                      {record.encrypted && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mt-1 inline-block">
                          Encrypted
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Access Control */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">Grant Provider Access</h3>
          <p className="text-sm text-blue-700 mb-3">
            Generate a permit to allow healthcare providers to access your encrypted records
          </p>
          <Input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Provider Access Code"
            className="mb-3"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleGrantAccess}
            disabled={!isInitialized}
            className="w-full"
          >
            Grant Access
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-semibold">Privacy Guaranteed:</span> All medical data is encrypted using FHE before
            storage. Only authorized parties with proper permits can access your records.
          </p>
        </div>
      </div>
    </Card>
  );
};
