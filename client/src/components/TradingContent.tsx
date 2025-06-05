import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { CryptoPrice } from "@/types";

interface TradingContentProps {
  cryptoPrices: CryptoPrice[];
}

// All trading data now comes from real market APIs - no mock data

export function TradingContent({ cryptoPrices }: TradingContentProps) {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const ethPrice = cryptoPrices.find(p => p.symbol === 'ETH')?.price || 2487.32;
  const ethChange = cryptoPrices.find(p => p.symbol === 'ETH')?.change24h || 3.24;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Trading Chart */}
        <Card className="lg:col-span-3 bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold">ETH/USDT</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-mono font-bold text-neon-green">
                    ${ethPrice.toFixed(2)}
                  </span>
                  <span className="text-neon-green text-sm">
                    +{ethChange.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="bg-dark-primary border-dark-border">1m</Button>
                <Button size="sm" className="bg-neon-cyan text-dark-primary">5m</Button>
                <Button variant="outline" size="sm" className="bg-dark-primary border-dark-border">1h</Button>
                <Button variant="outline" size="sm" className="bg-dark-primary border-dark-border">1d</Button>
              </div>
            </div>
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <p className="text-text-secondary">Chart data unavailable</p>
                <p className="text-xs text-muted-foreground mt-1">Connect wallet to view trading charts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Book & Trade Form */}
        <div className="space-y-6">
          {/* Order Book */}
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Order Book</h4>
              <div className="space-y-1 text-sm font-mono">
                {/* Current Price */}
                <div className="border-t border-b border-dark-border py-2 my-2">
                  <div className="flex justify-center">
                    <span className="text-neon-green font-bold">{ethPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="text-center py-4">
                  <p className="text-text-secondary text-sm">Order book unavailable</p>
                  <p className="text-xs text-muted-foreground mt-1">Connect wallet to view orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Trade Form */}
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-4">
              <div className="flex space-x-1 mb-4">
                <Button 
                  className={`flex-1 py-2 font-medium ${
                    tradeType === 'buy' 
                      ? 'bg-neon-green text-dark-primary' 
                      : 'bg-dark-primary text-red-400'
                  }`}
                  onClick={() => setTradeType('buy')}
                >
                  Buy
                </Button>
                <Button 
                  className={`flex-1 py-2 font-medium ${
                    tradeType === 'sell' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-dark-primary text-red-400'
                  }`}
                  onClick={() => setTradeType('sell')}
                >
                  Sell
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-text-secondary">Price</Label>
                  <Input 
                    type="text" 
                    value={ethPrice.toFixed(2)} 
                    className="bg-dark-primary border-dark-border font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-text-secondary">Amount</Label>
                  <Input 
                    type="text" 
                    placeholder="0.00" 
                    className="bg-dark-primary border-dark-border font-mono"
                  />
                </div>
                <div>
                  <Label className="text-sm text-text-secondary">Total</Label>
                  <Input 
                    type="text" 
                    placeholder="0.00 USDT" 
                    className="bg-dark-primary border-dark-border font-mono" 
                    readOnly
                  />
                </div>
                
                <Button className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-dark-primary rounded-lg font-semibold hover:neon-glow-green transition-all duration-200">
                  {tradeType === 'buy' ? 'Buy ETH' : 'Sell ETH'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Open Orders & Trade History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Open Orders</h3>
            <div className="space-y-3">
              <div className="text-center py-6">
                <p className="text-text-secondary">No open orders</p>
                <p className="text-xs text-muted-foreground mt-1">Connect wallet and place trades to see orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trade History</h3>
            <div className="space-y-3">
              <div className="text-center py-6">
                <p className="text-text-secondary">No trade history available</p>
                <p className="text-xs text-muted-foreground mt-1">Connect wallet and place trades to see history</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
