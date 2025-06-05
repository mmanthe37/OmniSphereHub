import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Key, 
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface SmartWalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  provider: any;
  sdk: any;
}

export function SmartWalletIntegration() {
  const [walletState, setWalletState] = useState<SmartWalletState>({
    isConnected: false,
    address: null,
    balance: null,
    provider: null,
    sdk: null
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeWalletSDK();
  }, []);

  const initializeWalletSDK = async () => {
    try {
      // Import Coinbase Wallet SDK dynamically
      const { CoinbaseWalletSDK } = await import('@coinbase/wallet-sdk');
      
      // Initialize with OmniSphere app configuration
      const sdk = new CoinbaseWalletSDK({
        appName: "OmniSphere",
        appChainIds: [8453, 84532], // Base mainnet and Base Sepolia testnet
        appLogoUrl: "/omnisphere-logo.jpg"
      });

      // Create Web3 provider
      const provider = sdk.makeWeb3Provider();
      
      setWalletState(prev => ({ ...prev, sdk, provider }));
      
      // Check if already connected
      checkConnectionStatus(provider);
    } catch (error) {
      console.error('Failed to initialize Coinbase Wallet SDK:', error);
      toast({
        title: "SDK Initialization Failed",
        description: "Unable to load Coinbase Wallet SDK",
        variant: "destructive"
      });
    }
  };

  const checkConnectionStatus = async (provider: any) => {
    try {
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        setWalletState(prev => ({
          ...prev,
          isConnected: true,
          address: accounts[0]
        }));
        
        // Get balance
        await getWalletBalance(provider, accounts[0]);
      }
    } catch (error) {
      console.error('Connection check failed:', error);
    }
  };

  const connectSmartWallet = async () => {
    if (!walletState.provider) {
      toast({
        title: "SDK Not Ready",
        description: "Wallet SDK is not initialized",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Request account connection
      const addresses = await walletState.provider.request({
        method: 'eth_requestAccounts'
      });

      if (addresses && addresses.length > 0) {
        setWalletState(prev => ({
          ...prev,
          isConnected: true,
          address: addresses[0]
        }));

        // Get balance
        await getWalletBalance(walletState.provider, addresses[0]);

        toast({
          title: "Wallet Connected",
          description: `Connected to ${addresses[0].slice(0, 8)}...`,
          variant: "default"
        });
      }
    } catch (error: any) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Unable to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const getWalletBalance = async (provider: any, address: string) => {
    try {
      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      
      // Convert from wei to ETH
      const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(6);
      setWalletState(prev => ({ ...prev, balance: balanceInEth }));
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  const disconnectWallet = () => {
    if (walletState.sdk) {
      walletState.sdk.disconnect();
    }
    
    setWalletState({
      isConnected: false,
      address: null,
      balance: null,
      provider: walletState.provider,
      sdk: walletState.sdk
    });

    toast({
      title: "Wallet Disconnected",
      description: "Smart wallet disconnected successfully",
      variant: "default"
    });
  };

  const createSponsoredTransaction = async () => {
    if (!walletState.address) {
      toast({
        title: "No Wallet Connected",
        description: "Please connect your smart wallet first",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a sponsored transaction using paymaster
      const response = await fetch('/api/paymaster/create-sponsored', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: walletState.address,
          callData: '0x', // Empty call data for demo
          nonce: '0x0'
        })
      });

      if (response.ok) {
        const sponsoredTx = await response.json();
        toast({
          title: "Sponsored Transaction Created",
          description: "Gasless transaction prepared successfully",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Sponsorship Failed",
        description: "Unable to create sponsored transaction",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Smart Wallet Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Coinbase Smart Wallet
          </CardTitle>
          <CardDescription>
            Seamless onboarding with passkey authentication and gasless experiences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!walletState.isConnected ? (
            <div className="text-center space-y-4">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Connect Smart Wallet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect using passkey authentication - no seed phrases required
                </p>
                <Button 
                  onClick={connectSmartWallet}
                  disabled={isConnecting}
                  className="w-full"
                >
                  {isConnecting ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Wallet className="w-4 h-4 mr-2" />
                  )}
                  Connect Smart Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    <Badge className="bg-blue-100 text-blue-800">Smart Wallet</Badge>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Address:</span>
                    <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                      {walletState.address}
                    </code>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Balance:</span>
                    <span className="ml-2">{walletState.balance} ETH</span>
                  </div>
                </div>
                <Button onClick={disconnectWallet} variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={createSponsoredTransaction} className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Create Gasless Transaction
                </Button>
                <Button 
                  onClick={() => window.open(`https://basescan.org/address/${walletState.address}`, '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on BaseScan
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Wallet Features */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Wallet Features</CardTitle>
          <CardDescription>
            Advanced capabilities powered by Coinbase infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Key className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h4 className="font-semibold mb-2">Passkey Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Secure onboarding without seed phrases or passwords
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Zap className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h4 className="font-semibold mb-2">Gasless Transactions</h4>
              <p className="text-sm text-muted-foreground">
                Sponsored transactions through OmniSphere paymaster
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Shield className="w-8 h-8 mx-auto mb-3 text-purple-500" />
              <h4 className="font-semibold mb-2">Coinbase Integration</h4>
              <p className="text-sm text-muted-foreground">
                Access Coinbase balances without complex transfers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Coinbase Wallet SDK integrated</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Base network support (mainnet & testnet)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Paymaster integration for gasless transactions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">OmniSphere branding and configuration</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}