interface MarketDataResponse {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

interface CryptoPrice {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  updatedAt: Date;
}

export class MarketDataService {
  private coinGeckoApiKey: string;
  private coinMarketCapApiKey: string;
  private priceCache = new Map<string, { data: CryptoPrice; timestamp: number }>();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  constructor() {
    this.coinGeckoApiKey = process.env.COINGECKO_API_KEY || '';
    this.coinMarketCapApiKey = process.env.COINMARKETCAP_API_KEY || '';
  }

  async fetchLivePrices(symbols: string[] = ['bitcoin', 'ethereum', 'solana']): Promise<CryptoPrice[]> {
    const now = Date.now();
    const cachedData: CryptoPrice[] = [];
    const symbolsToFetch: string[] = [];

    // Check cache first
    for (const symbol of symbols) {
      const cached = this.priceCache.get(symbol);
      if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
        cachedData.push(cached.data);
      } else {
        symbolsToFetch.push(symbol);
      }
    }

    // Fetch fresh data for uncached symbols
    if (symbolsToFetch.length > 0) {
      try {
        const freshData = await this.fetchFromCoinGecko(symbolsToFetch);
        
        // Cache the fresh data
        freshData.forEach((price, index) => {
          this.priceCache.set(symbolsToFetch[index], {
            data: price,
            timestamp: now
          });
        });

        return [...cachedData, ...freshData];
      } catch (error) {
        console.error('Error fetching live prices:', error);
        
        // Try fallback to CoinMarketCap if CoinGecko fails
        try {
          const fallbackData = await this.fetchFromCoinMarketCap(symbolsToFetch);
          
          fallbackData.forEach((price, index) => {
            this.priceCache.set(symbolsToFetch[index], {
              data: price,
              timestamp: now
            });
          });

          return [...cachedData, ...fallbackData];
        } catch (fallbackError) {
          console.error('Both market data sources failed:', fallbackError);
          throw new Error('Unable to fetch live market data from any source');
        }
      }
    }

    return cachedData;
  }

  private async fetchFromCoinGecko(symbols: string[]): Promise<CryptoPrice[]> {
    if (!this.coinGeckoApiKey) {
      throw new Error('CoinGecko API key not configured');
    }

    const symbolsParam = symbols.join(',');
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbolsParam}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

    const response = await fetch(url, {
      headers: {
        'X-CG-Demo-API-Key': this.coinGeckoApiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data: MarketDataResponse[] = await response.json();
    
    return data.map((coin, index) => ({
      id: index + 1,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      volume: coin.total_volume || 0,
      marketCap: coin.market_cap || 0,
      updatedAt: new Date()
    }));
  }

  private async fetchFromCoinMarketCap(symbols: string[]): Promise<CryptoPrice[]> {
    if (!this.coinMarketCapApiKey) {
      throw new Error('CoinMarketCap API key not configured');
    }

    // Convert CoinGecko IDs to CMC symbols for the API call
    const symbolMap: Record<string, string> = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'solana': 'SOL'
    };

    const cmcSymbols = symbols.map(s => symbolMap[s] || s.toUpperCase()).join(',');
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${cmcSymbols}`;

    const response = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': this.coinMarketCapApiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const prices: CryptoPrice[] = [];

    Object.values(result.data).forEach((coin: any, index: number) => {
      prices.push({
        id: index + 1,
        symbol: coin.symbol,
        name: coin.name,
        price: coin.quote.USD.price,
        change24h: coin.quote.USD.percent_change_24h || 0,
        volume: coin.quote.USD.volume_24h || 0,
        marketCap: coin.quote.USD.market_cap || 0,
        updatedAt: new Date()
      });
    });

    return prices;
  }

  async getPrice(symbol: string): Promise<number> {
    try {
      const prices = await this.fetchLivePrices([symbol.toLowerCase()]);
      return prices[0]?.price || 0;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return 0;
    }
  }

  clearCache(): void {
    this.priceCache.clear();
  }
}

export const marketDataService = new MarketDataService();