import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Shield, Zap, Network } from "lucide-react";

interface SmartOrderResult {
  route: string;
  network: string;
  estimatedGas: number;
  totalCost: number;
  executionTime: number;
  savings: number;
}

interface GasOptimization {
  recommended: string;
  options: Array<{
    network: string;
    estimatedCost: number;
    executionTime: number;
  }>;
}

export function AdvancedTradingHub() {
  const [orderAmount, setOrderAmount] = useState("");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [urgency, setUrgency] = useState("medium");
  const [smartOrder, setSmartOrder] = useState<SmartOrderResult | null>(null);
  const [gasOptimization, setGasOptimization] = useState<GasOptimization | null>(null);
  const [institutionalBatch, setInstitutionalBatch] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchGasOptimization();
  }, []);

  const fetchGasOptimization = async () => {
    try {
      const response = await fetch('/api/trading/gas-optimization');
      const data = await response.json();
      setGasOptimization(data);
    } catch (error) {
      console.error('Failed to fetch gas optimization:', error);
    }
  };

  const executeSmartOrder = async () => {
    if (!orderAmount) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/trading/smart-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderAmount,
          fromToken,
          toToken,
          urgency,
          maxSlippage: 0.5
        })
      });

      const result = await response.json();
      setSmartOrder(result);
    } catch (error) {
      console.error('Smart order failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const addToInstitutionalBatch = async () => {
    if (!orderAmount) return;

    try {
      const response = await fetch('/api/trading/institutional-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          amount: orderAmount,
          token: fromToken
        })
      });

      const result = await response.json();
      setInstitutionalBatch(result);
    } catch (error) {
      console.error('Institutional batch failed:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Smart Order Routing */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-yellow-400" />
            Smart Order Routing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Amount</label>
              <Input
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                placeholder="1000"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">From</label>
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">To</label>
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Urgency</label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={executeSmartOrder}
              disabled={!orderAmount || isProcessing}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isProcessing ? 'Processing...' : 'Execute Smart Order'}
            </Button>
            <Button 
              onClick={addToInstitutionalBatch}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Add to Institutional Batch
            </Button>
          </div>

          {smartOrder && (
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-white">Smart Route Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Optimal Route:</span>
                  <p className="text-cyan-400 font-mono">{smartOrder.route}</p>
                </div>
                <div>
                  <span className="text-gray-400">Network:</span>
                  <p className="text-green-400">{smartOrder.network}</p>
                </div>
                <div>
                  <span className="text-gray-400">Execution Time:</span>
                  <p className="text-white">{smartOrder.executionTime}s</p>
                </div>
                <div>
                  <span className="text-gray-400">Gas Cost:</span>
                  <p className="text-white">${smartOrder.estimatedGas.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Total Cost:</span>
                  <p className="text-white">${smartOrder.totalCost.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-400">CDP Savings:</span>
                  <p className="text-green-400">-${smartOrder.savings.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {institutionalBatch && (
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 font-semibold">Institutional Batch Added</span>
              </div>
              <div className="text-sm space-y-1">
                <p className="text-gray-300">
                  Volume Discount: <span className="text-green-400">{institutionalBatch.volumeDiscount}%</span>
                </p>
                <p className="text-gray-300">
                  Estimated Execution: <span className="text-cyan-400">
                    {new Date(institutionalBatch.estimatedExecution).toLocaleTimeString()}
                  </span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gas Optimization */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Network className="h-5 w-5 text-blue-400" />
            Network Gas Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gasOptimization && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  Recommended: {gasOptimization.recommended}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gasOptimization.options.map((option, index) => (
                  <div 
                    key={option.network}
                    className={`p-4 rounded-lg border ${
                      option.network === gasOptimization.recommended 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-gray-600 bg-gray-800/50'
                    }`}
                  >
                    <div className="font-semibold text-white capitalize">{option.network}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Cost: <span className="text-white">${option.estimatedCost.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Time: <span className="text-white">{option.executionTime}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cross-Chain Bridge */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Network className="h-5 w-5 text-purple-400" />
            Cross-Chain Bridge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select defaultValue="ethereum">
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="From Network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
                <SelectItem value="optimism">Optimism</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="base">
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="To Network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="base">Base</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Amount"
              className="bg-gray-800 border-gray-600 text-white"
            />
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Bridge Assets
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 font-semibold">Bridge Benefits</span>
            </div>
            <div className="text-sm space-y-1">
              <p className="text-gray-300">• Route via Base for 90% fee reduction</p>
              <p className="text-gray-300">• Institutional-grade security</p>
              <p className="text-gray-300">• 15-minute average completion time</p>
              <p className="text-gray-300">• Automatic slippage protection</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Warning */}
      <Card className="bg-gradient-to-br from-amber-900/20 to-red-900/20 border-amber-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-400">Advanced Trading Features</h4>
              <p className="text-sm text-gray-300 mt-1">
                These features use Coinbase CDP infrastructure for institutional-grade execution. 
                All transactions are optimized for cost and security through Base network routing 
                and volume-based pricing tiers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}