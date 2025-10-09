import { createInstance, FhevmInstance, initFhevm } from 'fhevmjs';
import { BrowserProvider, JsonRpcProvider, Signer } from 'ethers';

export interface FHEVMConfig {
  network: {
    chainId: number;
    rpcUrl: string;
    gatewayUrl?: string;
    aclAddress?: string;
  };
  provider?: BrowserProvider | JsonRpcProvider;
}

export interface EncryptedInput {
  handles: Uint8Array[];
  inputProof: string;
}

export class FHEVMClient {
  private instance: FhevmInstance | null = null;
  private config: FHEVMConfig;
  private provider: BrowserProvider | JsonRpcProvider | null = null;
  private initialized: boolean = false;

  constructor(config: FHEVMConfig) {
    this.config = config;
    this.provider = config.provider || null;
  }

  /**
   * Initialize the FHEVM client
   * Must be called before using any encryption/decryption features
   */
  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize fhevmjs
      await initFhevm();

      // Create instance with network configuration
      this.instance = await createInstance({
        chainId: this.config.network.chainId,
        networkUrl: this.config.network.rpcUrl,
        gatewayUrl: this.config.network.gatewayUrl,
        aclAddress: this.config.network.aclAddress,
      });

      this.initialized = true;
      console.log('✅ FHEVM Client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize FHEVM Client:', error);
      throw new Error(`FHEVM initialization failed: ${error}`);
    }
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the FHEVM instance
   * Throws error if not initialized
   */
  getInstance(): FhevmInstance {
    if (!this.instance) {
      throw new Error('FHEVM Client not initialized. Call init() first.');
    }
    return this.instance;
  }

  /**
   * Encrypt a number (uint8, uint16, uint32, etc.)
   */
  async encryptNumber(value: number, bits: 8 | 16 | 32 | 64 = 8): Promise<Uint8Array> {
    const instance = this.getInstance();

    switch (bits) {
      case 8:
        return instance.encrypt8(value);
      case 16:
        return instance.encrypt16(value);
      case 32:
        return instance.encrypt32(value);
      case 64:
        return instance.encrypt64(BigInt(value));
      default:
        throw new Error(`Unsupported bit size: ${bits}`);
    }
  }

  /**
   * Encrypt a boolean value
   */
  async encryptBoolean(value: boolean): Promise<Uint8Array> {
    const instance = this.getInstance();
    return instance.encryptBool(value);
  }

  /**
   * Encrypt an address
   */
  async encryptAddress(address: string): Promise<Uint8Array> {
    const instance = this.getInstance();
    return instance.encryptAddress(address);
  }

  /**
   * Create encrypted input for a contract function
   * @param contractAddress - The contract address
   * @param signer - The signer to use for generating proof
   */
  createEncryptedInput(contractAddress: string, signer: Signer) {
    const instance = this.getInstance();
    return instance.createEncryptedInput(contractAddress, signer.address);
  }

  /**
   * Request decryption of an encrypted value (user decrypt with EIP-712 signature)
   * @param handle - The encrypted handle
   * @param contractAddress - The contract address
   * @param signer - The user's signer
   */
  async userDecrypt(
    handle: bigint,
    contractAddress: string,
    signer: Signer
  ): Promise<bigint> {
    const instance = this.getInstance();

    // Generate EIP-712 signature for decryption
    const { signature } = await instance.generateToken({
      verifyingContract: contractAddress,
    });

    // Sign with user's wallet
    const signedSignature = await signer.signMessage(signature);

    // Request decryption
    const decryptedValue = await instance.decrypt(contractAddress, handle, signedSignature);

    return BigInt(decryptedValue);
  }

  /**
   * Request public decryption (via gateway/KMS)
   * @param handles - Array of encrypted handles
   * @param contractAddress - The contract address
   */
  async publicDecrypt(
    handles: bigint[],
    contractAddress: string
  ): Promise<bigint[]> {
    const instance = this.getInstance();

    // This would integrate with the gateway for public decryption
    // Implementation depends on gateway API
    const results: bigint[] = [];

    for (const handle of handles) {
      try {
        const decrypted = await instance.decrypt(contractAddress, handle);
        results.push(BigInt(decrypted));
      } catch (error) {
        console.error(`Failed to decrypt handle ${handle}:`, error);
        results.push(BigInt(0));
      }
    }

    return results;
  }

  /**
   * Generate permit signature for allowing contract to access encrypted data
   * @param contractAddress - The contract to grant permission
   * @param signer - The user's signer
   */
  async generatePermitSignature(
    contractAddress: string,
    signer: Signer
  ): Promise<string> {
    const instance = this.getInstance();

    const { signature } = await instance.generateToken({
      verifyingContract: contractAddress,
    });

    return await signer.signMessage(signature);
  }

  /**
   * Get public key for encryption
   */
  getPublicKey(): string {
    const instance = this.getInstance();
    return instance.getPublicKey();
  }

  /**
   * Reencrypt a value (used for viewing encrypted on-chain data)
   * @param handle - The encrypted handle
   * @param privateKey - User's private key for reencryption
   * @param publicKey - Contract's public key
   * @param signature - EIP-712 signature
   * @param contractAddress - The contract address
   * @param userAddress - The user's address
   */
  async reencrypt(
    handle: bigint,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddress: string,
    userAddress: string
  ): Promise<bigint> {
    const instance = this.getInstance();

    const reencrypted = await instance.reencrypt(
      handle,
      privateKey,
      publicKey,
      signature,
      contractAddress,
      userAddress
    );

    return BigInt(reencrypted);
  }
}

/**
 * Create a new FHEVM client instance
 * @param config - Configuration for the FHEVM client
 * @returns A new FHEVMClient instance
 */
export function createFHEVMClient(config: FHEVMConfig): FHEVMClient {
  return new FHEVMClient(config);
}
