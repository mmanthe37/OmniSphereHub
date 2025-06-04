import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  ChevronDown,
  LogOut,
  Zap
} from 'lucide-react';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  provider: any;
}

interface SimpleWalletConnectProps {
  onConnected?: (address: string) => void;
}

export function SimpleWalletConnect({ onConnected }: SimpleWalletConnectProps) {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    chainId: null,
    provider: null
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          });
          
          setWallet({
            isConnected: true,
            address: accounts[0],
            balance: formatBalance(balance),
            chainId: parseInt(chainId, 16),
            provider: window.ethereum
          });

          if (onConnected) {
            onConnected(accounts[0]);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectMetaMask = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsConnecting(true);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });

        setWallet({
          isConnected: true,
          address: accounts[0],
          balance: formatBalance(balance),
          chainId: parseInt(chainId, 16),
          provider: window.ethereum
        });

        if (onConnected) {
          onConnected(accounts[0]);
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      window.open('https://metamask.io/download.html', '_blank');
    }
  };

  const disconnect = () => {
    setWallet({
      isConnected: false,
      address: null,
      balance: null,
      chainId: null,
      provider: null
    });
  };

  const formatBalance = (balanceHex: string): string => {
    const balanceWei = parseInt(balanceHex, 16);
    const balanceEth = balanceWei / Math.pow(10, 18);
    return balanceEth.toFixed(4);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (wallet.address) {
      await navigator.clipboard.writeText(wallet.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 11155111: return 'Sepolia Testnet';
      case 137: return 'Polygon';
      case 42161: return 'Arbitrum';
      case 10: return 'Optimism';
      case 8453: return 'Base';
      default: return `Chain ${chainId}`;
    }
  };

  if (!wallet.isConnected) {
    return (
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent flex items-center space-x-2">
            <Wallet className="w-6 h-6 text-purple-400" />
            <span>Connect Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400 font-inter">
            Connect your wallet to access all OmniSphere features including trading, staking, and social rewards.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={connectMetaMask}
              disabled={isConnecting}
              className="w-full justify-start space-x-3 bg-gray-800/50 hover:bg-purple-600/20 border border-gray-700 hover:border-purple-500/50 text-white"
            >
              <span className="text-2xl">🦊</span>
              <span className="font-inter">
                {typeof window !== 'undefined' && window.ethereum ? 'MetaMask' : 'Install MetaMask'}
              </span>
              {isConnecting && (
                <div className="ml-auto w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              )}
            </Button>

            <Button
              onClick={() => window.open('https://walletconnect.com/', '_blank')}
              className="w-full justify-start space-x-3 bg-gray-800/50 hover:bg-cyan-600/20 border border-gray-700 hover:border-cyan-500/50 text-white"
            >
              <span className="text-2xl">🔗</span>
              <span className="font-inter">WalletConnect</span>
              <Badge variant="secondary" className="ml-auto">
                Coming Soon
              </Badge>
            </Button>

            <Button
              onClick={() => window.open('https://www.coinbase.com/wallet', '_blank')}
              className="w-full justify-start space-x-3 bg-gray-800/50 hover:bg-blue-600/20 border border-gray-700 hover:border-blue-500/50 text-white"
            >
              <span className="text-2xl">🔵</span>
              <span className="font-inter">Coinbase Wallet</span>
              <Badge variant="secondary" className="ml-auto">
                Coming Soon
              </Badge>
            </Button>
          </div>

          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <p className="text-cyan-300 font-inter font-medium text-sm">
                  New to Web3?
                </p>
                <p className="text-gray-400 text-sm font-inter mt-1">
                  Install MetaMask browser extension to get started with OmniSphere.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-green-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-rajdhani text-white flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Wallet Connected</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-xl">🦊</span>
            </div>
            <div>
              <p className="font-inter font-medium text-white">MetaMask</p>
              <p className="text-sm text-gray-400">{getChainName(wallet.chainId!)}</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Connected
          </Badge>
        </div>

        <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
          <div>
            <p className="text-gray-400 text-sm font-inter">Address</p>
            <p className="font-mono text-white">{formatAddress(wallet.address!)}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyAddress}
            className="text-gray-400 hover:text-white"
          >
            {copiedAddress ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>

        {wallet.balance && (
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-gray-400 text-sm font-inter">Balance</p>
            <p className="text-2xl font-orbitron font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {wallet.balance} ETH
            </p>
          </div>
        )}

        {isExpanded && (
          <div className="space-y-3 border-t border-gray-700 pt-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-gray-600 text-gray-400 hover:text-white"
                onClick={() => window.open(`https://etherscan.io/address/${wallet.address}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="border-red-600 text-red-400 hover:bg-red-600/10 hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        )}

        {wallet.chainId !== 1 && wallet.chainId !== 137 && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <p className="text-yellow-400 text-sm font-inter">
                Consider switching to Mainnet or Polygon for the best trading experience.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}