import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, TrendingDown, Coins, Bot, Star, DollarSign, ArrowUp, Eye, ExternalLink, Layers, RefreshCw, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { CryptoPrice, PortfolioData } from "@/types";

interface DashboardOverviewProps {
  cryptoPrices: CryptoPrice[];
}

// Portfolio allocation data for pie chart
const portfolioAllocation = [
  { name: 'Bitcoin', value: 45, amount: 67420, color: '#F59E0B' },
  { name: 'Ethereum', value: 30, amount: 39847, color: '#8B5CF6' },
  { name: 'Solana', value: 15, amount: 18742, color: '#14F195' },
  { name: 'Other', value: 10, amount: 12573, color: '#6B7280' },
];

// Performance data for line chart
const performanceData = [
  { time: '6h ago', value: 125200, change: 2.1 },
  { time: '5h ago', value: 126800, change: 1.3 },
  { time: '4h ago', value: 124900, change: -1.5 },
  { time: '3h ago', value: 127100, change: 1.8 },
  { time: '2h ago', value: 128300, change: 0.9 },
  { time: '1h ago', value: 127900, change: -0.3 },
  { time: 'Now', value: 127582, change: -0.2 },
];

// Transaction history data
const transactionHistory = [
  {
    id: 1,
    type: "buy",
    asset: "ETH",
    amount: "2.5",
    price: 2487.32,
    total: 6218.30,
    time: new Date(Date.now() - 2 * 60 * 1000),
    status: "completed",
    hash: "0x742d35cc6eb59b3e4746ac5e",
  },
  {
    id: 2,
    type: "stake",
    asset: "ETH",
    amount: "5.0",
    apy: 4.2,
    reward: 147.23,
    time: new Date(Date.now() - 60 * 60 * 1000),
    status: "active",
    pool: "ETH-USDC",
  },
  {
    id: 3,
    type: "bot_trade",
    pair: "SOL/USDT",
    entry: 98.45,
    exit: 101.23,
    profit: 1247.89,
    time: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "completed",
    strategy: "Grid Trading",
  },
  {
    id: 4,
    type: "sell",
    asset: "BTC",
    amount: "0.25",
    price: 43280.50,
    total: 10820.13,
    time: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "completed",
    hash: "0x9f2c84aa7b1d4e8c9543df12",
  },
];

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'buy': return TrendingUp;
    case 'sell': return TrendingDown;
    case 'stake': return Coins;
    case 'bot_trade': return Bot;
    default: return Activity;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-400';
    case 'active': return 'text-blue-400';
    case 'pending': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

export function DashboardOverview({ cryptoPrices }: DashboardOverviewProps) {
  const { data: portfolio } = useQuery<PortfolioData>({
    queryKey: ['/api/portfolio/1'],
  });

  const handleViewTransaction = (hash?: string) => {
    if (hash) {
      window.open(`https://etherscan.io/tx/${hash}`, '_blank');
    }
  };

  const handleRefreshPortfolio = () => {
    console.log('Refreshing portfolio...');
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-400 text-sm font-inter font-medium tracking-wide uppercase">Total Portfolio</p>
                <p className="text-2xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  ${portfolio?.totalValue.toLocaleString() || "127,582.45"}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-emerald-400 text-sm font-medium flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    +12.5%
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshPortfolio}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-inter font-medium tracking-wide uppercase">24h PnL</p>
                <p className="text-2xl font-bold font-orbitron bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  +${portfolio?.dailyPnl.toLocaleString() || "2,847.33"}
                </p>
                <p className="text-green-400 text-sm font-inter font-medium">Active trades: 12</p>
              </div>
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-inter font-medium tracking-wide uppercase">Staking Rewards</p>
                <p className="text-2xl font-bold font-orbitron bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ${portfolio?.stakingRewards.toLocaleString() || "1,247.89"}
                </p>
                <p className="text-purple-400 text-sm font-inter font-medium">APY: 18.5%</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center shadow-lg">
                <Coins className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-inter font-medium tracking-wide uppercase">Content Earnings</p>
                <p className="text-2xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">$3,247</p>
                <p className="text-cyan-400 text-sm font-inter font-medium">Creator rating: 4.8★</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500 bg-opacity-20 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Performance and Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance Chart */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#06B6D4" 
                  strokeWidth={3}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#06B6D4', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Portfolio Allocation */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Portfolio Allocation</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => console.log('Rebalance portfolio')}>
                <Layers className="w-4 h-4 mr-2" />
                Rebalance
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={portfolioAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {portfolioAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Allocation']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {portfolioAllocation.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono">${item.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Overview */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Holdings Overview</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => console.log('View all holdings')}>
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cryptoPrices.slice(0, 3).map((crypto, index) => {
              const amount = index === 0 ? 2.847 : index === 1 ? 15.23 : 245.8;
              const value = index === 0 ? 67420 : index === 1 ? 39847 : 18742;
              return (
                <div key={crypto.symbol} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        crypto.symbol === 'BTC' ? 'bg-orange-500/20 text-orange-400' :
                        crypto.symbol === 'ETH' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        <span className="font-bold">
                          {crypto.symbol === 'BTC' ? '₿' : crypto.symbol === 'ETH' ? 'Ξ' : '◎'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{crypto.symbol}</p>
                        <p className="text-sm text-gray-400">{crypto.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Amount</span>
                      <span className="font-mono">{amount} {crypto.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Value</span>
                      <span className="font-mono font-medium">${value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">24h Change</span>
                      <span className={`font-mono ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => console.log('View all transactions')}>
              <Activity className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactionHistory.map((transaction) => {
              const Icon = getTransactionIcon(transaction.type);
              const statusColor = getStatusColor(transaction.status);
              
              return (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                      transaction.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                      transaction.type === 'stake' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">
                          {transaction.type === 'buy' && `Buy ${transaction.asset}`}
                          {transaction.type === 'sell' && `Sell ${transaction.asset}`}
                          {transaction.type === 'stake' && `Stake ${transaction.asset}`}
                          {transaction.type === 'bot_trade' && `AI Trade: ${transaction.pair}`}
                        </p>
                        <span className={`px-2 py-1 text-xs rounded-full ${statusColor} bg-opacity-20`}>
                          {transaction.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{formatTimeAgo(transaction.time)}</p>
                      {transaction.type === 'stake' && (
                        <p className="text-xs text-purple-400">Pool: {transaction.pool} • APY: {transaction.apy}%</p>
                      )}
                      {transaction.type === 'bot_trade' && (
                        <p className="text-xs text-cyan-400">Strategy: {transaction.strategy}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div>
                        {transaction.type === 'buy' || transaction.type === 'sell' ? (
                          <>
                            <p className="font-mono font-medium">
                              {transaction.amount} {transaction.asset}
                            </p>
                            <p className="text-sm text-gray-400">
                              ${transaction.total?.toLocaleString()}
                            </p>
                          </>
                        ) : transaction.type === 'stake' ? (
                          <>
                            <p className="font-mono font-medium text-purple-400">
                              +${transaction.reward?.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-400">
                              {transaction.amount} {transaction.asset} staked
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-mono font-medium text-green-400">
                              +${transaction.profit?.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-400">
                              {transaction.entry} → {transaction.exit}
                            </p>
                          </>
                        )}
                      </div>
                      {transaction.hash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTransaction(transaction.hash)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
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