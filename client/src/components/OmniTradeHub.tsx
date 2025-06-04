import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeftRight, TrendingUp, TrendingDown, Wallet, ExternalLink, Zap, Shield, AlertTriangle, Settings, RefreshCw, Copy, Send, History, BarChart3, PieChart, DollarSign, Coins, Target, Activity } from "lucide-react";
import type { CryptoPrice, PortfolioData } from "@/types";
import omniSphereLogo from "@/assets/omnisphere-logo.jpg";

// Trading pairs and DEX data
const tradingPairs = [
  { 
    pair: "ETH/USDC", 
    price: 2487.32, 
    change: "+2.4%", 
    volume: "847M", 
    bestDex: "Uniswap V3",
    spread: "0.05%",
    liquidity: "High"
  },
  { 
    pair: "BTC/USDT", 
    price: 43280.50, 
    change: "+1.8%", 
    volume: "1.2B", 
    bestDex: "Curve",
    spread: "0.03%",
    liquidity: "High"
  },
  { 
    pair: "SOL/USDC", 
    price: 98.45, 
    change: "+5.6%", 
    volume: "234M", 
    bestDex: "Jupiter",
    spread: "0.12%",
    liquidity: "Medium"
  },
  { 
    pair: "MATIC/ETH", 
    price: 0.000547, 
    change: "-1.2%", 
    volume: "89M", 
    bestDex: "QuickSwap",
    spread: "0.18%",
    liquidity: "Medium"
  }
];

const walletBalances = [
  { 
    symbol: "ETH", 
    name: "Ethereum", 
    balance: 12.4567, 
    value: 30987.23, 
    change: "+2.4%",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100"
  },
  { 
    symbol: "BTC", 
    name: "Bitcoin", 
    balance: 0.8234, 
    value: 35642.18, 
    change: "+1.8%",
    logo: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=100"
  },
  { 
    symbol: "USDC", 
    name: "USD Coin", 
    balance: 15789.45, 
    value: 15789.45, 
    change: "0.0%",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100"
  },
  { 
    symbol: "SOL", 
    name: "Solana", 
    balance: 245.67, 
    value: 24198.14, 
    change: "+5.6%",
    logo: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=100"
  }
];

const recentTransactions = [
  {
    id: 1,
    type: "swap",
    from: "ETH",
    to: "USDC",
    fromAmount: 2.5,
    toAmount: 6218.30,
    dex: "Uniswap V3",
    fee: 12.45,
    time: new Date(Date.now() - 5 * 60 * 1000),
    status: "completed",
    hash: "0x742d35cc6eb59b3e4746ac5e"
  },
  {
    id: 2,
    type: "send",
    to: "0x9f2c84aa7b1d4e8c9543df12",
    asset: "USDC",
    amount: 1500,
    fee: 2.34,
    time: new Date(Date.now() - 30 * 60 * 1000),
    status: "completed",
    hash: "0x8e5f4128b1d43c05fd7ccae6"
  },
  {
    id: 3,
    type: "receive",
    from: "0x1f2937b8d6e3c4a5f789e234",
    asset: "ETH",
    amount: 1.25,
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "completed",
    hash: "0x4f8e1234b7c6d5a9e8f7b234"
  }
];

const dexAggregators = [
  {
    name: "1inch",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100",
    gasOptimized: true,
    bestFor: "Multi-hop swaps",
    fee: "0.875%"
  },
  {
    name: "Uniswap",
    logo: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=100",
    gasOptimized: false,
    bestFor: "Deep liquidity",
    fee: "0.3%"
  },
  {
    name: "ParaSwap",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100",
    gasOptimized: true,
    bestFor: "Best rates",
    fee: "Variable"
  }
];

interface OmniTradeHubProps {
  cryptoPrices: CryptoPrice[];
}

