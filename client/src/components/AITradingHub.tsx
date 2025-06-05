import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Brain, 
  Zap,
  Target,
  Shield,
  BarChart3,
  Cpu,
  Eye,
  PlayCircle,
  PauseCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  high24h: number;
  low24h: number;
  change24h: number;
  marketCap: number;
  rsi: number;
  macd: number;
  bollingerBands: { upper: number; middle: number; lower: number };
}

interface TradingSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  strength: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  riskReward: number;
  timeframe: string;
  strategy: string;
  reasoning: string[];
  timestamp: number;
}

interface AITradingStrategy {
  name: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  targetReturn: number;
  maxDrawdown: number;
  active: boolean;
  performance: {
    totalTrades: number;
    winningTrades: number;
    totalReturn: number;
    sharpeRatio: number;
  };
}

interface PredictionModel {
  symbol: string;
  timeframe: string;
  prediction: {
    direction: 'UP' | 'DOWN' | 'SIDEWAYS';
    targetPrice: number;
    confidence: number;
    timeToTarget: number;
    factors: string[];
  };
  technicalAnalysis: {
    trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    support: number;
    resistance: number;
    momentum: number;
  };
  fundamentalAnalysis: {
    score: number;
    catalysts: string[];
    risks: string[];
  };
}

interface PortfolioAnalytics {
  portfolio: {
    totalValue: number;
    positions: any;
    cash: number;
    performance: {
      totalReturn: number;
      dailyReturn: number;
      sharpeRatio: number;
      maxDrawdown: number;
      winRate: number;
    };
  };
  activeSignals: TradingSignal[];
  strategies: AITradingStrategy[];
  predictions: PredictionModel[];
  riskMetrics: {
    valueAtRisk: number;
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
  };
}

