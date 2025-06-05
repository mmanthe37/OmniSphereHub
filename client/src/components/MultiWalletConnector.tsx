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
  icon: string;
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

export function MultiWalletConnector() {
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

    // Check for multiple wallet providers
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
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBkPSJNMTYgMzJjOC44MzcgMCAxNi03LjE2MyAxNi0xNlMyNC44MzcgMCAxNiAwIDAgNy4xNjMgMCAxNnM3LjE2MyAxNiAxNiAxNnoiIGZpbGw9IiMwMDUyRkYiLz48cGF0aCBkPSJNMTIuMjUgMTZhMy43NSAzLjc1IDAgMTE3LjUgMCAzLjc1IDMuNzUgMCAwMS03LjUgMHoiIGZpbGw9IiNmZmYiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDMydjMySDR6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+",
      detected: hasCoinbase,
      description: "Smart Wallet with passkey authentication",
      downloadUrl: "https://www.coinbase.com/wallet",
      connect: () => connectWallet("coinbase")
    });

    // MetaMask
    wallets.push({
      name: "MetaMask",
      id: "metamask", 
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBkPSJNMzAuMTcgMS4yM0wyMS43IDE2LjE4bC0xLjU3LTMuNzIgMTAtNTUuMjd6IiBmaWxsPSIjRTI3NjFCIiBzdHJva2U9IiNFMjc2MUIiIHN0cm9rZS13aWR0aD0iLjI1Ii8+PHBhdGggZD0iTTEuODMgMS4yM2w4LjM5IDEyLjAzTDkuMSAxMi41NGwtOS4yNy00LjMxeiIgZmlsbD0iI0UyNzMzQyIgc3Ryb2tlPSIjRTI3MzNDIiBzdHJva2Utd2lkdGg9Ii4yNSIvPjxwYXRoIGQ9Im0yNS43IDE5LjczLTMuODQgNS45MS0xLjgxIDUuNzItMS44NyA1LjQzaC0yLjU1bC0xLjg3LTUuNDMtMS44MS01LjcyLTMuODQtNS45MSAyLjYxLS42OWgyLjU1bDQuMjQgNi4zyIgZmlsbD0iI0UyNzYxQiIgc3Ryb2tlPSIjRTI3NjFCIiBzdHJva2Utd2lkdGg9Ii4yNSIvPjwvZz48L3N2Zz4=",
      detected: hasMetaMask,
      description: "Popular Ethereum wallet",
      downloadUrl: "https://metamask.io/download/",
      connect: () => connectWallet("metamask")
    });

    // WalletConnect
    wallets.push({
      name: "WalletConnect",
      id: "walletconnect",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBkPSJNMTYgMzJjOC44MzcgMCAxNi03LjE2MyAxNi0xNlMyNC44MzcgMCAxNiAwIDAgNy4xNjMgMCAxNnM3LjE2MyAxNiAxNiAxNnoiIGZpbGw9IiMzQjk5RkMiLz48cGF0aCBkPSJNMTAuMTMgMTIuNDJjMy4yNy0zLjI3IDguNTctMy4yNyAxMS44NCAwbDQuODggNC44OGMuMy4zLjMuNzkgMCAxLjA5bC0xLjczIDEuNzNjLS4xNS4xNS0uMzkuMTUtLjU0IDBsLTQuMDYtNC4wNmMtMi4yOS0yLjI5LTYuMDEtMi4yOS04LjMgMGwtNC4zNCA0LjM0Yy0uMTUuMTUtLjM5LjE1LS41NCAwbC0xLjczLTEuNzNjLS4zLS4zLS4zLS43OSAwLTEuMDlsNS41Mi01LjUyeiIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=",
      detected: false,
      description: "Connect with any wallet",
      downloadUrl: "https://walletconnect.com/",
      connect: () => connectWallet("walletconnect")
    });

    // Generic Web3 if detected
    if (hasGenericWeb3) {
      wallets.push({
        name: "Web3 Wallet",
        id: "web3",
        icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBkPSJNMTYgMzJjOC44MzcgMCAxNi03LjE2MyAxNi0xNlMyNC44MzcgMCAxNiAwIDAgNy4xNjMgMCAxNnM3LjE2MyAxNiAxNiAxNnoiIGZpbGw9IiMzMzMiLz48cGF0aCBkPSJNMTYgMjRjNC40MTggMCA4LTMuNTgyIDgtOHMtMy41ODItOC04LTgtOCAzLjU4Mi04IDggMy41ODIgOCA4IDh6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==",
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
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
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
                <div key={wallet.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{wallet.icon}</span>
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
                For the best Smart Wallet experience with gasless transactions, use Coinbase Wallet with passkey authentication.
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