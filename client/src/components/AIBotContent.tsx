import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Bot, TrendingUp, TrendingDown, Play, Pause, Settings, Activity, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { AITrade } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export function AIBotContent() {
  const { user } = useAuth();
  
  const { data: aiTrades = [] } = useQuery<AITrade[]>({
    queryKey: ['/api/ai/trades'],
    enabled: !!user,
  });

  const { data: botStatus } = useQuery({
    queryKey: ['/api/ai/status'],
    enabled: !!user,
  });

  const handleStartBot = () => {
    console.log('AI bot start functionality - to be implemented');
  };

  const handleStopBot = () => {
    console.log('AI bot stop functionality - to be implemented');
  };

  const handleConfigureStrategy = () => {
    console.log('AI strategy configuration - to be implemented');
  };

  return (
    <div className="space-y-6">
      {/* AI Bot Status Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/20 to-cyan-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Bot Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-white font-medium">INACTIVE</span>
                </div>
              </div>
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Trades</p>
                <p className="text-2xl font-bold text-white">{aiTrades.length}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold text-white">0%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total P&L</p>
                <p className="text-2xl font-bold text-white">$0.00</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bot Controls */}
        <div className="lg:col-span-2 space-y-6">
          {user ? (
            <>
              <Card className="bg-gray-900/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-purple-400" />
                    AI Trading Bot Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Automated Trading</p>
                      <p className="text-sm text-gray-400">Let AI handle your trades automatically</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch disabled />
                      <Button size="sm" onClick={handleStartBot} className="bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Trading Strategy</Label>
                      <Select disabled>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservative">Conservative</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Risk Level</Label>
                      <Select disabled>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Risk</SelectItem>
                          <SelectItem value="medium">Medium Risk</SelectItem>
                          <SelectItem value="high">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Maximum Investment Amount</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter amount in USD"
                      className="bg-gray-800 border-gray-600 text-white"
                      disabled
                    />
                  </div>

                  <Button 
                    onClick={handleConfigureStrategy} 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Advanced Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Performance Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No performance data available</p>
                      <p className="text-sm text-gray-500 mt-1">Start AI trading to see performance charts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-gray-900/50 border-gray-700/50">
              <CardContent className="p-8 text-center">
                <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">AI Trading Bot</h3>
                <p className="text-gray-400 mb-4">
                  Login to access advanced AI-powered trading features and automation.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Trades & Settings */}
        <div className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-400" />
                Recent Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aiTrades.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">No trades executed yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {aiTrades.slice(0, 5).map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{trade.pair}</p>
                        <p className="text-sm text-gray-400">{trade.strategy}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">{formatDistanceToNow(trade.createdAt)} ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-cyan-400" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Stop Loss</span>
                <span className="text-gray-400">5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Take Profit</span>
                <span className="text-gray-400">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Max Daily Trades</span>
                <span className="text-gray-400">10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Trading Pairs</span>
                <span className="text-gray-400">BTC, ETH, SOL</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bot className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">No AI insights available</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}