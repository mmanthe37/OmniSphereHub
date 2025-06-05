import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/lib/websocket";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wallet, 
  TrendingUp, 
  Coins, 
  Bot,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { formatCurrency, formatPercentage, getTimeAgo } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function DashboardOverview() {
  const [priceData, setPriceData] = useState<any[]>([]);
  const { lastMessage } = useWebSocket("/ws");

  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolio/1"],
  });

  const { data: holdings = [] } = useQuery({
    queryKey: ["/api/portfolio/1"],
    select: (data: any) => data?.holdings || [],
  });

  const { data: aiTrades } = useQuery({
    queryKey: ["/api/ai-trades/1"],
  });

  useEffect(() => {
    if (lastMessage?.type === "priceUpdate") {
      setPriceData(lastMessage.data);
    }
  }, [lastMessage]);

  // Portfolio performance chart data from authentic sources
  const chartData = portfolio?.performanceHistory || [];

  const getTokenIcon = (symbol: string) => {
    const icons: Record<string, string> = {
      BTC: "₿",
      ETH: "Ξ", 
      SOL: "◎"
    };
    return icons[symbol] || symbol[0];
  };

  const getTokenColor = (symbol: string) => {
    const colors: Record<string, string> = {
      BTC: "bg-orange-500",
      ETH: "bg-blue-500",
      SOL: "bg-purple-500"
    };
    return colors[symbol] || "bg-gray-500";
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-dark-card border-dark-border hover:shadow-neon transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Portfolio</p>
                <p className="text-2xl font-bold font-mono">
                  {portfolio ? formatCurrency(portfolio.totalValue) : "$0.00"}
                </p>
                <p className="text-neon-green text-sm flex items-center">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +12.5%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full flex items-center justify-center">
                <Wallet className="text-white w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border hover:shadow-neon-green transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">24h PnL</p>
                <p className="text-2xl font-bold font-mono text-neon-green">
                  {portfolio ? `+${formatCurrency(portfolio.dailyPnl)}` : "+$0.00"}
                </p>
                <p className="text-neon-green text-sm">Active trades: 12</p>
              </div>
              <div className="w-12 h-12 bg-neon-green bg-opacity-20 rounded-full flex items-center justify-center">
                <TrendingUp className="text-neon-green w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border hover:shadow-neon-purple transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Staking Rewards</p>
                <p className="text-2xl font-bold font-mono">$1,247.89</p>
                <p className="text-neon-purple text-sm">APY: 18.5%</p>
              </div>
              <div className="w-12 h-12 bg-neon-purple bg-opacity-20 rounded-full flex items-center justify-center">
                <Coins className="text-neon-purple w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border hover:shadow-neon transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">AI Bot Status</p>
                <p className="text-2xl font-bold font-mono text-neon-cyan">ACTIVE</p>
                <p className="text-neon-cyan text-sm">Win rate: 73%</p>
              </div>
              <div className="w-12 h-12 bg-neon-cyan bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="text-neon-cyan w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#B8BCC8' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#B8BCC8' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#2A2D47',
                      border: '1px solid #404469',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                    formatter={(value: any) => [formatCurrency(value), 'Portfolio Value']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00D2FF" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: '#00D2FF' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Holdings</h3>
            <div className="space-y-4">
              {holdings?.map((holding: any) => (
                <div key={holding.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${getTokenColor(holding.symbol)} rounded-full flex items-center justify-center`}>
                      <span className="text-xs font-bold text-white">
                        {getTokenIcon(holding.symbol)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{holding.symbol}</p>
                      <p className="text-sm text-text-secondary">{holding.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-medium">{formatCurrency(holding.value)}</p>
                    <p className={`text-sm ${parseFloat(holding.change24h) >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                      {formatPercentage(holding.change24h)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-dark-card border-dark-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-primary rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-neon-green bg-opacity-20 rounded-full flex items-center justify-center">
                  <ArrowUp className="text-neon-green w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Buy ETH</p>
                  <p className="text-sm text-text-secondary">2 minutes ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-medium">+2.5 ETH</p>
                <p className="text-sm text-text-secondary">@ $2,487.32</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-primary rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-neon-purple bg-opacity-20 rounded-full flex items-center justify-center">
                  <Coins className="text-neon-purple w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Staking Reward</p>
                  <p className="text-sm text-text-secondary">1 hour ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-medium text-neon-purple">+147.23 USDC</p>
                <p className="text-sm text-text-secondary">Pool: ETH-USDC</p>
              </div>
            </div>

            {aiTrades && aiTrades.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-dark-primary rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-neon-cyan bg-opacity-20 rounded-full flex items-center justify-center">
                    <Bot className="text-neon-cyan w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">AI Bot Trade</p>
                    <p className="text-sm text-text-secondary">
                      {getTimeAgo(new Date(aiTrades[0].createdAt))}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-medium ${parseFloat(aiTrades[0].profit) >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                    {parseFloat(aiTrades[0].profit) >= 0 ? '+' : ''}{formatCurrency(aiTrades[0].profit)}
                  </p>
                  <p className="text-sm text-text-secondary">{aiTrades[0].symbol}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
