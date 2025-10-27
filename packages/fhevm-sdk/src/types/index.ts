export interface FHEVMConfig {
  network: {
    chainId: number;
    rpcUrl: string;
    gatewayUrl?: string;
    aclAddress?: string;
  };
  provider?: any;
}

export interface EncryptedInput {
  handles: Uint8Array[];
  inputProof: string;
}

export interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  gatewayUrl?: string;
  aclAddress?: string;
  name: string;
}

export type EncryptionBits = 8 | 16 | 32 | 64;

export interface EncryptionResult {
  data: Uint8Array;
  handle?: bigint;
}

export interface DecryptionResult {
  value: bigint;
  success: boolean;
  error?: string;
}
