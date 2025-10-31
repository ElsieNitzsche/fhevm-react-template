// src/core/fhevm.ts
import { createInstance, initFhevm } from "fhevmjs";
var FHEVMClient = class {
  constructor(config) {
    this.instance = null;
    this.provider = null;
    this.initialized = false;
    this.config = config;
    this.provider = config.provider || null;
  }
  /**
   * Initialize the FHEVM client
   * Must be called before using any encryption/decryption features
   */
  async init() {
    if (this.initialized) {
      return;
    }
    try {
      await initFhevm();
      this.instance = await createInstance({
        chainId: this.config.network.chainId,
        networkUrl: this.config.network.rpcUrl,
        gatewayUrl: this.config.network.gatewayUrl,
        aclAddress: this.config.network.aclAddress
      });
      this.initialized = true;
      console.log("FHEVM Client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize FHEVM Client:", error);
      throw new Error(`FHEVM initialization failed: ${error}`);
    }
  }
  isInitialized() {
    return this.initialized;
  }
  getInstance() {
    if (!this.instance) {
      throw new Error("FHEVM Client not initialized. Call init() first.");
    }
    return this.instance;
  }
  async encryptNumber(value, bits = 8) {
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
  async encryptBoolean(value) {
    const instance = this.getInstance();
    return instance.encryptBool(value);
  }
  async encryptAddress(address) {
    const instance = this.getInstance();
    return instance.encryptAddress(address);
  }
  createEncryptedInput(contractAddress, signer) {
    const instance = this.getInstance();
    return instance.createEncryptedInput(contractAddress, signer.address);
  }
  async userDecrypt(handle, contractAddress, signer) {
    const instance = this.getInstance();
    const { signature } = await instance.generateToken({
      verifyingContract: contractAddress
    });
    const signedSignature = await signer.signMessage(signature);
    const decryptedValue = await instance.decrypt(contractAddress, handle, signedSignature);
    return BigInt(decryptedValue);
  }
  async publicDecrypt(handles, contractAddress) {
    const instance = this.getInstance();
    const results = [];
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
  async generatePermitSignature(contractAddress, signer) {
    const instance = this.getInstance();
    const { signature } = await instance.generateToken({
      verifyingContract: contractAddress
    });
    return await signer.signMessage(signature);
  }
  getPublicKey() {
    const instance = this.getInstance();
    return instance.getPublicKey();
  }
  async reencrypt(handle, privateKey, publicKey, signature, contractAddress, userAddress) {
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
};
function createFHEVMClient(config) {
  return new FHEVMClient(config);
}

// src/utils.ts
import { Contract } from "ethers";
var NETWORKS = {
  SEPOLIA: {
    chainId: 11155111,
    rpcUrl: "https://rpc.sepolia.org",
    name: "Sepolia Testnet",
    explorer: "https://sepolia.etherscan.io"
  },
  ZAMA_DEVNET: {
    chainId: 9e3,
    rpcUrl: "https://devnet.zama.ai",
    name: "Zama Devnet",
    explorer: "https://explorer.zama.ai"
  },
  LOCAL: {
    chainId: 31337,
    rpcUrl: "http://localhost:8545",
    name: "Local Hardhat",
    explorer: ""
  }
};
function createFHEVMContract(address, abi, signer, fhevmClient) {
  const contract = new Contract(address, abi, signer);
  return {
    contract,
    fhevmClient,
    /**
     * Call a view function
     */
    async call(method, ...args) {
      return await contract[method](...args);
    },
    /**
     * Send a transaction
     */
    async send(method, ...args) {
      const tx = await contract[method](...args);
      return await tx.wait();
    },
    /**
     * Send a transaction with encrypted inputs
     */
    async sendEncrypted(method, encryptedInputs, ...additionalArgs) {
      const { handles, inputProof } = encryptedInputs.encrypt();
      const tx = await contract[method](...handles, inputProof, ...additionalArgs);
      return await tx.wait();
    },
    /**
     * Get raw contract instance
     */
    getRawContract() {
      return contract;
    }
  };
}
function formatHandle(handle) {
  return `0x${BigInt(handle).toString(16).padStart(64, "0")}`;
}
function parseHandle(handleStr) {
  return BigInt(handleStr);
}
function isEncrypted(value) {
  if (typeof value === "bigint") {
    return value > BigInt("0xffffffffffffffff");
  }
  if (typeof value === "string" && value.startsWith("0x")) {
    try {
      const bi = BigInt(value);
      return bi > BigInt("0xffffffffffffffff");
    } catch {
      return false;
    }
  }
  return false;
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function retry(fn, maxAttempts = 3, delayMs = 1e3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
        await delay(delayMs);
        delayMs *= 2;
      }
    }
  }
  throw lastError || new Error("Retry failed");
}
function formatError(error) {
  if (error?.message) {
    return error.message;
  }
  if (error?.reason) {
    return error.reason;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
function truncateAddress(address, chars = 4) {
  if (!isValidAddress(address)) {
    return address;
  }
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}
function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  }
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m`;
  }
  return `${Math.floor(seconds / 86400)}d ${Math.floor(seconds % 86400 / 3600)}h`;
}
function hasWeb3Provider() {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
}
function getCurrentTimestamp() {
  return Math.floor(Date.now() / 1e3);
}

export {
  FHEVMClient,
  createFHEVMClient,
  NETWORKS,
  createFHEVMContract,
  formatHandle,
  parseHandle,
  isEncrypted,
  delay,
  retry,
  formatError,
  isValidAddress,
  truncateAddress,
  formatDuration,
  hasWeb3Provider,
  getCurrentTimestamp
};
