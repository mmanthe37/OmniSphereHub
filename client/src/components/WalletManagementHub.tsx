import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { 
  Wallet, 
  Shield, 
  Fuel,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertTriangle,
  Zap,
  TrendingUp
} from 'lucide-react';

interface WalletStatus {
  address: string;
  isAllowlisted: boolean;
  privileges: {
    isPremium: boolean;
    gasSponsorship: boolean;
    smartContractAccess: boolean;
    x402Access: boolean;
  };
  balance: string;
  network: string;
}

interface PaymasterMetrics {
  totalTransactions: number;
  totalGasSponsored: number;
  totalCostUSD: number;
  uniqueUsers: number;
  averageGasPerTx: number;
}

export function WalletManagementHub() {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletStatus, setWalletStatus] = useState<WalletStatus | null>(null);
  const { toast } = useToast();

  const { data: paymasterMetrics } = useQuery<PaymasterMetrics>({
    queryKey: ['/api/paymaster/metrics'],
    refetchInterval: 30000
  });

  const { data: contractInfo } = useQuery({
    queryKey: ['/api/contract/info'],
    refetchInterval: 60000
  });

  const allowlistedWallets = [
    { address: '0x2d45014917c4bce08b6fb2b3a53960692b5b744b', label: 'Primary Contract', isPremium: true },
    { address: '0xF7DCa789B08Ed2F7995D9bC22c500A8CA715D0A8', label: 'Secondary Wallet', isPremium: true },
    { address: '0x0fa44c066886d74e4884f010473347adfc706307', label: 'Trading Wallet', isPremium: false },
    { address: '0x0000006e221000F22963833833a30d0001216877a', label: 'Staking Wallet', isPremium: false },
    { address: '0x2d450149170CEcb09b5fb63a300d2b3a30ab744b', label: 'Reserve Wallet', isPremium: false }
  ];

  const checkWalletStatus = async () => {
    if (!walletAddress) {
      toast({
        title: "Validation Error",
        description: "Please enter a wallet address",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/cdp/validate-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress })
      });

      if (response.ok) {
        const data = await response.json();
        setWalletStatus({
          address: walletAddress,
          isAllowlisted: data.isValid,
          privileges: {
            isPremium: data.hasBalance,
            gasSponsorship: data.isValid,
            smartContractAccess: data.isValid,
            x402Access: data.hasBalance
          },
          balance: data.balance || '0',
          network: 'Base'
        });
        
        toast({
          title: "Wallet Validated",
          description: `Wallet ${data.isValid ? 'is allowlisted' : 'not found in allowlist'}`,
          variant: data.isValid ? "default" : "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Unable to validate wallet",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      {/* Wallet Status Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Wallet Privilege Checker
          </CardTitle>
          <CardDescription>
            Verify allowlist status and privileges for any wallet address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter wallet address (0x...)"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={checkWalletStatus}>
              Check Status
            </Button>
          </div>

          {walletStatus && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {walletStatus.address}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(walletStatus.address)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <Badge className={walletStatus.isAllowlisted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {walletStatus.isAllowlisted ? 'Allowlisted' : 'Not Allowlisted'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-2 border rounded">
                  <div className={`text-sm ${walletStatus.privileges.isPremium ? 'text-green-600' : 'text-gray-400'}`}>
                    {walletStatus.privileges.isPremium ? <CheckCircle className="w-4 h-4 mx-auto mb-1" /> : <AlertTriangle className="w-4 h-4 mx-auto mb-1" />}
                    Premium
                  </div>
                </div>
                <div className="text-center p-2 border rounded">
                  <div className={`text-sm ${walletStatus.privileges.gasSponsorship ? 'text-green-600' : 'text-gray-400'}`}>
                    {walletStatus.privileges.gasSponsorship ? <CheckCircle className="w-4 h-4 mx-auto mb-1" /> : <AlertTriangle className="w-4 h-4 mx-auto mb-1" />}
                    Gas Sponsor
                  </div>
                </div>
                <div className="text-center p-2 border rounded">
                  <div className={`text-sm ${walletStatus.privileges.smartContractAccess ? 'text-green-600' : 'text-gray-400'}`}>
                    {walletStatus.privileges.smartContractAccess ? <CheckCircle className="w-4 h-4 mx-auto mb-1" /> : <AlertTriangle className="w-4 h-4 mx-auto mb-1" />}
                    Contracts
                  </div>
                </div>
                <div className="text-center p-2 border rounded">
                  <div className={`text-sm ${walletStatus.privileges.x402Access ? 'text-green-600' : 'text-gray-400'}`}>
                    {walletStatus.privileges.x402Access ? <CheckCircle className="w-4 h-4 mx-auto mb-1" /> : <AlertTriangle className="w-4 h-4 mx-auto mb-1" />}
                    X402
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Allowlisted Wallets */}
      <Card>
        <CardHeader>
          <CardTitle>Your Allowlisted Wallets</CardTitle>
          <CardDescription>
            Wallets with special privileges on the OmniSphere platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allowlistedWallets.map((wallet, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={wallet.isPremium ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
                        {wallet.label}
                      </Badge>
                      {wallet.isPremium && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {wallet.address}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(wallet.address)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://basescan.org/address/${wallet.address}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Paymaster Analytics */}
      {paymasterMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="w-5 h-5" />
              Live Paymaster Analytics
            </CardTitle>
            <CardDescription>
              Real-time gas sponsorship data from your authenticated account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{paymasterMetrics.totalTransactions}</div>
                <div className="text-sm text-muted-foreground">Total Transactions</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">${paymasterMetrics.totalCostUSD.toFixed(4)}</div>
                <div className="text-sm text-muted-foreground">Gas Sponsored</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{paymasterMetrics.uniqueUsers}</div>
                <div className="text-sm text-muted-foreground">Unique Users</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{paymasterMetrics.averageGasPerTx.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Avg Gas/Tx</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Contract Info */}
      {contractInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              OmniSphere Core Contract
            </CardTitle>
            <CardDescription>
              Deployed smart contract information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{contractInfo.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Symbol:</span>
                <span className="text-sm">{contractInfo.symbol}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network:</span>
                <span className="text-sm">{contractInfo.network}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Address:</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {contractInfo.address}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(contractInfo.address)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CDP Wallet Creation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            CDP Wallet Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                CDP wallet creation requires updated API credentials. Please provide your current CDP API keys to enable live wallet management.
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Once credentials are configured, you'll be able to:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Create new CDP wallets on Base network</li>
                <li>Transfer funds between wallets</li>
                <li>View real-time wallet balances</li>
                <li>Export/import wallet configurations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}