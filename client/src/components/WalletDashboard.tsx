import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SimpleWalletConnect } from './SimpleWalletConnect';
import { 
  Wallet, 
  Send, 
  ArrowDownToLine, 
  History, 
  TrendingUp,
  DollarSign,
  Coins,
  ExternalLink
} from 'lucide-react';

export function WalletDashboard() {
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  const handleWalletConnected = (addr: string) => {
    setConnectedAddress(addr);
    setIsConnected(true);
  };

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-400 font-inter text-lg max-w-2xl mx-auto">
            Access the full power of OmniSphere by connecting your Web3 wallet. Trade, stake, earn rewards, and manage your DeFi portfolio seamlessly.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <SimpleWalletConnect onConnected={handleWalletConnected} />
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <Card className="bg-gray-800/50 border-cyan-500/30 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-rajdhani font-bold text-white text-lg mb-2">Send & Receive</h3>
              <p className="text-gray-400 text-sm font-inter">Transfer tokens across multiple chains with low fees</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-purple-500/30 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-rajdhani font-bold text-white text-lg mb-2">DeFi Trading</h3>
              <p className="text-gray-400 text-sm font-inter">Access DEX aggregation and advanced trading tools</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/30 text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Coins className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-rajdhani font-bold text-white text-lg mb-2">Yield Farming</h3>
              <p className="text-gray-400 text-sm font-inter">Stake tokens and earn passive rewards automatically</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Wallet Dashboard
        </h2>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          Connected
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Wallet Connection Status */}
        <div className="lg:col-span-1">
          <SimpleWalletConnect onConnected={handleWalletConnected} />
        </div>

        {/* Portfolio Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-inter font-medium tracking-wide uppercase">Wallet Balance</p>
                    <p className="text-2xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      0.0000 ETH
                    </p>
                    <p className="text-cyan-400 text-sm font-inter font-medium">
                      {connectedAddress ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}` : 'No wallet connected'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-inter font-medium tracking-wide uppercase">USD Value</p>
                    <p className="text-2xl font-bold font-orbitron bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      $0.00
                    </p>
                    <p className="text-green-400 text-sm font-inter font-medium">Live pricing</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
              <Button className="flex flex-col items-center space-y-2 h-auto p-4 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30">
                <Send className="w-6 h-6 text-cyan-400" />
                <span className="text-cyan-300 font-inter text-sm">Send</span>
              </Button>
              
              <Button className="flex flex-col items-center space-y-2 h-auto p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30">
                <ArrowDownToLine className="w-6 h-6 text-purple-400" />
                <span className="text-purple-300 font-inter text-sm">Receive</span>
              </Button>
              
              <Button className="flex flex-col items-center space-y-2 h-auto p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span className="text-green-300 font-inter text-sm">Trade</span>
              </Button>
              
              <Button className="flex flex-col items-center space-y-2 h-auto p-4 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30">
                <Coins className="w-6 h-6 text-orange-400" />
                <span className="text-orange-300 font-inter text-sm">Stake</span>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold font-rajdhani text-white">
                  Recent Transactions
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => window.open(`https://etherscan.io/address/${connectedAddress}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 font-inter">No recent transactions</p>
                <p className="text-gray-500 text-sm font-inter mt-2">
                  Your transaction history will appear here once you start using OmniSphere
                </p>
                {connectedAddress && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white mt-4"
                    onClick={() => window.open(`https://etherscan.io/address/${connectedAddress}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Etherscan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}