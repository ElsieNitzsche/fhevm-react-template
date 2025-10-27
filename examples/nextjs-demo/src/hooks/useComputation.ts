import { useState, useCallback } from 'react';

type ComputationType = 'add' | 'subtract' | 'multiply' | 'compare';

interface ComputationResult {
  result: number | string;
  encrypted: boolean;
  operation: ComputationType;
}

interface UseComputationReturn {
  compute: (operation: ComputationType, operands: number[]) => Promise<ComputationResult>;
  isComputing: boolean;
  error: Error | null;
  lastResult: ComputationResult | null;
}

/**
 * Hook for homomorphic computation operations
 * Note: This is a simplified demo. In production, computations would happen on encrypted values
 */
export function useComputation(): UseComputationReturn {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<ComputationResult | null>(null);

  const compute = useCallback(
    async (operation: ComputationType, operands: number[]): Promise<ComputationResult> => {
      if (operands.length < 2) {
        throw new Error('At least two operands are required');
      }

      setIsComputing(true);
      setError(null);

      try {
        let result: number | string;

        switch (operation) {
          case 'add':
            result = operands.reduce((sum, val) => sum + val, 0);
            break;

          case 'subtract':
            result = operands.reduce((diff, val, index) => (index === 0 ? val : diff - val));
            break;

          case 'multiply':
            result = operands.reduce((product, val) => product * val, 1);
            break;

          case 'compare':
            const [first, second] = operands;
            result = first > second ? 'greater' : first < second ? 'less' : 'equal';
            break;

          default:
            throw new Error(`Unsupported operation: ${operation}`);
        }

        const computationResult: ComputationResult = {
          result,
          encrypted: true,
          operation,
        };

        setLastResult(computationResult);

        // Simulate computation time
        await new Promise((resolve) => setTimeout(resolve, 500));

        return computationResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsComputing(false);
      }
    },
    []
  );

  return {
    compute,
    isComputing,
    error,
    lastResult,
  };
}
