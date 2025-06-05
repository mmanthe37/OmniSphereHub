interface UserOperation {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData?: string;
  signature: string;
}

interface ERC7677PaymasterService {
  url: string;
  context: {
    policyId: string;
    entryPoint: string;
    chainId: number;
  };
}

interface SponsorshipPolicy {
  id: string;
  name: string;
  rules: {
    addressAllowlist: string[];
    maxGasPerTransaction: bigint;
    maxTransactionsPerDay: number;
    contractWhitelist: string[];
  };
  active: boolean;
}

export class ERC4337PaymasterService {
  private readonly entryPointAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
  private readonly paymasterAddress: string;
  private readonly baseChainId = 8453; // Base mainnet
  private readonly baseSepoliaChainId = 84532; // Base Sepolia testnet
  
  private sponsorshipPolicies: Map<string, SponsorshipPolicy> = new Map();

  constructor() {
    this.paymasterAddress = process.env.PAYMASTER_ADDRESS || '0x2d45014917c4bce08b6fb2b3a53960692b5b744b';
    this.initializePolicies();
  }

  private initializePolicies() {
    // OmniSphere Premium Policy
    const premiumPolicy: SponsorshipPolicy = {
      id: 'omnisphere-premium',
      name: 'OmniSphere Premium Sponsorship',
      rules: {
        addressAllowlist: [
          '0x2d45014917c4bce08b6fb2b3a53960692b5b744b',
          '0xF7DCa789B08Ed2F7995D9bC22c500A8CA715D0A8',
          '0x0fa44c066886d74e4884f010473347adfc706307',
          '0x0000006e221000F22963833833a30d0001216877a',
          '0x2d450149170CEcb09b5fb63a300d2b3a30ab744b'
        ],
        maxGasPerTransaction: BigInt('500000'), // 500k gas limit
        maxTransactionsPerDay: 100,
        contractWhitelist: [
          '0x2d45014917c4bce08b6fb2b3a53960692b5b744b' // OmniSphere Core Contract
        ]
      },
      active: true
    };

    this.sponsorshipPolicies.set(premiumPolicy.id, premiumPolicy);
  }

  // ERC-7677 Paymaster Service Implementation
  async getPaymasterService(chainId: number): Promise<ERC7677PaymasterService> {
    const supportedChains = [this.baseChainId, this.baseSepoliaChainId];
    
    if (!supportedChains.includes(chainId)) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    return {
      url: process.env.PAYMASTER_ENDPOINT || 'https://api.developer.coinbase.com/rpc/v1/base/DfC2hHiGkzPrMbaQ19KR9cEg6DIe9H2A',
      context: {
        policyId: 'omnisphere-premium',
        entryPoint: this.entryPointAddress,
        chainId
      }
    };
  }

