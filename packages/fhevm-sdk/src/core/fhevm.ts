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
      await initFhevm();

      this.instance = await createInstance({
        chainId: this.config.network.chainId,
        networkUrl: this.config.network.rpcUrl,
        gatewayUrl: this.config.network.gatewayUrl,
        aclAddress: this.config.network.aclAddress,
      });

      this.initialized = true;
      console.log('FHEVM Client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize FHEVM Client:', error);
      throw new Error(`FHEVM initialization failed: ${error}`);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getInstance(): FhevmInstance {
    if (!this.instance) {
      throw new Error('FHEVM Client not initialized. Call init() first.');
    }
    return this.instance;
  }

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

  async encryptBoolean(value: boolean): Promise<Uint8Array> {
    const instance = this.getInstance();
    return instance.encryptBool(value);
  }

  async encryptAddress(address: string): Promise<Uint8Array> {
    const instance = this.getInstance();
    return instance.encryptAddress(address);
  }

  createEncryptedInput(contractAddress: string, signer: Signer) {
    const instance = this.getInstance();
    return instance.createEncryptedInput(contractAddress, signer.address);
  }

  async userDecrypt(
    handle: bigint,
    contractAddress: string,
    signer: Signer
  ): Promise<bigint> {
    const instance = this.getInstance();

    const { signature } = await instance.generateToken({
      verifyingContract: contractAddress,
    });

    const signedSignature = await signer.signMessage(signature);
    const decryptedValue = await instance.decrypt(contractAddress, handle, signedSignature);

    return BigInt(decryptedValue);
  }

  async publicDecrypt(
    handles: bigint[],
    contractAddress: string
  ): Promise<bigint[]> {
    const instance = this.getInstance();
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

  getPublicKey(): string {
    const instance = this.getInstance();
    return instance.getPublicKey();
  }

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

export function createFHEVMClient(config: FHEVMConfig): FHEVMClient {
  return new FHEVMClient(config);
}
