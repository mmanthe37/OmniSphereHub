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
  Copy
} from "lucide-react";

// Wallet provider detection
interface WalletProvider {
  name: string;
  icon: string;
  detected: boolean;
  connect: () => Promise<void>;
}

interface WalletInfo {
  address: string;
  chainId: number;
  balance: string;
  isConnected: boolean;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletConnector() {
  const { toast } = useToast();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletType, setWalletType] = useState<string>("");

  useEffect(() => {
    checkWalletConnection();
    setupEventListeners();
    
    return () => {
      removeEventListeners();
    };
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await updateWalletInfo(accounts[0]);
        }
        
        // Detect wallet type
        if (window.ethereum.isCoinbaseWallet) {
          setWalletType("Coinbase Wallet");
        } else if (window.ethereum.isMetaMask) {
          setWalletType("MetaMask");
        } else {
          setWalletType("Web3 Wallet");
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
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

      setWalletInfo({
        address,
        chainId: parseInt(chainId, 16),
        balance: (parseInt(balance, 16) / 1e18).toFixed(4),
        isConnected: true
      });
    } catch (error) {
      console.error('Error updating wallet info:', error);
    }
  };

  const setupEventListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
  };

  const removeEventListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setWalletInfo(null);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
        variant: "destructive"
      });
    } else {
      updateWalletInfo(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "No Wallet Found",
        description: "Please install a Web3 wallet like Coinbase Wallet or MetaMask",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
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
      // This error code indicates that the chain has not been added to MetaMask
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

  const isBaseNetwork = walletInfo?.chainId === 8453;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            <CardTitle>Wallet Connection</CardTitle>
          </div>
          {walletType && (
            <Badge variant="outline">
              {walletType}
            </Badge>
          )}
        </div>
        <CardDescription>
          Connect your wallet to access Smart Wallet features and gasless transactions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!walletInfo ? (
          <div className="space-y-4">
            <Button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Wallet className="h-4 w-4 mr-2" />
              )}
              Connect Wallet
            </Button>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Install Coinbase Wallet for the best Smart Wallet experience with passkey authentication and gasless transactions.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => window.open('https://www.coinbase.com/wallet', '_blank')}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Get Coinbase Wallet
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open('https://metamask.io', '_blank')}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Get MetaMask
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Connected</span>
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{walletInfo.balance} ETH</div>
                <div className="text-sm text-muted-foreground">
                  Chain ID: {walletInfo.chainId}
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

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigator.clipboard.writeText(walletInfo.address)}
              >
                Copy Address
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setWalletInfo(null);
                  toast({
                    title: "Disconnected",
                    description: "Wallet disconnected from app"
                  });
                }}
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Coinbase Wallet: Native Smart Wallet support with passkeys</div>
          <div>• MetaMask: Compatible with ERC-4337 Account Abstraction</div>
          <div>• Base Network: Optimized for gasless transactions</div>
        </div>
      </CardContent>
    </Card>
  );
}