interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

interface DEXRoute {
  dex: string;
  price: number;
  priceImpact: number;
  gasEstimate: number;
  liquidity: number;
  fee: number;
  route: string[];
}

interface SwapQuote {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromAmount: string;
  toAmount: string;
  routes: DEXRoute[];
  bestRoute: DEXRoute;
  totalGasCost: number;
  estimatedTime: number;
}

// Major DEX contract addresses and pool information
const DEX_PROTOCOLS = {
  uniswapV3: {
    name: "Uniswap V3",
    router: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    fee: 0.3,
    gasMultiplier: 1.0
  },
  uniswapV2: {
    name: "Uniswap V2",
    router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    fee: 0.3,
    gasMultiplier: 0.8
  },
  sushiswap: {
    name: "SushiSwap",
    router: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
    factory: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
    fee: 0.3,
    gasMultiplier: 0.85
  },
  curve: {
    name: "Curve",
    router: "0x99a58482BD75cbab83b27EC03CA68fF489b5788f",
    factory: "0x0959158b6040D32d04c301A72CBFD6b39E21c9AE",
    fee: 0.04,
    gasMultiplier: 1.2
  },
  balancer: {
    name: "Balancer V2",
    router: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    factory: "0x8E9aa87E45f842Aa296a7662b75575A906Bd0df8",
    fee: 0.25,
    gasMultiplier: 1.1
  }
};

// Common token addresses on Ethereum mainnet
const TOKEN_LIST: Record<string, TokenInfo> = {
  ETH: {
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
  },
  WETH: {
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png"
  },
  USDC: {
    address: "0xA0b86a33E6441b1d9E13D6b1eb3c5C4B4e1b8C5E",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png"
  },
  USDT: {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png"
  },
  DAI: {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png"
  },
  WBTC: {
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    symbol: "WBTC",
    name: "Wrapped BTC",
    decimals: 8,
    logoURI: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png"
  }
};

export class DEXAggregator {
  private baseGasPrice = 20; // gwei
  private baseGasLimit = 150000;

  async fetchTokenPrices(): Promise<Record<string, number>> {
    try {
      // Fetch from public APIs without authentication
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,usd-coin,tether,dai&vs_currencies=usd', {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        ETH: data.ethereum?.usd || 2500,
        WETH: data.ethereum?.usd || 2500,
        WBTC: data.bitcoin?.usd || 43000,
        USDC: data['usd-coin']?.usd || 1,
        USDT: data.tether?.usd || 1,
        DAI: data.dai?.usd || 1
      };
    } catch (error) {
      console.error('Error fetching token prices:', error);
      // Fallback to realistic current prices if API fails
      return {
        ETH: 2487.32,
        WETH: 2487.32,
        WBTC: 43280.50,
        USDC: 1.00,
        USDT: 1.00,
        DAI: 0.999
      };
    }
  }

  async calculateSwapRoutes(
    fromToken: string,
    toToken: string,
    amount: number
  ): Promise<SwapQuote> {
    const prices = await this.fetchTokenPrices();
    const fromTokenInfo = TOKEN_LIST[fromToken];
    const toTokenInfo = TOKEN_LIST[toToken];
    
    if (!fromTokenInfo || !toTokenInfo) {
      throw new Error('Token not supported');
    }

    const fromPrice = prices[fromToken] || 0;
    const toPrice = prices[toToken] || 0;
    
    // Calculate base conversion
    const baseToAmount = (amount * fromPrice) / toPrice;
    
    // Generate routes for each DEX with realistic variations
    const routes: DEXRoute[] = Object.entries(DEX_PROTOCOLS).map(([key, dex]) => {
      // Simulate liquidity and slippage effects
      const liquidityFactor = this.getLiquidityFactor(key, fromToken, toToken);
      const slippageFactor = this.calculateSlippage(amount, liquidityFactor);
      const priceImpact = this.calculatePriceImpact(amount, liquidityFactor);
      
      const adjustedAmount = baseToAmount * (1 - slippageFactor) * (1 - dex.fee / 100);
      
      return {
        dex: dex.name,
        price: adjustedAmount,
        priceImpact: priceImpact,
        gasEstimate: this.baseGasLimit * dex.gasMultiplier,
        liquidity: liquidityFactor * 1000000, // Mock liquidity in USD
        fee: dex.fee,
        route: [fromToken, toToken] // Simplified direct route
      };
    });

    // Sort by best price (highest output amount)
    routes.sort((a, b) => b.price - a.price);
    const bestRoute = routes[0];

    return {
      fromToken: fromTokenInfo,
      toToken: toTokenInfo,
      fromAmount: amount.toString(),
      toAmount: bestRoute.price.toFixed(6),
      routes,
      bestRoute,
      totalGasCost: bestRoute.gasEstimate * this.baseGasPrice * 1e-9 * fromPrice,
      estimatedTime: 15 // seconds
    };
  }

  private getLiquidityFactor(dex: string, fromToken: string, toToken: string): number {
    // Simulate different liquidity levels based on DEX and token pair
    const baseLiquidity = {
      uniswapV3: 1.0,
      uniswapV2: 0.8,
      sushiswap: 0.7,
      curve: 0.9, // High for stablecoins
      balancer: 0.6
    };

    const pairMultiplier = this.getPairLiquidityMultiplier(fromToken, toToken);
    return (baseLiquidity[dex as keyof typeof baseLiquidity] || 0.5) * pairMultiplier;
  }

  private getPairLiquidityMultiplier(fromToken: string, toToken: string): number {
    // Major pairs have higher liquidity
    const majorPairs = ['ETH', 'WETH', 'USDC', 'USDT', 'DAI'];
    if (majorPairs.includes(fromToken) && majorPairs.includes(toToken)) {
      return 1.0;
    }
    if (majorPairs.includes(fromToken) || majorPairs.includes(toToken)) {
      return 0.7;
    }
    return 0.4;
  }

  private calculateSlippage(amount: number, liquidity: number): number {
    // Slippage increases with trade size relative to liquidity
    const slippageBase = Math.min(amount / (liquidity * 100000), 0.05);
    return slippageBase + Math.random() * 0.001; // Add small random variation
  }

  private calculatePriceImpact(amount: number, liquidity: number): number {
    // Price impact calculation based on trade size
    return Math.min((amount / (liquidity * 50000)) * 100, 5.0);
  }

  async getTokenList(): Promise<TokenInfo[]> {
    return Object.values(TOKEN_LIST);
  }

  async estimateGas(route: DEXRoute, fromAmount: number): Promise<number> {
    // More sophisticated gas estimation based on route complexity
    let gasEstimate = route.gasEstimate;
    
    // Multi-hop routes cost more gas
    if (route.route.length > 2) {
      gasEstimate *= 1.5;
    }
    
    // Larger trades might require more gas
    if (fromAmount > 10000) {
      gasEstimate *= 1.2;
    }
    
    return Math.round(gasEstimate);
  }

  async simulateSwap(quote: SwapQuote): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
    actualOutput?: number;
  }> {
    // Simulate transaction execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 95% success rate simulation
    if (Math.random() > 0.05) {
      // Small random variation in actual output (±0.1%)
      const variation = (Math.random() - 0.5) * 0.002;
      const actualOutput = parseFloat(quote.toAmount) * (1 + variation);
      
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        actualOutput
      };
    } else {
      return {
        success: false,
        error: 'Transaction failed: Insufficient liquidity or network congestion'
      };
    }
  }
}

export const dexAggregator = new DEXAggregator();