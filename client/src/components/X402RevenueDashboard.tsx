import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Bot,
  Zap,
  Target,
  Crown,
  Gift,
  Signal,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface RevenueMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  activeSubscribers: number;
  avgRevenuePerUser: number;
  conversionRate: number;
}

interface RevenueStream {
  name: string;
  current: number;
  target: number;
  growth: number;
  icon: any;
  color: string;
  description: string;
}

interface Transaction {
  id: string;
  type: 'subscription' | 'tip' | 'signal' | 'nft';
  amount: number;
  user: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export function X402RevenueDashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalRevenue: 148750,
    monthlyGrowth: 23.5,
    activeSubscribers: 3247,
    avgRevenuePerUser: 45.80,
    conversionRate: 12.3
  });

  const revenueStreams: RevenueStream[] = [
    {
      name: 'Premium Subscriptions',
      current: 67500,
      target: 150000,
      growth: 28.4,
      icon: Crown,
      color: 'text-purple-400',
      description: 'Pro and Elite trading subscriptions'
    },
    {
      name: 'Trading Signal Sales',
      current: 34200,
      target: 75000,
      growth: 45.2,
      icon: Signal,
      color: 'text-green-400',
      description: 'Premium AI-generated trading signals'
    },
    {
      name: 'Creator Tips & Donations',
      current: 23800,
      target: 50000,
      growth: 18.7,
      icon: Gift,
      color: 'text-pink-400',
      description: 'User tips to content creators'
    },
    {
      name: 'AI Bot Licensing',
      current: 23250,
      target: 60000,
      growth: 31.9,
      icon: Bot,
      color: 'text-cyan-400',
      description: 'Custom bot strategies and licensing'
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: 'tx_001',
      type: 'subscription',
      amount: 99.99,
      user: 'trader_elite_42',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'completed'
    },
    {
      id: 'tx_002',
      type: 'signal',
      amount: 1.50,
      user: 'crypto_wolf_88',
      timestamp: new Date(Date.now() - 1000 * 60 * 32),
      status: 'completed'
    },
    {
      id: 'tx_003',
      type: 'tip',
      amount: 5.00,
      user: 'defi_master_21',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'completed'
    },
    {
      id: 'tx_004',
      type: 'subscription',
      amount: 29.99,
      user: 'trader_pro_155',
      timestamp: new Date(Date.now() - 1000 * 60 * 67),
      status: 'pending'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'subscription': return Crown;
      case 'signal': return Signal;
      case 'tip': return Gift;
      case 'nft': return Target;
      default: return DollarSign;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(metrics.totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
                  <span className="text-green-400 text-xs">+{metrics.monthlyGrowth}%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Subscribers</p>
                <p className="text-2xl font-bold text-white">{metrics.activeSubscribers.toLocaleString()}</p>
                <p className="text-purple-400 text-xs">Premium users</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">ARPU</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(metrics.avgRevenuePerUser)}</p>
                <p className="text-blue-400 text-xs">Avg per user</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">{metrics.conversionRate}%</p>
                <p className="text-orange-400 text-xs">Free to paid</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">X402 Protocol</p>
                <p className="text-2xl font-bold text-white">Active</p>
                <p className="text-yellow-400 text-xs">Ultra-low fees</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Streams */}
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
            Revenue Streams Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {revenueStreams.map((stream, index) => {
            const Icon = stream.icon;
            const percentage = (stream.current / stream.target) * 100;
            
            return (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${stream.color}`} />
                    <div>
                      <h4 className="font-semibold text-white">{stream.name}</h4>
                      <p className="text-sm text-gray-400">{stream.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{formatCurrency(stream.current)}</p>
                    <div className="flex items-center">
                      <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">+{stream.growth}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress to target</span>
                    <span className="text-white">{formatCurrency(stream.target)}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-gray-400">{percentage.toFixed(1)}% of target achieved</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600">
            Recent Transactions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="projections" className="data-[state=active]:bg-purple-600">
            Projections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-400" />
                Real-time X402 Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx) => {
                  const Icon = getTransactionIcon(tx.type);
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="font-medium text-white capitalize">{tx.type} Payment</p>
                          <p className="text-sm text-gray-400">from {tx.user}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{formatCurrency(tx.amount)}</p>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(tx.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
                <p className="text-gray-400 mb-4">
                  Detailed revenue breakdowns, user behavior analysis, and performance metrics.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Full Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections">
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Revenue Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Q1 2025 Projections</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subscription Revenue</span>
                      <span className="text-white font-medium">$425,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Signal Sales</span>
                      <span className="text-white font-medium">$180,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Creator Economy</span>
                      <span className="text-white font-medium">$95,000</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex justify-between">
                        <span className="text-white font-semibold">Total Projected</span>
                        <span className="text-green-400 font-bold">$700,000</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Growth Targets</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">User Growth</span>
                        <span className="text-white">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Revenue Growth</span>
                        <span className="text-white">120%</span>
                      </div>
                      <Progress value={120} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Market Expansion</span>
                        <span className="text-white">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}