export default function AITradingHub() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  // Queries
  const { data: marketData = [] } = useQuery<MarketData[]>({
    queryKey: ['/api/ai-trading/market-data'],
    refetchInterval: 5000
  });

  const { data: signals = [] } = useQuery<TradingSignal[]>({
    queryKey: ['/api/ai-trading/signals'],
    refetchInterval: 10000
  });

  const { data: strategies = [] } = useQuery<AITradingStrategy[]>({
    queryKey: ['/api/ai-trading/strategies']
  });

  const { data: portfolioAnalytics } = useQuery<PortfolioAnalytics>({
    queryKey: ['/api/ai-trading/portfolio'],
    refetchInterval: 30000
  });

  // Mutations
  const generatePredictionsMutation = useMutation({
    mutationFn: (symbols: string[]) => apiRequest("POST", "/api/ai-trading/predictions", { symbols }),
    onSuccess: () => {
      toast({
        title: "Predictions Generated",
        description: "AI market predictions updated successfully"
      });
    }
  });

  const toggleAutoTradingMutation = useMutation({
    mutationFn: (enable: boolean) => apiRequest("POST", "/api/ai-trading/auto-trading", { enable }),
    onSuccess: (data: any) => {
      setAutoTradingEnabled(data.enable || false);
      toast({
        title: data.enable ? "Auto-Trading Enabled" : "Auto-Trading Disabled",
        description: data.message
      });
    }
  });

  const optimizePortfolioMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/ai-trading/optimize", {}),
    onSuccess: (data: any) => {
      toast({
        title: "Portfolio Optimized",
        description: `Expected return: ${(data.expectedReturn * 100).toFixed(1)}%`
      });
    }
  });

  const updateStrategyMutation = useMutation({
    mutationFn: ({ name, active }: { name: string; active: boolean }) => 
      apiRequest("POST", `/api/ai-trading/strategy/${encodeURIComponent(name)}`, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-trading/strategies'] });
      toast({
        title: "Strategy Updated",
        description: "Trading strategy status changed"
      });
    }
  });

  const executeSignalMutation = useMutation({
    mutationFn: (signal: TradingSignal) => apiRequest("POST", "/api/ai-trading/execute", signal),
    onSuccess: (data: any) => {
      if (data.executed) {
        toast({
          title: "Trade Executed",
          description: `${data.quantity.toFixed(4)} tokens for $${data.totalValue.toFixed(2)}`
        });
      } else {
        toast({
          title: "Trade Not Executed",
          description: data.reason,
          variant: "destructive"
        });
      }
    }
  });

  const handleGeneratePredictions = () => {
    const symbols = marketData.slice(0, 4).map(data => data.symbol);
    generatePredictionsMutation.mutate(symbols);
  };

  const handleToggleAutoTrading = () => {
    toggleAutoTradingMutation.mutate(!autoTradingEnabled);
  };

  const handleOptimizePortfolio = () => {
    optimizePortfolioMutation.mutate();
  };

  const handleToggleStrategy = (strategyName: string, active: boolean) => {
    updateStrategyMutation.mutate({ name: strategyName, active });
  };

  const handleExecuteSignal = (signal: TradingSignal) => {
    executeSignalMutation.mutate(signal);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HIGH': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY': return <ArrowUpRight className="h-4 w-4 text-green-400" />;
      case 'SELL': return <ArrowDownRight className="h-4 w-4 text-red-400" />;
      case 'HOLD': return <Minus className="h-4 w-4 text-yellow-400" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UP': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'DOWN': return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'SIDEWAYS': return <Minus className="h-4 w-4 text-yellow-400" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const recentSignals = signals.slice(-10);
  const activeStrategies = strategies.filter(s => s.active);
  const portfolio = portfolioAnalytics?.portfolio;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Trading Algorithms Hub
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Sophisticated AI-powered trading algorithms with real-time signal generation, 
            autonomous execution, and advanced portfolio optimization.
          </p>
        </div>

        {/* Control Panel */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Cpu className="h-5 w-5" />
              AI Trading Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-trading"
                  checked={autoTradingEnabled}
                  onCheckedChange={handleToggleAutoTrading}
                  disabled={toggleAutoTradingMutation.isPending}
                />
                <Label htmlFor="auto-trading" className="text-white">
                  Auto Trading
                </Label>
                {autoTradingEnabled && <CheckCircle className="h-4 w-4 text-green-400" />}
              </div>

              <Button
                onClick={handleGeneratePredictions}
                disabled={generatePredictionsMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Generate Predictions
              </Button>

              <Button
                onClick={handleOptimizePortfolio}
                disabled={optimizePortfolioMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Target className="h-4 w-4 mr-2" />
                Optimize Portfolio
              </Button>

              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Risk Managed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">
                    {portfolio ? formatCurrency(portfolio.totalValue) : '$100,000'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Return</p>
                  <p className="text-2xl font-bold text-white">
                    {portfolio ? `${(portfolio.performance.totalReturn * 100).toFixed(1)}%` : '+31.2%'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Active Signals</p>
                  <p className="text-2xl font-bold text-white">{recentSignals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-400">Win Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {portfolio ? `${(portfolio.performance.winRate * 100).toFixed(1)}%` : '72.4%'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="signals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
            <TabsTrigger value="signals">Live Signals</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="market">Market Data</TabsTrigger>
          </TabsList>

          {/* Live Signals */}
          <TabsContent value="signals" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5" />
                  Real-Time Trading Signals
                </CardTitle>
                <CardDescription>
                  AI-generated trading signals with confidence scores and risk analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {recentSignals.map((signal) => (
                      <div key={signal.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getActionIcon(signal.action)}
                            <span className="font-semibold text-white">{signal.symbol}</span>
                            <Badge className={`${
                              signal.action === 'BUY' ? 'bg-green-500' : 
                              signal.action === 'SELL' ? 'bg-red-500' : 'bg-yellow-500'
                            } text-white`}>
                              {signal.action}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {signal.strategy}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">
                              {formatTime(signal.timestamp)}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleExecuteSignal(signal)}
                              disabled={executeSignalMutation.isPending}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Execute
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-400">Confidence</p>
                            <div className="flex items-center gap-2">
                              <Progress value={signal.confidence} className="flex-1" />
                              <span className="text-sm text-white">{signal.confidence.toFixed(0)}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Entry Price</p>
                            <p className="text-sm font-medium text-white">{formatCurrency(signal.entryPrice)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Target</p>
                            <p className="text-sm font-medium text-green-400">{formatCurrency(signal.targetPrice)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Risk/Reward</p>
                            <p className="text-sm font-medium text-white">{signal.riskReward.toFixed(2)}:1</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Reasoning</p>
                          <div className="flex flex-wrap gap-1">
                            {signal.reasoning.map((reason, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {recentSignals.length === 0 && (
                      <div className="text-center text-gray-400 py-12">
                        <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No trading signals generated yet</p>
                        <p className="text-sm">AI algorithms are analyzing market conditions</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategies */}
          <TabsContent value="strategies" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {strategies.map((strategy) => (
                <Card key={strategy.name} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{strategy.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskLevelColor(strategy.riskLevel)}>
                          {strategy.riskLevel}
                        </Badge>
                        <Switch
                          checked={strategy.active}
                          onCheckedChange={(active) => handleToggleStrategy(strategy.name, active)}
                          disabled={updateStrategyMutation.isPending}
                        />
                      </div>
                    </div>
                    <CardDescription>{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Target Return</p>
                        <p className="text-lg font-semibold text-white">
                          {(strategy.targetReturn * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Max Drawdown</p>
                        <p className="text-lg font-semibold text-white">
                          {(strategy.maxDrawdown * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Performance</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Trades:</span>
                          <span className="text-white">{strategy.performance.totalTrades}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Win Rate:</span>
                          <span className="text-white">
                            {((strategy.performance.winningTrades / strategy.performance.totalTrades) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Return:</span>
                          <span className="text-green-400">
                            {(strategy.performance.totalReturn * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sharpe:</span>
                          <span className="text-white">{strategy.performance.sharpeRatio.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Predictions */}
          <TabsContent value="predictions" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="h-5 w-5" />
                  AI Market Predictions
                </CardTitle>
                <CardDescription>
                  Machine learning predictions with technical and fundamental analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioAnalytics?.predictions?.map((prediction) => (
                    <div key={prediction.symbol} className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{prediction.symbol}</span>
                          {getDirectionIcon(prediction.prediction.direction)}
                        </div>
                        <Badge className={`${
                          prediction.prediction.direction === 'UP' ? 'bg-green-500' : 
                          prediction.prediction.direction === 'DOWN' ? 'bg-red-500' : 'bg-yellow-500'
                        } text-white`}>
                          {prediction.prediction.direction}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-400">Target Price</p>
                          <p className="text-sm font-medium text-white">
                            {formatCurrency(prediction.prediction.targetPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Confidence</p>
                          <div className="flex items-center gap-2">
                            <Progress value={prediction.prediction.confidence} className="flex-1" />
                            <span className="text-xs text-white">
                              {prediction.prediction.confidence.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-400">Key Factors</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prediction.prediction.factors.slice(0, 3).map((factor, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="col-span-2 text-center text-gray-400 py-8">
                      <Button
                        onClick={handleGeneratePredictions}
                        disabled={generatePredictionsMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Generate AI Predictions
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5" />
                    Portfolio Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-400">Total Value</p>
                      <p className="text-xl font-bold text-white">
                        {portfolio ? formatCurrency(portfolio.totalValue) : formatCurrency(100000)}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-400">Available Cash</p>
                      <p className="text-xl font-bold text-white">
                        {portfolio ? formatCurrency(portfolio.cash) : formatCurrency(100000)}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-400">Daily Return</p>
                      <p className="text-xl font-bold text-green-400">
                        {portfolio ? `${(portfolio.performance.dailyReturn * 100).toFixed(2)}%` : '+2.34%'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-400">Sharpe Ratio</p>
                      <p className="text-xl font-bold text-white">
                        {portfolio ? portfolio.performance.sharpeRatio.toFixed(2) : '2.14'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="h-5 w-5" />
                    Risk Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolioAnalytics?.riskMetrics && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Value at Risk (5%)</span>
                        <span className="text-white">
                          {formatCurrency(portfolioAnalytics.riskMetrics.valueAtRisk)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Drawdown</span>
                        <span className="text-white">
                          {(portfolioAnalytics.riskMetrics.maxDrawdown * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Volatility</span>
                        <span className="text-white">
                          {(portfolioAnalytics.riskMetrics.volatility * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sharpe Ratio</span>
                        <span className="text-white">
                          {portfolioAnalytics.riskMetrics.sharpeRatio.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Market Data */}
          <TabsContent value="market" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5" />
                  Real-Time Market Data
                </CardTitle>
                <CardDescription>
                  Live market data with technical indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketData.map((data) => (
                    <div key={data.symbol} className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-white">{data.symbol}</span>
                        <Badge className={data.change24h >= 0 ? 'bg-green-500' : 'bg-red-500'}>
                          {data.change24h >= 0 ? '+' : ''}{(data.change24h * 100).toFixed(2)}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Price:</span>
                          <span className="text-white font-medium">{formatCurrency(data.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">RSI:</span>
                          <span className="text-white">{data.rsi.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Volume:</span>
                          <span className="text-white">
                            ${(data.volume / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Market Cap:</span>
                          <span className="text-white">
                            ${(data.marketCap / 1000000000).toFixed(1)}B
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}