export function OmniTradeHub({ cryptoPrices }: OmniTradeHubProps) {
  const [selectedPair, setSelectedPair] = useState(tradingPairs[0]);
  const [swapAmount, setSwapAmount] = useState("");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [slippage, setSlippage] = useState(0.5);
  
  const { data: portfolio } = useQuery<PortfolioData>({
    queryKey: ['/api/portfolio/1'],
  });

  const totalWalletValue = walletBalances.reduce((sum, token) => sum + token.value, 0);
  const connectedAddress = "0x742d35cc6eb59b3e4746ac5e...";

  const handleSwap = () => {
    alert(`Swap ${swapAmount} ${fromToken} for ${toToken} - DEX aggregator would execute optimal route with ${slippage}% slippage tolerance`);
  };

  const handleSend = () => {
    alert('Send tokens interface would open here - enter recipient address, amount, and gas settings');
  };

  const handleReceive = () => {
    alert('Receive interface would open here - display wallet address QR code and copy functionality');
  };

  const handleConnectWallet = () => {
    alert('Wallet connection modal would open here - MetaMask, WalletConnect, and other wallet options');
  };

  const handleViewTransaction = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, '_blank');
  };

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
      case 'swap': return ArrowLeftRight;
      case 'send': return Send;
      case 'receive': return TrendingDown;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-900/30 via-blue-900/30 to-purple-900/30 border border-green-500/30">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img 
                src={omniSphereLogo} 
                alt="OmniSphere" 
                className="w-10 h-10 rounded-lg object-cover border border-green-400/50"
              />
              <div>
                <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  OmniTrade
                </h1>
                <p className="text-gray-300">Advanced trading with integrated wallet management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold font-orbitron text-green-400">
                  ${totalWalletValue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Wallet Value</p>
              </div>
              <Button onClick={handleConnectWallet} className="bg-gradient-to-r from-green-500 to-cyan-500">
                <Wallet className="w-4 h-4 mr-2" />
                {connectedAddress ? 'Connected' : 'Connect Wallet'}
              </Button>
            </div>
          </div>
          
          {connectedAddress && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-400">Connected Wallet</p>
                    <p className="font-mono text-sm">{connectedAddress}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(connectedAddress)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="swap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="swap">Swap</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="swap" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Swap Interface */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ArrowLeftRight className="w-5 h-5 mr-2" />
                    Token Swap
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* From Token */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">From</label>
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={swapAmount}
                          onChange={(e) => setSwapAmount(e.target.value)}
                          className="text-2xl font-mono bg-gray-800/50 border-gray-600 h-16"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Badge variant="secondary" className="text-sm">
                            Balance: 12.46
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" className="h-16 px-6">
                        <div className="flex items-center space-x-2">
                          <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=50" alt="ETH" className="w-6 h-6 rounded-full" />
                          <span>{fromToken}</span>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* Swap Direction */}
                  <div className="flex justify-center">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <ArrowLeftRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* To Token */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">To</label>
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={swapAmount ? (parseFloat(swapAmount) * 2487.32).toFixed(2) : ""}
                          readOnly
                          className="text-2xl font-mono bg-gray-800/30 border-gray-600 h-16"
                        />
                      </div>
                      <Button variant="outline" className="h-16 px-6">
                        <div className="flex items-center space-x-2">
                          <img src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=50" alt="USDC" className="w-6 h-6 rounded-full" />
                          <span>{toToken}</span>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* Slippage Settings */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Slippage Tolerance</span>
                    <div className="flex space-x-2">
                      {[0.1, 0.5, 1.0].map((value) => (
                        <Button
                          key={value}
                          variant={slippage === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSlippage(value)}
                        >
                          {value}%
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Swap Details */}
                  {swapAmount && (
                    <div className="bg-gray-800/30 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Best Route</span>
                        <span>Uniswap V3 → Curve</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Price Impact</span>
                        <span className="text-green-400">0.02%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Network Fee</span>
                        <span>~$12.45</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">DEX Fee</span>
                        <span>~$7.46</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleSwap} 
                    className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
                    disabled={!swapAmount}
                  >
                    {swapAmount ? `Swap ${fromToken} for ${toToken}` : 'Enter Amount'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* DEX Aggregators */}
            <div>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-lg">DEX Aggregators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dexAggregators.map((dex) => (
                      <div key={dex.name} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img src={dex.logo} alt={dex.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="font-medium text-sm">{dex.name}</p>
                            <p className="text-xs text-gray-400">{dex.bestFor}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono">{dex.fee}</p>
                          {dex.gasOptimized && (
                            <Badge variant="secondary" className="text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              Gas+
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Token Balances */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Token Balances</CardTitle>
                    <div className="flex space-x-2">
                      <Button onClick={handleSend} size="sm" variant="outline">
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                      <Button onClick={handleReceive} size="sm" variant="outline">
                        <TrendingDown className="w-4 h-4 mr-2" />
                        Receive
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {walletBalances.map((token) => (
                      <div key={token.symbol} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <img src={token.logo} alt={token.symbol} className="w-10 h-10 rounded-full" />
                          <div>
                            <p className="font-medium">{token.symbol}</p>
                            <p className="text-sm text-gray-400">{token.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-medium">{token.balance.toFixed(4)} {token.symbol}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-400">${token.value.toLocaleString()}</p>
                            <span className={`text-sm ${
                              parseFloat(token.change) >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {token.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleSend} className="w-full justify-start">
                    <Send className="w-4 h-4 mr-2" />
                    Send Tokens
                  </Button>
                  <Button onClick={handleReceive} variant="outline" className="w-full justify-start">
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Receive Tokens
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Balances
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Wallet Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="markets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {tradingPairs.map((pair) => (
              <Card key={pair.pair} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50 hover:border-green-500/30 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{pair.pair}</h3>
                    <Badge className={`${
                      pair.change.startsWith('+') ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
                    }`}>
                      {pair.change}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold font-mono">${pair.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">24h Volume: {pair.volume}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Best DEX</span>
                        <span>{pair.bestDex}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Spread</span>
                        <span className="text-green-400">{pair.spread}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Liquidity</span>
                        <Badge variant="outline" className="text-xs">
                          {pair.liquidity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx) => {
                  const Icon = getTransactionIcon(tx.type);
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors group">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'swap' ? 'bg-blue-500/20 text-blue-400' :
                          tx.type === 'send' ? 'bg-red-500/20 text-red-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">
                              {tx.type === 'swap' && `Swap ${tx.fromAmount} ${tx.from} → ${tx.toAmount} ${tx.to}`}
                              {tx.type === 'send' && `Send ${tx.amount} ${tx.asset}`}
                              {tx.type === 'receive' && `Receive ${tx.amount} ${tx.asset}`}
                            </p>
                            <Badge variant="outline" className="text-xs text-green-400">
                              {tx.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{formatTimeAgo(tx.time)}</p>
                          {tx.dex && (
                            <p className="text-xs text-purple-400">via {tx.dex}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <div>
                            {tx.fee && (
                              <p className="text-sm text-gray-400">Fee: ${tx.fee}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTransaction(tx.hash)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}