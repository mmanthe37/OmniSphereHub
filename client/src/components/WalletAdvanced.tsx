import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownFundLink,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet as WalletIcon, 
  DollarSign, 
  TrendingUp, 
  Zap,
  Shield,
  Copy,
  ExternalLink,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Settings
} from "lucide-react";

export function WalletAdvanced() {
  const [showDetails, setShowDetails] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const getChainName = (chainId: number) => {
    const chainNames: Record<number, string> = {
      1: 'Ethereum',
      8453: 'Base',
      84532: 'Base Sepolia',
      10: 'Optimism',
      42161: 'Arbitrum',
      137: 'Polygon',
      59144: 'Linea',
      324: 'ZKsync Era',
      534352: 'Scroll'
    };
    return chainNames[chainId] || `Chain ${chainId}`;
  };

  return (
    <div className="space-y-6">
      {/* Primary Wallet Connection */}
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <WalletIcon className="w-5 h-5 mr-2 text-cyan-400" />
            Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Wallet>
            <ConnectWallet 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              text="Connect Smart Wallet"
            />
            <WalletDropdown>
              <Identity 
                className="px-4 pt-3 pb-2" 
                hasCopyAddressOnClick
              >
                <Avatar className="w-6 h-6" />
                <Name className="text-white font-semibold" />
                <Address className="text-gray-400 text-sm" />
                <EthBalance className="text-cyan-400 font-medium" />
              </Identity>
              
              <WalletDropdownBasename className="hover:bg-gray-800/50" />
              <WalletDropdownLink 
                icon="wallet" 
                href="https://wallet.coinbase.com"
                className="hover:bg-gray-800/50 text-gray-300"
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownFundLink className="hover:bg-gray-800/50 text-gray-300" />
              <WalletDropdownDisconnect className="hover:bg-red-900/20 text-red-400" />
            </WalletDropdown>
          </Wallet>
        </CardContent>
      </Card>

      {/* Wallet Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Balance</p>
                <p className="text-2xl font-bold text-white">$0.00</p>
                <p className="text-green-400 text-sm">+0.00%</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Positions</p>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-purple-400 text-sm">Ready to trade</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Gas Optimization</p>
                <p className="text-2xl font-bold text-white">Ready</p>
                <p className="text-cyan-400 text-sm">Smart routing</p>
              </div>
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* X402 Protocol Features */}
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            X402 Protocol Features
            <Badge className="ml-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
              Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Micropayments</h4>
                  <p className="text-sm text-gray-400">Ultra-low cost transactions</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Trading Fees</h4>
                  <p className="text-sm text-gray-400">Automated fee collection</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Creator Tips</h4>
                  <p className="text-sm text-gray-400">Support content creators</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Instant Settlements</h4>
                  <p className="text-sm text-gray-400">Real-time processing</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button className="bg-green-600 hover:bg-green-700 h-20 flex flex-col items-center justify-center space-y-2">
              <Plus className="w-5 h-5" />
              <span className="text-sm">Add Funds</span>
            </Button>

            <Button className="bg-blue-600 hover:bg-blue-700 h-20 flex flex-col items-center justify-center space-y-2">
              <ArrowUpRight className="w-5 h-5" />
              <span className="text-sm">Send</span>
            </Button>

            <Button className="bg-purple-600 hover:bg-purple-700 h-20 flex flex-col items-center justify-center space-y-2">
              <ArrowDownLeft className="w-5 h-5" />
              <span className="text-sm">Receive</span>
            </Button>

            <Button className="bg-orange-600 hover:bg-orange-700 h-20 flex flex-col items-center justify-center space-y-2">
              <Settings className="w-5 h-5" />
              <span className="text-sm">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* EAS Attestation Ready */}
      <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Reputation System Ready</h3>
              <p className="text-gray-300">EAS attestation schema configured for trader verification</p>
            </div>
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/50">
              Coming Soon
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}