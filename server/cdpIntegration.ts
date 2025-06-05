import axios from 'axios';

interface CDPBalance {
  asset: {
    id: string;
    type: string;
    groupId: string;
    subGroupId: string;
  };
  value: number;
  valueStr: string;
  decimals: number;
}

interface CDPBalanceResponse {
  balances: CDPBalance[];
  nextPageToken?: string;
}

interface CDPWalletData {
  address: string;
  balances: CDPBalance[];
  totalValue: number;
  network: string;
}

export class CDPIntegration {
  private readonly baseUrl = 'https://api.developer.coinbase.com/rpc/v1/base';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.CDP_API_KEY || 'DfC2hHiGkzPrMbaQ19KR9cEg6DIe9H2A';
  }

  async getWalletBalances(address: string): Promise<CDPWalletData> {
    try {
      const response = await axios.post(`${this.baseUrl}/${this.apiKey}`, {
        jsonrpc: "2.0",
        id: 1,
        method: "cdp_listBalances",
        params: [{
          address: address,
          pageToken: "",
          pageSize: 50
        }]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result: CDPBalanceResponse = response.data.result;
      
      // Calculate total portfolio value (simplified calculation)
      const totalValue = result.balances.reduce((sum, balance) => {
        return sum + balance.value;
      }, 0);

      return {
        address,
        balances: result.balances,
        totalValue,
        network: 'Base'
      };
    } catch (error) {
      console.error('CDP API Error:', error);
      throw new Error('Failed to fetch wallet balances from CDP');
    }
  }

  async validateWalletOnChain(address: string): Promise<{
    isValid: boolean;
    hasBalance: boolean;
    balanceCount: number;
    network: string;
  }> {
    try {
      const walletData = await this.getWalletBalances(address);
      
      return {
        isValid: true,
        hasBalance: walletData.balances.length > 0,
        balanceCount: walletData.balances.length,
        network: walletData.network
      };
    } catch (error) {
      return {
        isValid: false,
        hasBalance: false,
        balanceCount: 0,
        network: 'Unknown'
      };
    }
  }

  async getAssetDetails(assetId: string): Promise<{
    id: string;
    name: string;
    symbol: string;
    type: string;
  } | null> {
    // For now, we'll return basic asset info based on known patterns
    // This can be expanded with additional CDP API calls
    const knownAssets: Record<string, { name: string; symbol: string; type: string }> = {
      'eth': { name: 'Ethereum', symbol: 'ETH', type: 'native' },
      'usdc': { name: 'USD Coin', symbol: 'USDC', type: 'erc20' },
      'weth': { name: 'Wrapped Ethereum', symbol: 'WETH', type: 'erc20' }
    };

    const lowerAssetId = assetId.toLowerCase();
    for (const [key, value] of Object.entries(knownAssets)) {
      if (lowerAssetId.includes(key)) {
        return {
          id: assetId,
          ...value
        };
      }
    }

    return {
      id: assetId,
      name: 'Unknown Asset',
      symbol: 'UNK',
      type: 'erc1155'
    };
  }
}

export const cdpIntegration = new CDPIntegration();