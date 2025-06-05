import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Coins, TrendingUp, Shield, Zap, Target, Lock, Repeat } from "lucide-react";

interface YieldAllocation {
  protocol: string;
  percentage: number;
  amount: number;
  expectedYield: number;
}

interface LiquidStakingPosition {
  asset: string;
  amount: number;
  stakingRewards: number;
  liquidityToken: string;
  canUnstake: boolean;
  unstakingPeriod: number;
}

interface RiskProfile {
  conservative: number;
  moderate: number;
  aggressive: number;
  totalAllocation: number;
}

export function DeFiYieldHub() {
  const [totalAmount, setTotalAmount] = useState("10000");
  const [riskProfile, setRiskProfile] = useState<RiskProfile>({
    conservative: 60,
    moderate: 30,
    aggressive: 10,
    totalAllocation: 100
  });
  const [yieldAllocations, setYieldAllocations] = useState<any>(null);
  const [stakingPositions, setStakingPositions] = useState<LiquidStakingPosition[]>([]);
  const [stakingAsset, setStakingAsset] = useState("ETH");
  const [stakingAmount, setStakingAmount] = useState("1");
  const [targetVolatility, setTargetVolatility] = useState([25]);
  const [isProcessing, setIsProcessing] = useState(false);

  const protocols = [
    { name: "Compound V3", apy: 12.5, risk: "Low", tvl: "$2.8B" },
    { name: "Lido Staking", apy: 8.2, risk: "Low", tvl: "$15.6B" },
    { name: "Uniswap V3", apy: 18.7, risk: "Medium", tvl: "$450M" },
    { name: "Curve 3Pool", apy: 15.3, risk: "Low", tvl: "$1.2B" },
    { name: "Yearn Vault", apy: 22.1, risk: "Medium", tvl: "$340M" }
  ];

  const optimizeYieldAllocation = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/defi/optimize-yield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          totalAmount: parseFloat(totalAmount),
          riskProfile
        })
      });

      const result = await response.json();
      setYieldAllocations(result);
    } catch (error) {
      console.error('Yield optimization failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const executeYieldFarming = async () => {
    if (!yieldAllocations) return;

    try {
      const response = await fetch('/api/defi/execute-farming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          allocations: yieldAllocations.allocations
        })
      });

      const result = await response.json();
      alert(`Yield farming executed! Total deployed: $${result.totalDeployed.toFixed(2)}, Gas fees: $${result.estimatedGasFees.toFixed(2)}`);
    } catch (error) {
      console.error('Yield farming execution failed:', error);
    }
  };

  const enableLiquidStaking = async () => {
    try {
      const response = await fetch('/api/defi/liquid-staking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          asset: stakingAsset,
          amount: parseFloat(stakingAmount)
        })
      });

      const result = await response.json();
      setStakingPositions(prev => [...prev, result.stakingPosition]);
      alert(`Liquid staking enabled! You received ${result.liquidityToken} tokens.`);
    } catch (error) {
      console.error('Liquid staking failed:', error);
    }
  };

  const createRiskAdjustedPortfolio = async () => {
    try {
      const response = await fetch('/api/defi/risk-adjusted-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          totalAmount: parseFloat(totalAmount),
          targetVolatility: targetVolatility[0] / 100
        })
      });

      const result = await response.json();
      alert(`Risk-adjusted portfolio created! Expected return: ${(result.expectedReturn * 100).toFixed(2)}%, Sharpe ratio: ${result.sharpeRatio.toFixed(2)}`);
    } catch (error) {
      console.error('Risk-adjusted portfolio creation failed:', error);
    }
  };

  const enableAutomatedRebalancing = async () => {
    try {
      const response = await fetch('/api/defi/automated-rebalancing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          frequency: 'weekly',
          threshold: 5
        })
      });

      const result = await response.json();
      alert(`Automated rebalancing enabled! Next rebalance: ${new Date(result.nextRebalance).toLocaleDateString()}`);
    } catch (error) {
      console.error('Automated rebalancing setup failed:', error);
    }
  };

  const setupInstitutionalCustody = async () => {
    try {
      const response = await fetch('/api/defi/institutional-custody', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          assets: [
            { symbol: 'BTC', amount: 50000 },
            { symbol: 'ETH', amount: 100000 },
            { symbol: 'USDC', amount: 250000 }
          ]
        })
      });

      const result = await response.json();
      alert(`Institutional custody setup! Address: ${result.custodyAddress}, Insurance: $${result.insuranceCoverage.toLocaleString()}`);
    } catch (error) {
      console.error('Institutional custody setup failed:', error);
    }
  };

  const updateRiskProfile = (type: keyof RiskProfile, value: number) => {
    if (type === 'totalAllocation') return;
    
    const newProfile = { ...riskProfile, [type]: value };
    const total = newProfile.conservative + newProfile.moderate + newProfile.aggressive;
    
    if (total <= 100) {
      setRiskProfile({ ...newProfile, totalAllocation: total });
    }
  };

  const pieData = yieldAllocations?.allocations?.map((alloc: YieldAllocation) => ({
    name: alloc.protocol,
    value: alloc.percentage,
    amount: alloc.amount
  })) || [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6 p-6">
      {/* Portfolio Input */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5 text-blue-400" />
            Portfolio Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Total Investment Amount (USD)</label>
              <Input
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="10000"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Target Volatility (%)</label>
              <div className="px-3">
                <Slider
                  value={targetVolatility}
                  onValueChange={setTargetVolatility}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5%</span>
                  <span className="text-white">{targetVolatility[0]}%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-4 block">Risk Profile Allocation</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-green-400 mb-2 block">Conservative ({riskProfile.conservative}%)</label>
                <Slider
                  value={[riskProfile.conservative]}
                  onValueChange={([value]) => updateRiskProfile('conservative', value)}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-yellow-400 mb-2 block">Moderate ({riskProfile.moderate}%)</label>
                <Slider
                  value={[riskProfile.moderate]}
                  onValueChange={([value]) => updateRiskProfile('moderate', value)}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-red-400 mb-2 block">Aggressive ({riskProfile.aggressive}%)</label>
                <Slider
                  value={[riskProfile.aggressive]}
                  onValueChange={([value]) => updateRiskProfile('aggressive', value)}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Total Allocation: <span className={`${riskProfile.totalAllocation === 100 ? 'text-green-400' : 'text-red-400'}`}>
                {riskProfile.totalAllocation}%
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={optimizeYieldAllocation}
              disabled={!totalAmount || riskProfile.totalAllocation !== 100 || isProcessing}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isProcessing ? 'Optimizing...' : 'Optimize Yield Allocation'}
            </Button>
            <Button 
              onClick={createRiskAdjustedPortfolio}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Create Risk-Adjusted Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Yield Optimization Results */}
      {yieldAllocations && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Optimized Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-400">Expected APY</p>
                    <p className="text-2xl font-bold text-green-400">{yieldAllocations.expectedAPY.toFixed(2)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">Annual Yield</p>
                    <p className="text-2xl font-bold text-white">${yieldAllocations.totalYield.toFixed(0)}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={executeYieldFarming}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                >
                  Execute Yield Farming
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Coins className="h-5 w-5 text-yellow-400" />
                Protocol Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {yieldAllocations.allocations.map((alloc: YieldAllocation, index: number) => (
                  <div key={alloc.protocol} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{alloc.protocol}</span>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                        {alloc.percentage}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Amount:</span>
                        <p className="text-white">${alloc.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Yield:</span>
                        <p className="text-green-400">${alloc.expectedYield.toFixed(0)}/year</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liquid Staking */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="h-5 w-5 text-purple-400" />
            Liquid Staking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Asset</label>
              <Select value={stakingAsset} onValueChange={setStakingAsset}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH (8.2% APY)</SelectItem>
                  <SelectItem value="SOL">SOL (12.5% APY)</SelectItem>
                  <SelectItem value="MATIC">MATIC (6.8% APY)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Amount</label>
              <Input
                value={stakingAmount}
                onChange={(e) => setStakingAmount(e.target.value)}
                placeholder="1.0"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={enableLiquidStaking}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full"
              >
                Enable Liquid Staking
              </Button>
            </div>
          </div>

          {stakingPositions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Active Staking Positions</h4>
              {stakingPositions.map((position, index) => (
                <div key={index} className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Asset:</span>
                      <p className="text-white font-semibold">{position.asset}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <p className="text-white">{position.amount}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Liquid Token:</span>
                      <p className="text-purple-400">{position.liquidityToken}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Annual Rewards:</span>
                      <p className="text-green-400">{position.stakingRewards.toFixed(4)} {position.asset}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Repeat className="h-5 w-5 text-cyan-400" />
              Automated Rebalancing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              Automatically rebalance your portfolio when allocations drift more than 5% from target.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Frequency:</span>
                <span className="text-white">Weekly</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Threshold:</span>
                <span className="text-white">5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Gas Optimization:</span>
                <span className="text-green-400">Enabled via Base</span>
              </div>
            </div>
            <Button 
              onClick={enableAutomatedRebalancing}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              Enable Auto-Rebalancing
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-green-400" />
              Institutional Custody
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              Enterprise-grade asset custody with insurance coverage and compliance certifications.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Insurance Coverage:</span>
                <span className="text-white">$250M max</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Compliance:</span>
                <span className="text-white">SOC 2 Type II</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Security:</span>
                <span className="text-green-400">Multi-signature</span>
              </div>
            </div>
            <Button 
              onClick={setupInstitutionalCustody}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Setup Institutional Custody
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Available Protocols */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-yellow-400" />
            Available Yield Protocols
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocols.map((protocol, index) => (
              <div key={protocol.name} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{protocol.name}</h4>
                  <Badge 
                    variant="secondary"
                    className={`${
                      protocol.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                      protocol.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {protocol.risk}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">APY:</span>
                    <span className="text-green-400 font-semibold">{protocol.apy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">TVL:</span>
                    <span className="text-white">{protocol.tvl}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}