// Portfolio Service - Manages authentic user portfolio data
export interface PortfolioData {
  id: number;
  userId: number;
  totalValue: number;
  totalReturn: number;
  dailyReturn: number;
  weeklyReturn: number;
  holdings: Holding[];
  performance: PerformanceData[];
}

export interface Holding {
  id: number;
  symbol: string;
  name: string;
  amount: number;
  value: number;
  price: number;
  change24h: number;
  allocation: number;
}

export interface PerformanceData {
  date: string;
  value: number;
  return: number;
}

export class PortfolioService {
  private static STORAGE_KEY = 'omnisphere_portfolio';

  // Create new empty portfolio for authenticated user
  static createEmptyPortfolio(userId: number): PortfolioData {
    return {
      id: Date.now(),
      userId,
      totalValue: 0,
      totalReturn: 0,
      dailyReturn: 0,
      weeklyReturn: 0,
      holdings: [],
      performance: []
    };
  }

  // Get portfolio data for user (returns empty state if none exists)
  static getPortfolio(userId: number): PortfolioData {
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return this.createEmptyPortfolio(userId);
  }

  // Save portfolio data
  static savePortfolio(portfolio: PortfolioData): void {
    localStorage.setItem(`${this.STORAGE_KEY}_${portfolio.userId}`, JSON.stringify(portfolio));
  }

  // Add holding to portfolio
  static addHolding(userId: number, holding: Omit<Holding, 'id'>): PortfolioData {
    const portfolio = this.getPortfolio(userId);
    const newHolding: Holding = {
      ...holding,
      id: Date.now()
    };
    
    portfolio.holdings.push(newHolding);
    portfolio.totalValue = portfolio.holdings.reduce((sum, h) => sum + h.value, 0);
    
    this.savePortfolio(portfolio);
    return portfolio;
  }

  // Remove holding from portfolio
  static removeHolding(userId: number, holdingId: number): PortfolioData {
    const portfolio = this.getPortfolio(userId);
    portfolio.holdings = portfolio.holdings.filter(h => h.id !== holdingId);
    portfolio.totalValue = portfolio.holdings.reduce((sum, h) => sum + h.value, 0);
    
    this.savePortfolio(portfolio);
    return portfolio;
  }

  // Update portfolio performance
  static updatePerformance(userId: number, performanceData: PerformanceData): PortfolioData {
    const portfolio = this.getPortfolio(userId);
    portfolio.performance.push(performanceData);
    
    // Keep only last 30 days of performance data
    if (portfolio.performance.length > 30) {
      portfolio.performance = portfolio.performance.slice(-30);
    }
    
    this.savePortfolio(portfolio);
    return portfolio;
  }

  // Calculate portfolio metrics
  static calculateMetrics(portfolio: PortfolioData): {
    allocation: { symbol: string; percentage: number; value: number }[];
    topPerformer: Holding | null;
    worstPerformer: Holding | null;
  } {
    if (portfolio.holdings.length === 0) {
      return {
        allocation: [],
        topPerformer: null,
        worstPerformer: null
      };
    }

    const allocation = portfolio.holdings.map(holding => ({
      symbol: holding.symbol,
      percentage: (holding.value / portfolio.totalValue) * 100,
      value: holding.value
    }));

    const topPerformer = portfolio.holdings.reduce((prev, current) =>
      current.change24h > prev.change24h ? current : prev
    );

    const worstPerformer = portfolio.holdings.reduce((prev, current) =>
      current.change24h < prev.change24h ? current : prev
    );

    return {
      allocation,
      topPerformer,
      worstPerformer
    };
  }
}