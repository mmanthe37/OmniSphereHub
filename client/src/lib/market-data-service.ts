// Market Data Service - Provides authentic cryptocurrency data
import { ExternalAPIService } from "./external-api";

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

export interface MarketSummary {
  totalMarketCap: number;
  totalVolume24h: number;
  activeCryptocurrencies: number;
  marketCapChange24h: number;
  dominanceBTC: number;
  dominanceETH: number;
}

export class MarketDataService {
  private static cache: Map<string, { data: any; timestamp: number }> = new Map();
  private static readonly CACHE_DURATION = 60000; // 1 minute cache

  // Get cached data if valid, otherwise return null
  private static getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  // Set cache data
  private static setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Fetch live cryptocurrency prices
  static async getCryptoPrices(): Promise<CryptoPrice[]> {
    const cacheKey = 'crypto_prices';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Attempt to fetch from Xano external API
      const externalData = await ExternalAPIService.getCryptoPrices();
      
      if (externalData && externalData.length > 0) {
        this.setCachedData(cacheKey, externalData);
        return externalData;
      }

      // If external API fails, return empty array (no mock data)
      console.warn('Market data unavailable - external API not configured');
      return [];
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      return [];
    }
  }

  // Fetch market summary data
  static async getMarketSummary(): Promise<MarketSummary | null> {
    const cacheKey = 'market_summary';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await ExternalAPIService.getMarketData();
      
      if (data && data.data) {
        const summary: MarketSummary = {
          totalMarketCap: data.data.total_market_cap?.usd || 0,
          totalVolume24h: data.data.total_volume?.usd || 0,
          activeCryptocurrencies: data.data.active_cryptocurrencies || 0,
          marketCapChange24h: data.data.market_cap_change_percentage_24h_usd || 0,
          dominanceBTC: data.data.market_cap_percentage?.btc || 0,
          dominanceETH: data.data.market_cap_percentage?.eth || 0,
        };
        
        this.setCachedData(cacheKey, summary);
        return summary;
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch market summary:', error);
      return null;
    }
  }

  // Get DeFi protocol data
  static async getDeFiProtocols(): Promise<any[]> {
    const cacheKey = 'defi_protocols';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await ExternalAPIService.getDeFiData();
      
      if (data && Array.isArray(data)) {
        // Filter and format top 20 protocols
        const topProtocols = data
          .filter(protocol => protocol.tvl > 0)
          .sort((a, b) => b.tvl - a.tvl)
          .slice(0, 20)
          .map(protocol => ({
            id: protocol.id,
            name: protocol.name,
            symbol: protocol.symbol,
            tvl: protocol.tvl,
            change_1d: protocol.change_1d,
            change_7d: protocol.change_7d,
            category: protocol.category,
            chains: protocol.chains,
            logo: protocol.logo
          }));

        this.setCachedData(cacheKey, topProtocols);
        return topProtocols;
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch DeFi protocols:', error);
      return [];
    }
  }

  // Search for specific cryptocurrency
  static async searchCrypto(query: string): Promise<CryptoPrice[]> {
    const allPrices = await this.getCryptoPrices();
    
    if (!query.trim()) return allPrices;

    return allPrices.filter(crypto => 
      crypto.name.toLowerCase().includes(query.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Get price for specific cryptocurrency
  static async getCryptoPrice(symbol: string): Promise<CryptoPrice | null> {
    const allPrices = await this.getCryptoPrices();
    return allPrices.find(crypto => 
      crypto.symbol.toLowerCase() === symbol.toLowerCase()
    ) || null;
  }

  // Clear cache (useful for manual refresh)
  static clearCache(): void {
    this.cache.clear();
  }

  // Check if external API is configured
  static async isExternalAPIConfigured(): Promise<boolean> {
    try {
      const testData = await ExternalAPIService.makeExternalRequest(
        'https://httpbin.org/json',
        'GET'
      );
      return testData !== null;
    } catch {
      return false;
    }
  }
}