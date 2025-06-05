import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Brain, Shield, AlertTriangle, Target, Zap, Eye } from "lucide-react";

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
  timeframe: string;
  targetPrice: number;
  reasoning: string[];
}

interface TradingSignal {
  action: 'buy' | 'sell' | 'hold';
  asset: string;
  strength: number;
  entry: number;
  target: number;
  stopLoss: number;
  riskReward: number;
}

interface RiskMetrics {
  varDaily: number;
  expectedShortfall: number;
  concentrationRisk: number;
  liquidityRisk: number;
  correlationMatrix: Record<string, Record<string, number>>;
}

export function AnalyticsAIDashboard() {
  const [timeframe, setTimeframe] = useState("1M");
  const [riskTolerance, setRiskTolerance] = useState("moderate");
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [marketPredictions, setMarketPredictions] = useState<MarketPrediction[]>([]);
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe, riskTolerance]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch portfolio metrics
      const metricsResponse = await fetch(`/api/analytics/portfolio-metrics/1/${timeframe}`);
      const metrics = await metricsResponse.json();
      setPortfolioMetrics(metrics);

      // Fetch market predictions
      const predictionsResponse = await fetch('/api/analytics/market-predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets: ['BTC', 'ETH', 'SOL', 'MATIC'] })
      });
      const predictions = await predictionsResponse.json();
      setMarketPredictions(predictions);

      // Fetch trading signals
      const signalsResponse = await fetch('/api/analytics/trading-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, riskTolerance })
      });
      const signals = await signalsResponse.json();
      setTradingSignals(signals);

      // Fetch risk metrics
      const riskResponse = await fetch('/api/analytics/risk-metrics/1');
      const risk = await riskResponse.json();
      setRiskMetrics(risk);

    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const getSignalColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-green-400';
      case 'sell': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Controls */}
      <div className="flex gap-4">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1M">1 Month</SelectItem>
            <SelectItem value="3M">3 Months</SelectItem>
            <SelectItem value="1Y">1 Year</SelectItem>
            <SelectItem value="YTD">Year to Date</SelectItem>
          </SelectContent>
        </Select>

        <Select value={riskTolerance} onValueChange={setRiskTolerance}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conservative">Conservative</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="aggressive">Aggressive</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={fetchAnalyticsData}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          {isLoading ? 'Analyzing...' : 'Refresh Analytics'}
        </Button>
      </div>

      {/* Institutional Portfolio Metrics */}
      {portfolioMetrics && (
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="h-5 w-5 text-blue-400" />
              Institutional Portfolio Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-400">Total Return</p>
                <p className={`text-2xl font-bold ${portfolioMetrics.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(portfolioMetrics.totalReturn * 100).toFixed(2)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-white">{portfolioMetrics.sharpeRatio.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-400">{(portfolioMetrics.maxDrawdown * 100).toFixed(2)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Volatility</p>
                <p className="text-2xl font-bold text-yellow-400">{(portfolioMetrics.volatility * 100).toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Beta</p>
                <p className="text-2xl font-bold text-white">{portfolioMetrics.beta.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Alpha</p>
                <p className={`text-2xl font-bold ${portfolioMetrics.alpha >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(portfolioMetrics.alpha * 100).toFixed(2)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Info Ratio</p>
                <p className="text-2xl font-bold text-white">{portfolioMetrics.informationRatio.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Sortino</p>
                <p className="text-2xl font-bold text-cyan-400">{portfolioMetrics.sortino.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Market Predictions */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Eye className="h-5 w-5 text-purple-400" />
            AI Market Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketPredictions.map((prediction, index) => (
              <div key={prediction.asset} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{prediction.asset}</span>
                    {getDirectionIcon(prediction.direction)}
                    <Badge 
                      variant="secondary"
                      className={`${
                        prediction.direction === 'bullish' ? 'bg-green-500/20 text-green-400' :
                        prediction.direction === 'bearish' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {prediction.direction}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-400">{prediction.timeframe}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Confidence:</span>
                    <span className="text-white">{prediction.confidence.toFixed(1)}%</span>
                  </div>
                  <Progress value={prediction.confidence} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Target Price:</span>
                    <span className="text-cyan-400">${prediction.targetPrice.toLocaleString()}</span>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-1">Key Factors:</p>
                    <ul className="text-xs text-gray-300 space-y-1">
                      {prediction.reasoning.map((reason, i) => (
                        <li key={i}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading Signals */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5 text-green-400" />
            AI Trading Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tradingSignals.map((signal, index) => (
              <div key={signal.asset} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">{signal.asset}</span>
                    <Badge 
                      variant="secondary"
                      className={`${
                        signal.action === 'buy' ? 'bg-green-500/20 text-green-400' :
                        signal.action === 'sell' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {signal.action.toUpperCase()}
                    </Badge>
                    <span className={`text-sm font-semibold ${getSignalColor(signal.action)}`}>
                      Strength: {signal.strength.toFixed(0)}%
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">R/R: {signal.riskReward.toFixed(1)}:1</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Entry:</span>
                    <p className="text-white font-mono">${signal.entry.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Target:</span>
                    <p className="text-green-400 font-mono">${signal.target.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Stop Loss:</span>
                    <p className="text-red-400 font-mono">${signal.stopLoss.toLocaleString()}</p>
                  </div>
                </div>

                <Progress value={signal.strength} className="h-2 mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Management */}
      {riskMetrics && (
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-red-400" />
              Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-400">Daily VaR (95%)</p>
                <p className="text-2xl font-bold text-red-400">${Math.abs(riskMetrics.varDaily * 100000).toFixed(0)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Expected Shortfall</p>
                <p className="text-2xl font-bold text-red-400">${Math.abs(riskMetrics.expectedShortfall * 100000).toFixed(0)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Concentration Risk</p>
                <p className="text-2xl font-bold text-yellow-400">{(riskMetrics.concentrationRisk * 100).toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Liquidity Risk</p>
                <p className="text-2xl font-bold text-orange-400">{(riskMetrics.liquidityRisk * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">Asset Correlation Matrix</h4>
              <div className="bg-gray-800/50 rounded-lg p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 p-2"></th>
                      {Object.keys(riskMetrics.correlationMatrix).map(asset => (
                        <th key={asset} className="text-center text-gray-400 p-2">{asset}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(riskMetrics.correlationMatrix).map(([asset1, correlations]) => (
                      <tr key={asset1}>
                        <td className="text-gray-400 p-2 font-medium">{asset1}</td>
                        {Object.entries(correlations).map(([asset2, correlation]) => (
                          <td key={asset2} className="text-center p-2">
                            <span className={`${
                              correlation > 0.7 ? 'text-red-400' : 
                              correlation > 0.3 ? 'text-yellow-400' : 
                              'text-green-400'
                            }`}>
                              {correlation.toFixed(2)}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Optimization */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-green-400" />
            Tax Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
              Harvest Tax Losses
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Generate Tax Report
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              Optimize Holdings
            </Button>
          </div>

          <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-green-400" />
              <span className="text-green-400 font-semibold">Tax Optimization Insights</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• $12,450 in harvestable losses available</li>
              <li>• Projected tax savings: $3,112 (25% rate)</li>
              <li>• Optimal rebalancing window: Next 30 days</li>
              <li>• Consider moving high-yield assets to tax-advantaged accounts</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}