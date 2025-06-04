import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, Coins, Bot, Star, Image, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDistanceToNow } from "date-fns";
import type { CryptoPrice, PortfolioData } from "@/types";

interface DashboardOverviewProps {
  cryptoPrices: CryptoPrice[];
}

// Mock chart data for portfolio performance
const portfolioChartData = [
  { month: 'Jan', value: 65000 },
  { month: 'Feb', value: 75000 },
  { month: 'Mar', value: 68000 },
  { month: 'Apr', value: 85000 },
  { month: 'May', value: 92000 },
  { month: 'Jun', value: 127582 },
];

// Mock activity data
const recentActivity = [
  {
    id: 1,
    action: "Buy ETH",
    amount: "+2.5 ETH",
    price: "@ $2,487.32",
    time: "2 minutes ago",
    type: "buy",
    icon: TrendingUp,
  },
  {
    id: 2,
    action: "Staking Reward",
    amount: "+147.23 USDC",
    pool: "Pool: ETH-USDC",
    time: "1 hour ago",
    type: "reward",
    icon: Coins,
  },
  {
    id: 3,
    action: "AI Bot Trade",
    profit: "+$1,247.89",
    pair: "SOL/USDT",
    time: "3 hours ago",
    type: "bot",
    icon: Bot,
  },
];

export function DashboardOverview({ cryptoPrices }: DashboardOverviewProps) {
  const { data: portfolio } = useQuery<PortfolioData>({
    queryKey: ['/api/portfolio/1'],
  });

  // Get top holdings from crypto prices
  const topHoldings = cryptoPrices.slice(0, 3).map((crypto, index) => ({
    ...crypto,
    amount: index === 0 ? 2.847 : index === 1 ? 15.23 : 245.8,
    value: index === 0 ? 67420 : index === 1 ? 39847 : 18742,
  }));

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-dark-card border-dark-border hover:neon-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">Total Portfolio</p>
                <p className="text-3xl font-bold font-mono bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  ${portfolio?.totalValue.toLocaleString() || "127,582.45"}
                </p>
                <p className="text-emerald-400 text-sm font-medium flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +12.5%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border hover:neon-glow-green transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">24h PnL</p>
                <p className="text-3xl font-bold font-mono bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  +${portfolio?.dailyPnl.toLocaleString() || "2,847.33"}
                </p>
                <p className="text-green-400 text-sm font-medium">Active trades: 12</p>
              </div>
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border hover:neon-glow-purple transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">Staking Rewards</p>
                <p className="text-3xl font-bold font-mono bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ${portfolio?.stakingRewards.toLocaleString() || "1,247.89"}
                </p>
                <p className="text-purple-400 text-sm font-medium">APY: 18.5%</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border hover:neon-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">Content Earnings</p>
                <p className="text-3xl font-bold font-mono bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">$3,247</p>
                <p className="text-cyan-400 text-sm font-medium">Creator rating: 4.8★</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Chart */}
        <Card className="lg:col-span-2 bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4 tracking-tight">Portfolio Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={portfolioChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dark-border))" />
                <XAxis dataKey="month" stroke="hsl(var(--text-secondary))" />
                <YAxis stroke="hsl(var(--text-secondary))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--dark-card))',
                    border: '1px solid hsl(var(--dark-border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--neon-cyan))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--neon-cyan))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Holdings */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4 tracking-tight">Top Holdings</h3>
            <div className="space-y-4">
              {topHoldings.map((holding) => (
                <div key={holding.symbol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      holding.symbol === 'BTC' ? 'bg-orange-500' :
                      holding.symbol === 'ETH' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      <span className="text-xs font-bold">
                        {holding.symbol === 'BTC' ? '₿' : holding.symbol === 'ETH' ? 'Ξ' : '◎'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{holding.symbol}</p>
                      <p className="text-sm text-text-secondary">{holding.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-medium">${holding.value.toLocaleString()}</p>
                    <p className={`text-sm ${holding.change24h >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                      {holding.change24h >= 0 ? '+' : ''}{holding.change24h.toFixed(1)}%
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
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-dark-primary rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'buy' ? 'bg-neon-green bg-opacity-20' :
                      activity.type === 'reward' ? 'bg-neon-purple bg-opacity-20' :
                      'bg-neon-cyan bg-opacity-20'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        activity.type === 'buy' ? 'text-neon-green' :
                        activity.type === 'reward' ? 'text-neon-purple' :
                        'text-neon-cyan'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-text-secondary">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-medium">
                      {activity.amount || activity.profit}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {activity.price || activity.pool || activity.pair}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
