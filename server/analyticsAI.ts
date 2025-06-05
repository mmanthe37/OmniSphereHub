import { coinbaseCDP } from "./coinbaseCDP";

interface PortfolioMetrics {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
  informationRatio: number;
  sortino: number;
}

interface MarketPrediction {
  asset: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timeframe: '1h' | '4h' | '1d' | '1w';
  targetPrice: number;
  reasoning: string[];
}

interface TradingSignal {
  action: 'buy' | 'sell' | 'hold';
  asset: string;
  strength: number; // 0-100
  entry: number;
  target: number;
  stopLoss: number;
  riskReward: number;
}

interface RiskMetrics {
  varDaily: number; // Value at Risk
  expectedShortfall: number;
  concentrationRisk: number;
  liquidityRisk: number;
  correlationMatrix: Record<string, Record<string, number>>;
}

interface TaxOptimization {
  harvestableGains: number;
  harvestableLosses: number;
  recommendedActions: Array<{
    action: string;
    asset: string;
    amount: number;
    taxSavings: number;
  }>;
  projectedTaxLiability: number;
}

export class AnalyticsAIEngine {
  private priceHistory: Map<string, number[]> = new Map();
  private portfolioHistory: Map<number, Array<{ date: Date; value: number }>> = new Map();

  async calculateInstitutionalMetrics(
    userId: number,
    timeframe: '1M' | '3M' | '1Y' | 'YTD'
  ): Promise<PortfolioMetrics> {
    let portfolioData = this.portfolioHistory.get(userId);
    
    // Generate historical portfolio data if none exists
    if (!portfolioData || portfolioData.length < 2) {
      portfolioData = this.generateHistoricalPortfolioData(userId, timeframe);
      this.portfolioHistory.set(userId, portfolioData);
    }
    
    // Ensure portfolioData is defined
    const validPortfolioData = portfolioData || [];
    
    // Calculate portfolio performance data
    const returns = this.calculateReturns(validPortfolioData);
    const benchmarkReturns = this.generateBenchmarkReturns(returns.length);

    const totalReturn = this.calculateTotalReturn(returns);
    const volatility = this.calculateVolatility(returns);
    const riskFreeRate = 0.04; // 4% annual risk-free rate

    return {
      totalReturn,
      sharpeRatio: volatility > 0 ? (totalReturn - riskFreeRate) / volatility : 0,
      maxDrawdown: this.calculateMaxDrawdown(returns),
      volatility,
      beta: this.calculateBeta(returns, benchmarkReturns),
      alpha: this.calculateAlpha(returns, benchmarkReturns, riskFreeRate),
      informationRatio: this.calculateInformationRatio(returns, benchmarkReturns),
      sortino: this.calculateSortino(returns, riskFreeRate)
    };
  }

  private generateHistoricalPortfolioData(userId: number, timeframe: string): Array<{ date: Date; value: number }> {
    const days = timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : timeframe === 'YTD' ? 365 : 365;
    const startValue = 100000; // $100k starting portfolio value
    const data: Array<{ date: Date; value: number }> = [];
    
    let currentValue = startValue;
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      
      // Generate realistic daily returns based on crypto market patterns
      const dailyReturn = (Math.random() - 0.45) * 0.08; // Slightly positive bias with volatility
      currentValue *= (1 + dailyReturn);
      
      data.push({ date, value: currentValue });
    }
    
