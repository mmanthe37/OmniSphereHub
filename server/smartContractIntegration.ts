import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { 
  isWalletAllowlisted, 
  getWalletPrivileges, 
  logWalletActivity 
} from "./walletAllowlist";

// OmniSphere Core Contract Configuration
export const OMNISPHERE_CORE_CONTRACT = {
  address: '0x2d45014917c4bce08b6fb2b3a53960692b5b744b' as const,
  abi: [
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "symbol", 
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "address", name: "user", type: "address" }],
      name: "getUserPrivileges",
      outputs: [{ internalType: "uint256", name: "level", type: "uint256" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "address", name: "wallet", type: "address" }],
      name: "isAllowlisted",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "processX402Payment",
      outputs: [{ internalType: "bool", name: "success", type: "bool" }],
      stateMutability: "payable",
      type: "function"
    }
  ] as const
};

export class SmartContractManager {
  private publicClient;
  private walletClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: base,
      transport: http()
    });

    // Initialize wallet client for contract interactions
    if (process.env.OMNISPHERE_PRIVATE_KEY) {
      const account = privateKeyToAccount(process.env.OMNISPHERE_PRIVATE_KEY as `0x${string}`);
      this.walletClient = createWalletClient({
        account,
        chain: base,
        transport: http()
      });
    }
  }

  async validateWalletOnChain(walletAddress: string): Promise<{
    isValid: boolean;
    isAllowlisted: boolean;
    privilegeLevel: number;
    contractVerified: boolean;
  }> {
    try {
      // Check if wallet is allowlisted on-chain
      const isAllowlistedOnChain = await this.publicClient.readContract({
        address: OMNISPHERE_CORE_CONTRACT.address,
        abi: OMNISPHERE_CORE_CONTRACT.abi,
        functionName: 'isAllowlisted',
        args: [walletAddress as `0x${string}`]
      });

      // Get privilege level from contract
      const privilegeLevel = await this.publicClient.readContract({
        address: OMNISPHERE_CORE_CONTRACT.address,
        abi: OMNISPHERE_CORE_CONTRACT.abi,
        functionName: 'getUserPrivileges',
        args: [walletAddress as `0x${string}`]
      });

      // Cross-reference with local allowlist
      const isLocalAllowlisted = isWalletAllowlisted(walletAddress);

      logWalletActivity(walletAddress, 'ONCHAIN_VALIDATION', {
        isAllowlistedOnChain,
        isLocalAllowlisted,
        privilegeLevel: Number(privilegeLevel)
      });

      return {
        isValid: true,
        isAllowlisted: isAllowlistedOnChain || isLocalAllowlisted,
        privilegeLevel: Number(privilegeLevel),
        contractVerified: true
      };
    } catch (error) {
      console.error('On-chain validation failed:', error);
      
      // Fall back to local validation
      const isLocalAllowlisted = isWalletAllowlisted(walletAddress);
      const privileges = getWalletPrivileges(walletAddress);
      
      return {
        isValid: true,
        isAllowlisted: isLocalAllowlisted,
        privilegeLevel: privileges.isPremium ? 3 : 1,
        contractVerified: false
      };
    }
  }

  async processX402Payment(
    amount: number,
    senderAddress: string
  ): Promise<{
    success: boolean;
    transactionHash?: string;
    gasUsed?: bigint;
    error?: string;
  }> {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet client not initialized');
      }

      // Validate wallet privileges
      const validation = await this.validateWalletOnChain(senderAddress);
      if (!validation.isAllowlisted) {
        return {
          success: false,
          error: 'Wallet not authorized for X402 payments'
        };
      }

      // Convert amount to wei
      const amountInWei = parseEther(amount.toString());

      // Process payment through smart contract
      const hash = await this.walletClient.writeContract({
        address: OMNISPHERE_CORE_CONTRACT.address,
        abi: OMNISPHERE_CORE_CONTRACT.abi,
        functionName: 'processX402Payment',
        args: [amountInWei],
        value: amountInWei
      });

      // Wait for transaction confirmation
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash
      });

      logWalletActivity(senderAddress, 'X402_PAYMENT_PROCESSED', {
        amount,
        transactionHash: hash,
        gasUsed: Number(receipt.gasUsed)
      });

      return {
        success: true,
        transactionHash: hash,
        gasUsed: receipt.gasUsed
      };
    } catch (error) {
      console.error('X402 payment processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  async getContractInfo(): Promise<{
    name: string;
    symbol: string;
    address: string;
    network: string;
  }> {
    try {
      const name = await this.publicClient.readContract({
        address: OMNISPHERE_CORE_CONTRACT.address,
        abi: OMNISPHERE_CORE_CONTRACT.abi,
        functionName: 'name'
      });

      const symbol = await this.publicClient.readContract({
        address: OMNISPHERE_CORE_CONTRACT.address,
        abi: OMNISPHERE_CORE_CONTRACT.abi,
        functionName: 'symbol'
      });

      return {
        name: name as string,
        symbol: symbol as string,
        address: OMNISPHERE_CORE_CONTRACT.address,
        network: 'Base'
      };
    } catch (error) {
      return {
        name: 'OmniSphere Core',
        symbol: 'OMNI',
        address: OMNISPHERE_CORE_CONTRACT.address,
        network: 'Base'
      };
    }
  }

  async estimateGasForPayment(amount: number): Promise<bigint> {
    try {
      const amountInWei = parseEther(amount.toString());
      
      const gasEstimate = await this.publicClient.estimateContractGas({
        address: OMNISPHERE_CORE_CONTRACT.address,
        abi: OMNISPHERE_CORE_CONTRACT.abi,
        functionName: 'processX402Payment',
        args: [amountInWei],
        value: amountInWei
      });

      return gasEstimate;
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return BigInt(100000); // Default gas limit
    }
  }
}

export const smartContractManager = new SmartContractManager();