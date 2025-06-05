import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { MarketDataService, type CryptoPrice, type MarketSummary } from "@/lib/market-data-service";
import { useAuth } from "@/contexts/AuthContext";
import PermissionGate from "@/components/ui/PermissionGate";

export default function MarketOverview() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { canAccess } = useAuth();

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const [prices, summary] = await Promise.all([
        MarketDataService.getCryptoPrices(),
        MarketDataService.getMarketSummary()
      ]);
      
      setCryptoPrices(prices);
      setMarketSummary(summary);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Auto-refresh every 5 minutes if user can access real-time data
    if (canAccess('canViewRealTimeData')) {
      const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [canAccess]);

  const formatCurrency = (value: number): string => {
    if (value === 0) return '$0.00';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatPercentage = (value: number): string => {
    if (value === 0) return '0.00%';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (cryptoPrices.length === 0 && !loading) {
    return (
      <Card className="bg-slate-800/30 border-slate-700/50">
        <CardContent className="p-8 text-center">
          <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Market Data Unavailable</h3>
          <p className="text-slate-400 mb-4">
            External API configuration required to display live market data.
          </p>
          <Button 
            onClick={fetchMarketData}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Summary */}
      {marketSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Market Cap</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(marketSummary.totalMarketCap)}
                  </p>
                  <div className="flex items-center text-sm">
                    {marketSummary.marketCapChange24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400 mr-1" />
                    )}
                    <span className={marketSummary.marketCapChange24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatPercentage(marketSummary.marketCapChange24h)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-slate-400">24h Volume</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(marketSummary.totalVolume24h)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30">
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-slate-400">BTC Dominance</p>
                <p className="text-xl font-bold text-white">
                  {marketSummary.dominanceBTC.toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-slate-400">Active Coins</p>
                <p className="text-xl font-bold text-white">
                  {marketSummary.activeCryptocurrencies.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Cryptocurrencies */}
      <Card className="bg-slate-800/30 border-slate-700/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Live Market Prices</CardTitle>
          <div className="flex items-center space-x-2">
            {lastUpdated && (
              <span className="text-xs text-slate-400">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={fetchMarketData}
              disabled={loading}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PermissionGate 
            feature="canViewRealTimeData"
            fallback={
              <div className="text-center py-8">
                <p className="text-slate-400">
                  Real-time market data requires account authentication
                </p>
              </div>
            }
          >
            {loading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg">
                    <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-600 rounded w-1/4"></div>
                      <div className="h-3 bg-slate-600 rounded w-1/6"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-600 rounded w-20"></div>
                      <div className="h-3 bg-slate-600 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cryptoPrices.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-400">No market data available</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cryptoPrices.slice(0, 10).map((crypto) => (
                  <div key={crypto.id} className="flex items-center justify-between p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {crypto.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{crypto.name}</p>
                        <p className="text-sm text-slate-400">{crypto.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{formatCurrency(crypto.price)}</p>
                      <div className="flex items-center">
                        {crypto.change24h >= 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-400 mr-1" />
                        )}
                        <span className={`text-sm ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercentage(crypto.change24h)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PermissionGate>
        </CardContent>
      </Card>
    </div>
  );
}