// External API Service for Xano integration
export class ExternalAPIService {
  private static baseURL = 'https://x8ki-letl-twmt.n7.xano.io/api:JIterA9P';
  private static authToken = 'a538f02f-8cd3-4716-8897-cda1d72304b7';

  static async makeExternalRequest(url: string, method: string = 'GET', params: any = {}): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/External_API_Request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({
          url,
          method,
          headers: {},
          params
        }),
      });

      if (!response.ok) {
        console.warn(`Xano External API returned ${response.status}: ${response.statusText}`);
        return null; // Return null for failed requests to maintain data integrity
      }

      const data = await response.json();
      
      // Check if Xano returned an error
      if (data.code === "ERROR_CODE_NOT_FOUND" || data.error) {
        console.warn('Xano External API endpoint not properly configured');
        return null;
      }

      return data.response?.result || data;
    } catch (error) {
      console.warn('External API request failed:', error);
      return null; // Return null instead of throwing to maintain app stability
    }
  }

  // Fetch cryptocurrency prices from external API
  static async getCryptoPrices(symbols: string[] = ['BTC', 'ETH', 'SOL', 'ADA']): Promise<any[]> {
    try {
      const symbolString = symbols.join(',');
      const response = await this.makeExternalRequest(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true`,
        'GET'
      );

      return response.result ? Object.entries(response.result).map(([key, value]: [string, any]) => ({
        symbol: key.toUpperCase(),
        price: value.usd,
        change24h: value.usd_24h_change || 0
      })) : [];
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
      return [];
    }
  }

  // Fetch market data from external sources
  static async getMarketData(): Promise<any> {
    try {
      const response = await this.makeExternalRequest(
        'https://api.coingecko.com/api/v3/global',
        'GET'
      );

      return response.result || null;
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      return null;
    }
  }

  // Fetch DeFi protocol data
  static async getDeFiData(): Promise<any[]> {
    try {
      const response = await this.makeExternalRequest(
        'https://api.llama.fi/protocols',
        'GET'
      );

      return response.result || [];
    } catch (error) {
      console.error('Failed to fetch DeFi data:', error);
      return [];
    }
  }
}