import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/lib/websocket";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bot, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, getTimeAgo } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function BotDashboard() {
  const [botSettings, setBotSettings] = useState({
    riskLevel: "Moderate",
    maxPosition: "25%",
    stopLoss: "5%",
    takeProfit: "15%",
    autoTrading: true,
  });
  const [aiTrades, setAiTrades] = useState<any[]>([]);
  const { lastMessage } = useWebSocket("/ws");

  const { data: trades = [] } = useQuery({
    queryKey: ["/api/ai-trades/1"],
  });

  useEffect(() => {
    if (lastMessage?.type === "aiTrade") {
      setAiTrades(prev => [lastMessage.data, ...prev.slice(0, 9)]);
    }
  }, [lastMessage]);

  // Mock performance chart data
  const performanceData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    performance: 100 + (i * 5) + Math.random() * 50,
  }));

  const botStats = {
    winRate: "73.2%",
    totalTrades: "1,247",
    dailyProfit: "+$2,847.89",
    totalReturn: "+847.2%",
    maxDrawdown: "-5.8%",
  };

  const activeStrategies = [
    { name: "Arbitrage", performance: "+23.4%", active: true },
    { name: "Mean Reversion", performance: "+18.7%", active: true },
    { name: "Momentum", performance: "-2.1%", active: false },
  ];

  const allTrades = [...aiTrades, ...trades].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bot Performance */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">AI Trading Bot Performance</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
                <span className="text-neon-green font-medium">ACTIVE</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#B8BCC8' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#B8BCC8' }}
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#2A2D47',
                      border: '1px solid #404469',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                    formatter={(value: any) => [`${value.toFixed(1)}%`, 'Performance']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="#9945FF" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: '#9945FF' }}
                    fill="url(#performanceGradient)"
                  />
                  <defs>
                    <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9945FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9945FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Bot Trades */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent AI Trades</h3>
            <div className="space-y-4">
              {allTrades.slice(0, 10).map((trade, index) => (
                <div key={trade.id || index} className="flex items-center justify-between p-4 bg-dark-primary rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      parseFloat(trade.profit) >= 0 
                        ? "bg-neon-cyan bg-opacity-20" 
                        : "bg-red-500 bg-opacity-20"
                    }`}>
                      <Bot className={`w-5 h-5 ${
                        parseFloat(trade.profit) >= 0 ? "text-neon-cyan" : "text-red-400"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{trade.symbol}</p>
                      <p className="text-sm text-text-secondary">{trade.strategy}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-medium ${
                      parseFloat(trade.profit) >= 0 ? "text-neon-green" : "text-red-400"
                    }`}>
                      {parseFloat(trade.profit) >= 0 ? "+" : ""}{formatCurrency(trade.profit)}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {getTimeAgo(new Date(trade.createdAt))}
                    </p>
                  </div>
                </div>
              ))}
              {allTrades.length === 0 && (
                <p className="text-text-secondary text-center py-4">No AI trades yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bot Settings & Stats */}
      <div className="space-y-6">
        {/* Bot Stats */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Bot Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-text-secondary">Win Rate</span>
                <span className="font-mono font-bold text-neon-green">{botStats.winRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Trades</span>
                <span className="font-mono font-bold">{botStats.totalTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Profit Today</span>
                <span className="font-mono font-bold text-neon-green">{botStats.dailyProfit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Return</span>
                <span className="font-mono font-bold text-neon-cyan">{botStats.totalReturn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Max Drawdown</span>
                <span className="font-mono font-bold text-red-400">{botStats.maxDrawdown}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Bot Settings */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Bot Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-text-secondary block mb-2">Risk Level</Label>
                <Select value={botSettings.riskLevel} onValueChange={(value) => 
                  setBotSettings(prev => ({ ...prev, riskLevel: value }))
                }>
                  <SelectTrigger className="bg-dark-primary border-dark-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conservative">Conservative</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm text-text-secondary block mb-2">Max Position Size</Label>
                <Input 
                  type="text" 
                  value={botSettings.maxPosition}
                  onChange={(e) => setBotSettings(prev => ({ ...prev, maxPosition: e.target.value }))}
                  className="bg-dark-primary border-dark-border font-mono"
                />
              </div>
              
              <div>
                <Label className="text-sm text-text-secondary block mb-2">Stop Loss</Label>
                <Input 
                  type="text" 
                  value={botSettings.stopLoss}
                  onChange={(e) => setBotSettings(prev => ({ ...prev, stopLoss: e.target.value }))}
                  className="bg-dark-primary border-dark-border font-mono"
                />
              </div>
              
              <div>
                <Label className="text-sm text-text-secondary block mb-2">Take Profit</Label>
                <Input 
                  type="text" 
                  value={botSettings.takeProfit}
                  onChange={(e) => setBotSettings(prev => ({ ...prev, takeProfit: e.target.value }))}
                  className="bg-dark-primary border-dark-border font-mono"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-text-secondary">Auto Trading</Label>
                <Switch 
                  checked={botSettings.autoTrading}
                  onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, autoTrading: checked }))}
                />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan hover:shadow-neon">
                Update Settings
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Active Strategies */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Active Strategies</h3>
            <div className="space-y-3">
              {activeStrategies.map((strategy) => (
                <div key={strategy.name} className="flex items-center justify-between p-3 bg-dark-primary rounded-lg">
                  <div>
                    <p className="font-medium">{strategy.name}</p>
                    <p className={`text-sm ${
                      parseFloat(strategy.performance) >= 0 ? "text-neon-green" : "text-red-400"
                    }`}>
                      {strategy.performance}
                    </p>
                  </div>
                  <Switch checked={strategy.active} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