    console.log(`Generated ${data.length} portfolio data points for user ${userId}, timeframe ${timeframe}`);
    return data;
  }

  private calculateReturns(portfolioData: Array<{ date: Date; value: number }>): number[] {
    if (portfolioData.length < 2) return [];
    
    const returns: number[] = [];
    for (let i = 1; i < portfolioData.length; i++) {
      const currentValue = portfolioData[i].value;
      const previousValue = portfolioData[i - 1].value;
      returns.push((currentValue - previousValue) / previousValue);
    }
    return returns;
  }

  private generateBenchmarkReturns(length: number): number[] {
    // Simulate S&P 500 benchmark returns
    return Array.from({ length }, () => (Math.random() - 0.48) * 0.02); // Slight positive bias
  }

  private calculateTotalReturn(returns: number[]): number {
    return returns.reduce((total, ret) => total * (1 + ret), 1) - 1;
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0;
    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(252); // Annualized
  }

  private calculateMaxDrawdown(returns: number[]): number {
    let peak = 1;
    let maxDrawdown = 0;
    let cumulative = 1;

    for (const ret of returns) {
      cumulative *= (1 + ret);
      peak = Math.max(peak, cumulative);
      const drawdown = (peak - cumulative) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown;
  }

  private calculateBeta(returns: number[], benchmarkReturns: number[]): number {
    if (returns.length !== benchmarkReturns.length) return 1;

    const covariance = this.calculateCovariance(returns, benchmarkReturns);
    const benchmarkVariance = this.calculateVariance(benchmarkReturns);
    
    return covariance / benchmarkVariance;
  }

  private calculateAlpha(returns: number[], benchmarkReturns: number[], riskFreeRate: number): number {
    const portfolioReturn = this.calculateTotalReturn(returns);
    const benchmarkReturn = this.calculateTotalReturn(benchmarkReturns);
    const beta = this.calculateBeta(returns, benchmarkReturns);
    
    return portfolioReturn - (riskFreeRate + beta * (benchmarkReturn - riskFreeRate));
  }

  private calculateInformationRatio(returns: number[], benchmarkReturns: number[]): number {
    const excessReturns = returns.map((ret, i) => ret - benchmarkReturns[i]);
    const mean = excessReturns.reduce((sum, ret) => sum + ret, 0) / excessReturns.length;
    const trackingError = this.calculateVolatility(excessReturns);
    
    return mean / trackingError;
  }

  private calculateSortino(returns: number[], riskFreeRate: number): number {
    const excessReturns = returns.map(ret => ret - riskFreeRate / 252);
    const downside = excessReturns.filter(ret => ret < 0);
    const downsideDeviation = Math.sqrt(downside.reduce((sum, ret) => sum + ret * ret, 0) / downside.length);
    const meanExcess = excessReturns.reduce((sum, ret) => sum + ret, 0) / excessReturns.length;
    
    return meanExcess / downsideDeviation;
  }

  private calculateCovariance(x: number[], y: number[]): number {
    const meanX = x.reduce((sum, val) => sum + val, 0) / x.length;
    const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;
    
    return x.reduce((sum, val, i) => sum + (val - meanX) * (y[i] - meanY), 0) / x.length;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  async generateMarketPredictions(assets: string[]): Promise<MarketPrediction[]> {
    const predictions: MarketPrediction[] = [];

    for (const asset of assets) {
      // Simulate AI-powered market analysis
      const confidence = 65 + Math.random() * 30; // 65-95% confidence
      const direction = Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'bearish' : 'neutral';
      const currentPrice = await this.getCurrentPrice(asset);
      const priceChange = direction === 'bullish' ? 0.05 + Math.random() * 0.15 : 
                         direction === 'bearish' ? -0.15 - Math.random() * 0.05 : 
                         -0.02 + Math.random() * 0.04;

      predictions.push({
        asset,
        direction,
        confidence,
        timeframe: ['1h', '4h', '1d', '1w'][Math.floor(Math.random() * 4)] as any,
        targetPrice: currentPrice * (1 + priceChange),
        reasoning: this.generateReasoningFactors(asset, direction)
      });
    }

    return predictions;
  }

  private async getCurrentPrice(asset: string): Promise<number> {
    // Would integrate with real price API
    const mockPrices: Record<string, number> = {
      'BTC': 67500,
      'ETH': 3800,
      'SOL': 185,
      'USDC': 1.00,
      'MATIC': 0.85
    };
    return mockPrices[asset] || 100;
  }

  private generateReasoningFactors(asset: string, direction: string): string[] {
    const factors = {
      bullish: [
        'Strong institutional adoption momentum',
        'Positive technical indicators (RSI oversold)',
        'Increasing on-chain activity',
        'Favorable macroeconomic conditions',
        'Strong support level holding'
      ],
      bearish: [
        'Overbought conditions on multiple timeframes',
        'Decreasing network activity',
        'Resistance level rejection',
        'Regulatory uncertainty',
        'Profit-taking pressure'
      ],
      neutral: [
        'Consolidation phase expected',
        'Mixed technical signals',
        'Awaiting key economic data',
        'Range-bound trading likely',
        'Low volatility environment'
      ]
    };

    return factors[direction as keyof typeof factors].slice(0, 3);
  }

  async generateTradingSignals(
    userId: number,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  ): Promise<TradingSignal[]> {
    const assets = ['BTC', 'ETH', 'SOL', 'MATIC'];
    const signals: TradingSignal[] = [];

    for (const asset of assets) {
      const prediction = await this.generateMarketPredictions([asset]);
      const currentPrice = await this.getCurrentPrice(asset);
      
      const riskMultiplier = {
        conservative: 0.5,
        moderate: 1.0,
        aggressive: 1.5
      }[riskTolerance];

      if (prediction[0].confidence > 70) {
        const action = prediction[0].direction === 'bullish' ? 'buy' : 
                      prediction[0].direction === 'bearish' ? 'sell' : 'hold';
        
        const strength = (prediction[0].confidence - 50) * 2; // Convert to 0-100 scale
        const priceMove = Math.abs(prediction[0].targetPrice - currentPrice) / currentPrice;
        
        signals.push({
          action,
          asset,
          strength: Math.min(100, strength * riskMultiplier),
          entry: currentPrice,
          target: prediction[0].targetPrice,
          stopLoss: action === 'buy' ? currentPrice * 0.95 : currentPrice * 1.05,
          riskReward: priceMove / 0.05 // 5% risk assumption
        });
      }
    }

    return signals;
  }

  async calculateRiskMetrics(userId: number): Promise<RiskMetrics> {
    const assets = ['BTC', 'ETH', 'SOL', 'MATIC', 'USDC'];
    const returns = await this.getHistoricalReturns(assets);
    
    // Calculate Value at Risk (95% confidence)
    const portfolioReturns = this.calculatePortfolioReturns(returns);
    portfolioReturns.sort((a, b) => a - b);
    const varIndex = Math.floor(portfolioReturns.length * 0.05);
    const varDaily = portfolioReturns[varIndex];

    // Expected Shortfall (Conditional VaR)
    const expectedShortfall = portfolioReturns.slice(0, varIndex).reduce((sum, ret) => sum + ret, 0) / varIndex;

    // Concentration risk (Herfindahl index)
    const weights = [0.4, 0.3, 0.15, 0.1, 0.05]; // Portfolio weights
    const concentrationRisk = weights.reduce((sum, weight) => sum + weight * weight, 0);

    // Correlation matrix
    const correlationMatrix = this.calculateCorrelationMatrix(assets, returns);

    return {
      varDaily,
      expectedShortfall,
      concentrationRisk,
      liquidityRisk: 0.15, // 15% liquidity risk
      correlationMatrix
    };
  }

  private async getHistoricalReturns(assets: string[]): Promise<Record<string, number[]>> {
    const returns: Record<string, number[]> = {};
    
    for (const asset of assets) {
      // Generate realistic return series
      returns[asset] = Array.from({ length: 252 }, () => (Math.random() - 0.5) * 0.04); // ±2% daily moves
    }
    
    return returns;
  }

  private calculatePortfolioReturns(assetReturns: Record<string, number[]>): number[] {
    const weights = { BTC: 0.4, ETH: 0.3, SOL: 0.15, MATIC: 0.1, USDC: 0.05 };
    const assets = Object.keys(weights);
    const length = assetReturns[assets[0]].length;
    
    const portfolioReturns: number[] = [];
    
    for (let i = 0; i < length; i++) {
      let portfolioReturn = 0;
      for (const asset of assets) {
        portfolioReturn += weights[asset as keyof typeof weights] * assetReturns[asset][i];
      }
      portfolioReturns.push(portfolioReturn);
    }
    
    return portfolioReturns;
  }

  private calculateCorrelationMatrix(assets: string[], returns: Record<string, number[]>): Record<string, Record<string, number>> {
    const matrix: Record<string, Record<string, number>> = {};
    
    for (const asset1 of assets) {
      matrix[asset1] = {};
      for (const asset2 of assets) {
        if (asset1 === asset2) {
          matrix[asset1][asset2] = 1;
        } else {
          matrix[asset1][asset2] = this.calculateCorrelation(returns[asset1], returns[asset2]);
        }
      }
    }
    
    return matrix;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const covariance = this.calculateCovariance(x, y);
    const stdX = Math.sqrt(this.calculateVariance(x));
    const stdY = Math.sqrt(this.calculateVariance(y));
    
    return covariance / (stdX * stdY);
  }

  async optimizeTaxStrategy(
    userId: number,
    holdings: Array<{ asset: string; amount: number; costBasis: number; currentPrice: number }>
  ): Promise<TaxOptimization> {
    let harvestableGains = 0;
    let harvestableLosses = 0;
    const recommendedActions: Array<{
      action: string;
      asset: string;
      amount: number;
      taxSavings: number;
    }> = [];

    for (const holding of holdings) {
      const currentValue = holding.amount * holding.currentPrice;
      const costBasis = holding.amount * holding.costBasis;
      const gainLoss = currentValue - costBasis;

      if (gainLoss > 0) {
        harvestableGains += gainLoss;
      } else {
        harvestableLosses += Math.abs(gainLoss);
        
        // Recommend tax loss harvesting
        if (Math.abs(gainLoss) > 1000) { // Only for significant losses
          const taxSavings = Math.abs(gainLoss) * 0.25; // 25% tax rate assumption
          
          recommendedActions.push({
            action: 'Harvest tax loss',
            asset: holding.asset,
            amount: holding.amount,
            taxSavings
          });
        }
      }
    }

    // Calculate projected tax liability
    const netGains = Math.max(0, harvestableGains - harvestableLosses);
    const projectedTaxLiability = netGains * 0.25; // 25% capital gains tax

    return {
      harvestableGains,
      harvestableLosses,
      recommendedActions,
      projectedTaxLiability
    };
  }

  async enableAutomatedRiskManagement(
    userId: number,
    stopLossThreshold: number,
    positionSizingRule: 'fixed' | 'kelly' | 'volatility'
  ): Promise<{
    riskManagementActive: boolean;
    stopLosses: Array<{ asset: string; triggerPrice: number }>;
    positionSizes: Array<{ asset: string; recommendedSize: number }>;
  }> {
    const holdings = await this.getUserHoldings(userId);
    const stopLosses: Array<{ asset: string; triggerPrice: number }> = [];
    const positionSizes: Array<{ asset: string; recommendedSize: number }> = [];

    for (const holding of holdings) {
      // Set stop losses
      const triggerPrice = holding.currentPrice * (1 - stopLossThreshold);
      stopLosses.push({
        asset: holding.asset,
        triggerPrice
      });

      // Calculate position sizes
      let recommendedSize = 0;
      switch (positionSizingRule) {
        case 'fixed':
          recommendedSize = 0.1; // 10% of portfolio
          break;
        case 'kelly':
          recommendedSize = this.calculateKellySize(holding.asset);
          break;
        case 'volatility':
          recommendedSize = this.calculateVolatilityAdjustedSize(holding.asset);
          break;
      }

      positionSizes.push({
        asset: holding.asset,
        recommendedSize
      });
    }

    return {
      riskManagementActive: true,
      stopLosses,
      positionSizes
    };
  }

  private async getUserHoldings(userId: number): Promise<Array<{ asset: string; amount: number; costBasis: number; currentPrice: number }>> {
    // Mock user holdings
    return [
      { asset: 'BTC', amount: 1.5, costBasis: 65000, currentPrice: 67500 },
      { asset: 'ETH', amount: 10, costBasis: 3500, currentPrice: 3800 },
      { asset: 'SOL', amount: 50, costBasis: 180, currentPrice: 185 }
    ];
  }

  private calculateKellySize(asset: string): number {
    // Simplified Kelly Criterion calculation
    const winRate = 0.55; // 55% win rate assumption
    const avgWin = 0.08; // 8% average win
    const avgLoss = 0.05; // 5% average loss
    
    return (winRate * avgWin - (1 - winRate) * avgLoss) / avgWin;
  }

  private calculateVolatilityAdjustedSize(asset: string): number {
    const volatilities: Record<string, number> = {
      'BTC': 0.6,
      'ETH': 0.8,
      'SOL': 1.2,
      'MATIC': 1.5
    };
    
    const baseSize = 0.2; // 20% base allocation
    const volatility = volatilities[asset] || 1.0;
    
    return baseSize / volatility; // Inverse relationship with volatility
  }
}

export const analyticsAI = new AnalyticsAIEngine();