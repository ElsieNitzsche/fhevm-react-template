/**
 * Central export point for all types
 */

export * from './fhe';
export * from './api';

/**
 * Window type extension for Ethereum provider
 */
declare global {
  interface Window {
    ethereum?: any;
  }
}