  // ERC-4337 UserOperation Validation
  async validateUserOperation(userOp: UserOperation, entryPoint: string): Promise<{
    valid: boolean;
    reason?: string;
    gasEstimate?: {
      preVerificationGas: string;
      verificationGasLimit: string;
      callGasLimit: string;
    };
  }> {
    try {
      // Validate entry point
      if (entryPoint !== this.entryPointAddress) {
        return {
          valid: false,
          reason: 'Invalid entry point address'
        };
      }

      // Check if sender is allowlisted
      const policy = this.sponsorshipPolicies.get('omnisphere-premium');
      if (!policy || !policy.active) {
        return {
          valid: false,
          reason: 'No active sponsorship policy'
        };
      }

      if (!policy.rules.addressAllowlist.includes(userOp.sender.toLowerCase())) {
        return {
          valid: false,
          reason: 'Sender not in allowlist'
        };
      }

      // Validate gas limits
      const callGasLimit = BigInt(userOp.callGasLimit);
      if (callGasLimit > policy.rules.maxGasPerTransaction) {
        return {
          valid: false,
          reason: 'Gas limit exceeds policy maximum'
        };
      }

      // Generate gas estimates
      const gasEstimate = {
        preVerificationGas: '0x5208', // 21000 in hex
        verificationGasLimit: '0x186a0', // 100000 in hex
        callGasLimit: userOp.callGasLimit
      };

      return {
        valid: true,
        gasEstimate
      };
    } catch (error) {
      return {
        valid: false,
        reason: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Generate Paymaster Data for ERC-4337
  async generatePaymasterAndData(
    userOp: UserOperation,
    validUntil: number = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  ): Promise<string> {
    try {
      // Paymaster data format: paymaster address + validUntil + validAfter + signature
      const validAfter = Math.floor(Date.now() / 1000);
      
      // Encode paymaster data (simplified for demo)
      const paymasterData = [
        this.paymasterAddress.slice(2), // Remove 0x prefix
        validUntil.toString(16).padStart(12, '0'),
        validAfter.toString(16).padStart(12, '0'),
        '0'.repeat(130) // Placeholder signature (65 bytes)
      ].join('');

      return '0x' + paymasterData;
    } catch (error) {
      throw new Error(`Failed to generate paymaster data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Smart Wallet Integration for wallet_sendCalls
  async prepareWalletSendCalls(
    calls: Array<{
      to: string;
      value: string;
      data: string;
    }>,
    sender: string,
    chainId: number
  ): Promise<{
    calls: Array<{
      to: string;
      value: string;
      data: string;
    }>;
    capabilities: {
      paymasterService: ERC7677PaymasterService;
    };
  }> {
    const paymasterService = await this.getPaymasterService(chainId);
    
    return {
      calls,
      capabilities: {
        paymasterService
      }
    };
  }

  // Get sponsorship status for address
  async getSponsorshipStatus(address: string): Promise<{
    isSponsored: boolean;
    policyId?: string;
    dailyTransactionCount: number;
    dailyLimit: number;
    gasRemaining: bigint;
  }> {
    const policy = this.sponsorshipPolicies.get('omnisphere-premium');
    
    if (!policy || !policy.active) {
      return {
        isSponsored: false,
        dailyTransactionCount: 0,
        dailyLimit: 0,
        gasRemaining: BigInt(0)
      };
    }

    const isAllowlisted = policy.rules.addressAllowlist.includes(address.toLowerCase());
    
    return {
      isSponsored: isAllowlisted,
      policyId: isAllowlisted ? policy.id : undefined,
      dailyTransactionCount: 0, // Would track from database
      dailyLimit: policy.rules.maxTransactionsPerDay,
      gasRemaining: policy.rules.maxGasPerTransaction
    };
  }

  // Update sponsorship policy
  async updateSponsorshipPolicy(
    policyId: string,
    updates: Partial<SponsorshipPolicy>
  ): Promise<boolean> {
    const policy = this.sponsorshipPolicies.get(policyId);
    if (!policy) {
      return false;
    }

    const updatedPolicy = { ...policy, ...updates };
    this.sponsorshipPolicies.set(policyId, updatedPolicy);
    
    return true;
  }

  // Get all active policies
  getActivePolicies(): SponsorshipPolicy[] {
    return Array.from(this.sponsorshipPolicies.values()).filter(policy => policy.active);
  }

  // Generate UserOperation hash for ERC-4337
  generateUserOperationHash(userOp: UserOperation, entryPoint: string, chainId: number): string {
    // Simplified hash generation (production would use proper ABI encoding)
    const data = [
      userOp.sender,
      userOp.nonce,
      userOp.initCode,
      userOp.callData,
      userOp.callGasLimit,
      userOp.verificationGasLimit,
      userOp.preVerificationGas,
      userOp.maxFeePerGas,
      userOp.maxPriorityFeePerGas,
      userOp.paymasterAndData || '0x',
      entryPoint,
      chainId.toString()
    ].join('');

    // In production, use proper keccak256 hashing
    return '0x' + Buffer.from(data).toString('hex').slice(0, 64);
  }

  // Check if contract is whitelisted for sponsorship
  isContractWhitelisted(contractAddress: string, policyId: string = 'omnisphere-premium'): boolean {
    const policy = this.sponsorshipPolicies.get(policyId);
    if (!policy) return false;

    return policy.rules.contractWhitelist.includes(contractAddress.toLowerCase());
  }
}

export const erc4337Paymaster = new ERC4337PaymasterService();