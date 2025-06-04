import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
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
import { formatEther } from 'viem';

interface WalletConnectProps {
  onConnected?: (address: string) => void;
}

export function WalletConnect({ onConnected }: WalletConnectProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, chains } = useSwitchChain();

  const { data: balance } = useBalance({
    address: address,
  });

  useEffect(() => {
    if (isConnected && address && onConnected) {
      onConnected(address);
    }
  }, [isConnected, address, onConnected]);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getChainName = (id: number) => {
    const chain = chains.find(c => c.id === id);
    return chain?.name || 'Unknown';
  };

  const getConnectorIcon = (connectorName: string) => {
    switch (connectorName.toLowerCase()) {
      case 'metamask':
        return '🦊';
      case 'coinbase wallet':
        return '🔵';
      case 'walletconnect':
        return '🔗';
      case 'rainbow':
        return '🌈';
      case 'phantom':
        return '👻';
      default:
        return '👛';
    }
  };

  if (!isConnected) {
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
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isPending}
                className="w-full justify-start space-x-3 bg-gray-800/50 hover:bg-purple-600/20 border border-gray-700 hover:border-purple-500/50 text-white"
              >
                <span className="text-2xl">{getConnectorIcon(connector.name)}</span>
                <span className="font-inter">{connector.name}</span>
                {connector.name === 'WalletConnect' && (
                  <Badge variant="secondary" className="ml-auto">
                    Multi-wallet
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <p className="text-cyan-300 font-inter font-medium text-sm">
                  New to Web3?
                </p>
                <p className="text-gray-400 text-sm font-inter mt-1">
                  We recommend starting with Coinbase Wallet or MetaMask for the best experience.
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
              <span className="text-xl">{getConnectorIcon(connector?.name || '')}</span>
            </div>
            <div>
              <p className="font-inter font-medium text-white">{connector?.name}</p>
              <p className="text-sm text-gray-400">{getChainName(chainId)}</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Connected
          </Badge>
        </div>

        <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
          <div>
            <p className="text-gray-400 text-sm font-inter">Address</p>
            <p className="font-mono text-white">{formatAddress(address!)}</p>
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

        {balance && (
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-gray-400 text-sm font-inter">Balance</p>
            <p className="text-2xl font-orbitron font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
            </p>
          </div>
        )}

        {isExpanded && (
          <div className="space-y-3 border-t border-gray-700 pt-4">
            <div>
              <p className="text-gray-400 text-sm font-inter mb-2">Network</p>
              <div className="flex flex-wrap gap-2">
                {chains.map((chain) => (
                  <Button
                    key={chain.id}
                    variant={chainId === chain.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => switchChain({ chainId: chain.id })}
                    className={`text-xs ${
                      chainId === chain.id 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'border-gray-600 text-gray-400 hover:text-white'
                    }`}
                  >
                    {chain.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-gray-600 text-gray-400 hover:text-white"
                onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnect()}
                className="border-red-600 text-red-400 hover:bg-red-600/10 hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        )}

        {chainId !== 1 && chainId !== 137 && (
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