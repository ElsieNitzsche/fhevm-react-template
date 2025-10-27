import { useFHEContext } from '../components/fhe/FHEProvider';

/**
 * Custom hook for accessing FHE client functionality
 * This is a convenience wrapper around useFHEContext
 */
export function useFHE() {
  return useFHEContext();
}
