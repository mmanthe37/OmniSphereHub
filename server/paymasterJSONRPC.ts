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
  signature: string;
  paymasterAndData?: string;
}

interface PaymasterStubDataParams {
  policyId: string;
}

interface PaymasterStubDataResponse {
  paymaster: string;
  paymasterData: string;
  preVerificationGas: string;
  verificationGasLimit: string;
  callGasLimit: string;
}

interface UserOperationReceipt {
  userOpHash: string;
  entryPoint: string;
  sender: string;
  nonce: string;
  paymaster: string;
  actualGasCost: string;
  actualGasUsed: string;
  success: boolean;
  reason?: string;
  logs: any[];
  receipt: any;
}

export class PaymasterJSONRPC {
  private readonly baseUrl: string;
  private readonly entryPointV06 = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
  private readonly policyId: string;

  constructor() {
    // Use your live paymaster endpoint from the attached CSV data
    this.baseUrl = process.env.PAYMASTER_ENDPOINT || 'https://api.developer.coinbase.com/rpc/v1/base/DfC2hHiGkzPrMbaQ19KR9cEg6DIe9H2A';
    this.policyId = process.env.PAYMASTER_POLICY_ID || '631528b0-d444-4a9b-a575-40dd3aa4a13a';
  }

  private async makeJSONRPCRequest(method: string, params: any[]): Promise<any> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CDP_API_KEY_NAME}`
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method,
          params
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`JSON-RPC Error: ${data.error.message}`);
      }

      return data.result;
    } catch (error) {
      console.error(`Paymaster JSON-RPC ${method} failed:`, error);
      throw error;
    }
  }

  // Bundler Namespace Methods
  async getSupportedEntryPoints(): Promise<string[]> {
    return await this.makeJSONRPCRequest('eth_supportedEntryPoints', []);
  }

  async getUserOperationByHash(hash: string): Promise<UserOperation & { blockNumber: string; blockHash: string; transactionHash: string }> {
    return await this.makeJSONRPCRequest('eth_getUserOperationByHash', [hash]);
  }

  async getUserOperationReceipt(hash: string): Promise<UserOperationReceipt> {
    return await this.makeJSONRPCRequest('eth_getUserOperationReceipt', [hash]);
  }

  async sendUserOperation(userOp: UserOperation): Promise<string> {
    return await this.makeJSONRPCRequest('eth_sendUserOperation', [userOp, this.entryPointV06]);
  }

  async estimateUserOperationGas(userOp: UserOperation): Promise<{
    preVerificationGas: string;
    verificationGasLimit: string;
    callGasLimit: string;
  }> {
    return await this.makeJSONRPCRequest('eth_estimateUserOperationGas', [userOp, this.entryPointV06]);
  }

  // Paymaster Namespace Methods
  async getPaymasterStubData(userOp: Partial<UserOperation>): Promise<PaymasterStubDataResponse> {
    const params = [
      userOp,
      this.entryPointV06,
      "0x14A34", // Chain ID for Base
      { policyId: this.policyId }
    ];
    
    return await this.makeJSONRPCRequest('pm_getPaymasterStubData', params);
  }

  async getPaymasterData(userOp: UserOperation): Promise<{
    paymaster: string;
    paymasterData: string;
  }> {
    const params = [
      userOp,
      this.entryPointV06,
      "0x14A34", // Chain ID for Base
      { policyId: this.policyId }
    ];
    
    return await this.makeJSONRPCRequest('pm_getPaymasterData', params);
  }

  async sponsorUserOperation(userOp: UserOperation): Promise<{
    paymasterAndData: string;
    preVerificationGas: string;
    verificationGasLimit: string;
    callGasLimit: string;
  }> {
    return await this.makeJSONRPCRequest('pm_sponsorUserOperation', [userOp, this.entryPointV06]);
  }

  async getAcceptedPaymentTokens(): Promise<string[]> {
    return await this.makeJSONRPCRequest('pm_getAcceptedPaymentTokens', []);
  }

  async getAddressSponsorshipInfo(address: string): Promise<{
    isSponsored: boolean;
    sponsorshipLimit: string;
    sponsorshipUsed: string;
  }> {
    return await this.makeJSONRPCRequest('pm_getAddressSponsorshipInfo', [address]);
  }

  // Helper method to create sponsored transaction
  async createSponsoredTransaction(
    sender: string,
    callData: string,
    nonce?: string
  ): Promise<{
    userOperation: UserOperation;
    sponsorshipData: any;
  }> {
    try {
      // Create base user operation
      const baseUserOp: Partial<UserOperation> = {
        sender,
        nonce: nonce || '0x0',
        initCode: '0x',
        callData,
        callGasLimit: '0x0',
        verificationGasLimit: '0x0',
        preVerificationGas: '0x0',
        maxFeePerGas: '0x0',
        maxPriorityFeePerGas: '0x0'
      };

      // Get paymaster stub data
      const stubData = await this.getPaymasterStubData(baseUserOp);

      // Create complete user operation with estimates
      const userOp: UserOperation = {
        ...baseUserOp,
        callGasLimit: stubData.callGasLimit,
        verificationGasLimit: stubData.verificationGasLimit,
        preVerificationGas: stubData.preVerificationGas,
        signature: '0x', // Placeholder - needs actual signature
        paymasterAndData: stubData.paymasterData
      } as UserOperation;

      // Get final paymaster data
      const paymasterData = await this.getPaymasterData(userOp);

      return {
        userOperation: {
          ...userOp,
          paymasterAndData: paymasterData.paymasterData
        },
        sponsorshipData: {
          paymaster: paymasterData.paymaster,
          estimatedGas: {
            callGasLimit: stubData.callGasLimit,
            verificationGasLimit: stubData.verificationGasLimit,
            preVerificationGas: stubData.preVerificationGas
          }
        }
      };
    } catch (error) {
      console.error('Failed to create sponsored transaction:', error);
      throw error;
    }
  }

  // Get comprehensive sponsorship analytics
  async getSponsorshipAnalytics(): Promise<{
    supportedEntryPoints: string[];
    acceptedTokens: string[];
    policyId: string;
    totalSponsored: number;
  }> {
    try {
      const [entryPoints, tokens] = await Promise.all([
        this.getSupportedEntryPoints(),
        this.getAcceptedPaymentTokens()
      ]);

      return {
        supportedEntryPoints: entryPoints,
        acceptedTokens: tokens,
        policyId: this.policyId,
        totalSponsored: 0 // This would come from your analytics
      };
    } catch (error) {
      console.error('Failed to get sponsorship analytics:', error);
      return {
        supportedEntryPoints: [this.entryPointV06],
        acceptedTokens: [],
        policyId: this.policyId,
        totalSponsored: 0
      };
    }
  }
}

export const paymasterJSONRPC = new PaymasterJSONRPC();