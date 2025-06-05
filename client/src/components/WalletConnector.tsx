import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ExternalLink,
  AlertTriangle,
  Copy,
  Globe
} from "lucide-react";

interface WalletInfo {
  address: string;
  chainId: number;
  balance: string;
  isConnected: boolean;
  providerName: string;
}

interface WalletProvider {
  name: string;
  id: string;
  icon: JSX.Element;
  detected: boolean;
  description: string;
  downloadUrl: string;
  connect: () => Promise<void>;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CoinbaseIcon = () => (
  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
    <div className="w-4 h-4 bg-white rounded-full"></div>
  </div>
);

const MetaMaskIcon = () => (
  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
    M
  </div>
);

const WalletConnectIcon = () => (
  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
    WC
  </div>
);

const GenericWalletIcon = () => (
  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
    <Wallet className="w-4 h-4 text-white" />
  </div>
);

export function WalletConnector() {
  const { toast } = useToast();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<WalletProvider[]>([]);

  useEffect(() => {
    detectWallets();
    checkExistingConnection();
  }, []);

  const detectWallets = () => {
    const wallets: WalletProvider[] = [];

    // Check for wallet providers
    const hasMetaMask = typeof window !== 'undefined' && window.ethereum?.isMetaMask;
    const hasCoinbase = typeof window !== 'undefined' && (
      window.ethereum?.isCoinbaseWallet || 
      window.ethereum?.providerMap?.get('CoinbaseWallet') ||
      window.ethereum?.providers?.find((p: any) => p.isCoinbaseWallet)
    );
    const hasGenericWeb3 = typeof window !== 'undefined' && window.ethereum && !hasMetaMask && !hasCoinbase;

    // Coinbase Wallet
    wallets.push({
      name: "Coinbase Wallet",
      id: "coinbase",
      icon: <CoinbaseIcon />,
      detected: hasCoinbase,
      description: "Smart Wallet with gasless transactions",
      downloadUrl: "https://www.coinbase.com/wallet",
      connect: () => connectWallet("coinbase")
    });

    // MetaMask
    wallets.push({
      name: "MetaMask",
      id: "metamask", 
      icon: <MetaMaskIcon />,
      detected: hasMetaMask,
      description: "Popular Ethereum wallet",
      downloadUrl: "https://metamask.io/download/",
      connect: () => connectWallet("metamask")
    });

    // WalletConnect
    wallets.push({
      name: "WalletConnect",
      id: "walletconnect",
      icon: <WalletConnectIcon />,
      detected: false,
      description: "Connect with mobile wallets",
      downloadUrl: "https://walletconnect.com/",
      connect: () => connectWallet("walletconnect")
    });

    // Generic Web3 if detected
    if (hasGenericWeb3) {
      wallets.push({
        name: "Web3 Wallet",
        id: "web3",
        icon: <GenericWalletIcon />,
        detected: true,
        description: "Detected Web3 wallet",
        downloadUrl: "#",
        connect: () => connectWallet("web3")
      });
    }

    setAvailableWallets(wallets);
  };

  const checkExistingConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await updateWalletInfo(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    }
  };

  const updateWalletInfo = async (address: string) => {
    try {
      const chainId = await window.ethereum?.request({ method: 'eth_chainId' });
      const balance = await window.ethereum?.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });

      let providerName = "Web3 Wallet";
      if (window.ethereum?.isCoinbaseWallet) {
        providerName = "Coinbase Wallet";
      } else if (window.ethereum?.isMetaMask) {
        providerName = "MetaMask";
      }

      setWalletInfo({
        address,
        chainId: parseInt(chainId, 16),
        balance: (parseInt(balance, 16) / 1e18).toFixed(4),
        isConnected: true,
        providerName
      });
    } catch (error) {
      console.error('Error updating wallet info:', error);
    }
  };

  const connectWallet = async (walletId: string) => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error("No Web3 wallet detected");
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        await updateWalletInfo(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      let errorMessage = "Failed to connect wallet";
      
      if (error.code === 4001) {
        errorMessage = "Connection rejected by user";
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending";
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToBase = async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }], // Base mainnet
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x2105',
                chainName: 'Base',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Base network:', addError);
        }
      }
    }
  };

  const copyAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard"
      });
    }
  };

  const disconnect = () => {
    setWalletInfo(null);
    toast({
      title: "Disconnected",
      description: "Wallet disconnected from application"
    });
  };

  const isBaseNetwork = walletInfo?.chainId === 8453;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            <CardTitle>Wallet Connection</CardTitle>
          </div>
          {walletInfo && (
            <Badge variant="outline">
              {walletInfo.providerName}
            </Badge>
          )}
        </div>
        <CardDescription>
          Connect your wallet to access Smart Wallet features and gasless transactions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!walletInfo ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {availableWallets.map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {wallet.icon}
                    <div>
                      <div className="font-medium flex items-center space-x-2">
                        <span>{wallet.name}</span>
                        {wallet.detected ? (
                          <Badge variant="secondary" className="text-xs">Detected</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Not Installed</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{wallet.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {wallet.detected ? (
                      <Button 
                        onClick={wallet.connect}
                        disabled={isConnecting}
                        size="sm"
                      >
                        {isConnecting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(wallet.downloadUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Install
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                For Smart Wallet features with gasless transactions, use Coinbase Wallet on Base network.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Connected to {walletInfo.providerName}</span>
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{walletInfo.balance} ETH</div>
                <div className="text-sm text-muted-foreground">
                  Chain: {walletInfo.chainId}
                </div>
              </div>
            </div>

            {!isBaseNetwork && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Switch to Base network for Smart Wallet features</span>
                  <Button onClick={switchToBase} size="sm" variant="outline">
                    Switch to Base
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {isBaseNetwork && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Connected to Base network. Smart Wallet features are available.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={copyAddress}
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Address
              </Button>
              <Button 
                variant="outline" 
                onClick={disconnect}
                size="sm"
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
          <div className="flex items-center space-x-1">
            <Globe className="h-3 w-3" />
            <span>Supported networks: Base, Ethereum mainnet</span>
          </div>
          <div>Smart Wallet features available on Base network</div>
          <div>ERC-4337 Account Abstraction supported</div>
        </div>
      </CardContent>
    </Card>
  );
}