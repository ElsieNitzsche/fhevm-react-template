"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  FHEVMClient: () => FHEVMClient,
  NETWORKS: () => NETWORKS,
  batchUserDecrypt: () => batchUserDecrypt,
  createFHEVMClient: () => createFHEVMClient,
  createFHEVMContract: () => createFHEVMContract,
  delay: () => delay,
  encryptAddress: () => encryptAddress,
  encryptBatch: () => encryptBatch,
  encryptBoolean: () => encryptBoolean,
  encryptNumber: () => encryptNumber,
  formatDuration: () => formatDuration,
  formatError: () => formatError,
  formatHandle: () => formatHandle,
  generatePermit: () => generatePermit,
  getCurrentTimestamp: () => getCurrentTimestamp,
  hasWeb3Provider: () => hasWeb3Provider,
  isEncrypted: () => isEncrypted,
  isValidAddress: () => isValidAddress2,
  parseHandle: () => parseHandle,
  publicDecrypt: () => publicDecrypt,
  retry: () => retry,
  safeUserDecrypt: () => safeUserDecrypt,
  truncateAddress: () => truncateAddress,
  userDecrypt: () => userDecrypt
});
module.exports = __toCommonJS(index_exports);

// src/core/fhevm.ts
var import_fhevmjs = require("fhevmjs");
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
      await (0, import_fhevmjs.initFhevm)();
      this.instance = await (0, import_fhevmjs.createInstance)({
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

// src/utils/encryption.ts
async function encryptNumber(client, value, bits = 8) {
  return await client.encryptNumber(value, bits);
}
async function encryptBoolean(client, value) {
  return await client.encryptBoolean(value);
}
async function encryptAddress(client, address) {
  if (!isValidAddress(address)) {
    throw new Error(`Invalid Ethereum address: ${address}`);
  }
  return await client.encryptAddress(address);
}
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
async function encryptBatch(client, values) {
  const results = [];
  for (const item of values) {
    let encrypted;
    switch (item.type) {
      case "number":
        encrypted = await encryptNumber(client, item.value, item.bits);
        break;
      case "boolean":
        encrypted = await encryptBoolean(client, item.value);
        break;
      case "address":
        encrypted = await encryptAddress(client, item.value);
        break;
      default:
        throw new Error(`Unsupported type: ${item.type}`);
    }
    results.push(encrypted);
  }
  return results;
}

// src/utils/decryption.ts
async function userDecrypt(client, handle, contractAddress, signer) {
  return await client.userDecrypt(handle, contractAddress, signer);
}
async function publicDecrypt(client, handles, contractAddress) {
  return await client.publicDecrypt(handles, contractAddress);
}
async function safeUserDecrypt(client, handle, contractAddress, signer) {
  try {
    const value = await userDecrypt(client, handle, contractAddress, signer);
    return {
      value,
      success: true
    };
  } catch (error) {
    return {
      value: BigInt(0),
      success: false,
      error: error instanceof Error ? error.message : "Decryption failed"
    };
  }
}
async function batchUserDecrypt(client, handles, contractAddress, signer) {
  const results = [];
  for (const handle of handles) {
    const result = await safeUserDecrypt(client, handle, contractAddress, signer);
    results.push(result);
  }
  return results;
}
async function generatePermit(client, contractAddress, signer) {
  return await client.generatePermitSignature(contractAddress, signer);
}

// src/utils/index.ts
var import_ethers = require("ethers");
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
  const contract = new import_ethers.Contract(address, abi, signer);
  return {
    contract,
    fhevmClient,
    async call(method, ...args) {
      return await contract[method](...args);
    },
    async send(method, ...args) {
      const tx = await contract[method](...args);
      return await tx.wait();
    },
    async sendEncrypted(method, encryptedInputs, ...additionalArgs) {
      const { handles, inputProof } = encryptedInputs.encrypt();
      const tx = await contract[method](...handles, inputProof, ...additionalArgs);
      return await tx.wait();
    },
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
function isValidAddress2(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
function truncateAddress(address, chars = 4) {
  if (!isValidAddress2(address)) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FHEVMClient,
  NETWORKS,
  batchUserDecrypt,
  createFHEVMClient,
  createFHEVMContract,
  delay,
  encryptAddress,
  encryptBatch,
  encryptBoolean,
  encryptNumber,
  formatDuration,
  formatError,
  formatHandle,
  generatePermit,
  getCurrentTimestamp,
  hasWeb3Provider,
  isEncrypted,
  isValidAddress,
  parseHandle,
  publicDecrypt,
  retry,
  safeUserDecrypt,
  truncateAddress,
  userDecrypt
});
