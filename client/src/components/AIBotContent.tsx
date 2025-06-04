import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Bot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { AITrade } from "@/types";

// Mock bot performance data
const botPerformanceData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  performance: 100 + (i * 5) + Math.random() * 50,
}));

const botStats = {
  winRate: 73.2,
  totalTrades: 1247,
  dailyProfit: 2847.89,
  totalReturn: 847.2,
  maxDrawdown: -5.8,
};

const activeStrategies = [
  { name: "Arbitrage", performance: "+23.4%", enabled: true },
  { name: "Mean Reversion", performance: "+18.7%", enabled: true },
  { name: "Momentum", performance: "-2.1%", enabled: false },
];

export function AIBotContent() {
  const { data: trades = [] } = useQuery<AITrade[]>({
    queryKey: ['/api/ai-trades'],
  });

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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={botPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dark-border))" />
                <XAxis dataKey="day" stroke="hsl(var(--text-secondary))" />
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
                  dataKey="performance" 
                  stroke="hsl(var(--neon-purple))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--neon-purple))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Recent Bot Trades */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent AI Trades</h3>
            <div className="space-y-4">
              {trades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 bg-dark-primary rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      trade.profit > 0 
                        ? 'bg-neon-green bg-opacity-20' 
                        : 'bg-red-500 bg-opacity-20'
                    }`}>
                      <Bot className={`w-5 h-5 ${
                        trade.profit > 0 ? 'text-neon-green' : 'text-red-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{trade.pair}</p>
                      <p className="text-sm text-text-secondary">{trade.strategy}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-medium ${
                      trade.profit > 0 ? 'text-neon-green' : 'text-red-400'
                    }`}>
                      {trade.profit > 0 ? '+' : ''}${trade.profit.toFixed(2)}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
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
                <span className="font-mono font-bold text-neon-green">
                  {botStats.winRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Trades</span>
                <span className="font-mono font-bold">
                  {botStats.totalTrades.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Profit Today</span>
                <span className="font-mono font-bold text-neon-green">
                  +${botStats.dailyProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Return</span>
                <span className="font-mono font-bold text-neon-cyan">
                  +{botStats.totalReturn}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Max Drawdown</span>
                <span className="font-mono font-bold text-red-400">
                  {botStats.maxDrawdown}%
                </span>
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
                <Label className="text-sm text-text-secondary">Risk Level</Label>
                <Select defaultValue="moderate">
                  <SelectTrigger className="bg-dark-primary border-dark-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-primary border-dark-border">
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm text-text-secondary">Max Position Size</Label>
                <Input 
                  defaultValue="25%" 
                  className="bg-dark-primary border-dark-border font-mono"
                />
              </div>
              
              <div>
                <Label className="text-sm text-text-secondary">Stop Loss</Label>
                <Input 
                  defaultValue="5%" 
                  className="bg-dark-primary border-dark-border font-mono"
                />
              </div>
              
              <div>
                <Label className="text-sm text-text-secondary">Take Profit</Label>
                <Input 
                  defaultValue="15%" 
                  className="bg-dark-primary border-dark-border font-mono"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Auto Trading</span>
                <Switch defaultChecked />
              </div>
              
              <Button className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:neon-glow transition-all duration-200">
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
              {activeStrategies.map((strategy, index) => (
                <div key={strategy.name} className="flex items-center justify-between p-3 bg-dark-primary rounded-lg">
                  <div>
                    <p className="font-medium">{strategy.name}</p>
                    <p className={`text-sm ${
                      strategy.performance.startsWith('+') ? 'text-neon-green' :
                      strategy.performance.startsWith('-') ? 'text-red-400' : 'text-neon-purple'
                    }`}>
                      {strategy.performance}
                    </p>
                  </div>
                  <Switch defaultChecked={strategy.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
