import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { 
  Wallet, 
  RefreshCw, 
  ExternalLink,
  TrendingUp,
  Coins,
  Activity,
  Database
} from 'lucide-react';

interface CDPBalance {
  asset: {
    id: string;
    type: string;
    groupId: string;
    subGroupId: string;
  };
  value: number;
  valueStr: string;
  decimals: number;
}

interface CDPWalletData {
  address: string;
  balances: CDPBalance[];
  totalValue: number;
  network: string;
}

interface AssetDetails {
  id: string;
  name: string;
  symbol: string;
  type: string;
}

export function CDPWalletDashboard() {
  const [walletAddress, setWalletAddress] = useState('0xF7DCa789B08Ed2F7995D9bC22c500A8CA715D0A8');
  const [walletData, setWalletData] = useState<CDPWalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [assetDetails, setAssetDetails] = useState<Record<string, AssetDetails>>({});
  const { toast } = useToast();

  const fetchWalletData = async () => {
    if (!walletAddress) {
      toast({
        title: "Address Required",
        description: "Please enter a wallet address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('GET', `/api/cdp/wallet/${walletAddress}`);
      const data: CDPWalletData = await response.json();
      setWalletData(data);

      // Fetch asset details for each balance
      const details: Record<string, AssetDetails> = {};
      for (const balance of data.balances) {
        try {
          const assetResponse = await apiRequest('GET', `/api/cdp/asset/${balance.asset.id}`);
          const assetData: AssetDetails = await assetResponse.json();
          details[balance.asset.id] = assetData;
        } catch (error) {
          details[balance.asset.id] = {
            id: balance.asset.id,
            name: 'Unknown Asset',
            symbol: 'UNK',
            type: balance.asset.type
          };
        }
      }
      setAssetDetails(details);

      toast({
        title: "Wallet Data Loaded",
        description: `Found ${data.balances.length} assets in wallet`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "CDP API Error",
        description: "Failed to fetch wallet data from Coinbase CDP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateWallet = async () => {
    if (!walletAddress) return;

    try {
      const response = await apiRequest('POST', '/api/cdp/validate-wallet', {
        address: walletAddress
      });
      const validation = await response.json();
      
      toast({
        title: "Wallet Validation",
        description: validation.isValid ? 
          `Valid wallet with ${validation.balanceCount} assets` :
          "Wallet validation failed",
        variant: validation.isValid ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Unable to validate wallet",
        variant: "destructive"
      });
    }
  };

  const getAssetTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      'erc1155': 'bg-purple-100 text-purple-800',
      'erc20': 'bg-blue-100 text-blue-800',
      'erc721': 'bg-green-100 text-green-800',
      'native': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={typeColors[type] || 'bg-gray-100 text-gray-800'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const formatBalance = (balance: CDPBalance) => {
    if (balance.decimals === 0) {
      return balance.valueStr;
    }
    return (balance.value / Math.pow(10, balance.decimals)).toFixed(4);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            CDP Wallet Analysis
          </CardTitle>
          <CardDescription>
            Connect to Coinbase Developer Platform for authentic blockchain data
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
            <Button 
              onClick={fetchWalletData}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Activity className="w-4 h-4 mr-2" />
              )}
              Analyze
            </Button>
            <Button 
              variant="outline"
              onClick={validateWallet}
            >
              Validate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Overview */}
      {walletData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Overview
              </div>
              <Badge className="bg-green-100 text-green-800">
                {walletData.network}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {walletData.balances.length}
                </div>
                <div className="text-sm text-muted-foreground">Assets Found</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {walletData.totalValue}
                </div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xs font-mono bg-muted p-2 rounded">
                  {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
                </div>
                <div className="text-sm text-muted-foreground">Address</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`https://basescan.org/address/${walletData.address}`, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View on Basescan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Balances */}
      {walletData && walletData.balances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Asset Balances
            </CardTitle>
            <CardDescription>
              Authentic blockchain data from Coinbase Developer Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {walletData.balances.map((balance, index) => {
                const asset = assetDetails[balance.asset.id];
                return (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {asset?.name || 'Unknown Asset'}
                          </span>
                          {getAssetTypeBadge(balance.asset.type)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Symbol: {asset?.symbol || 'UNK'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {formatBalance(balance)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {balance.asset.type}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <Label className="text-xs">Asset ID</Label>
                        <div className="font-mono bg-muted p-1 rounded">
                          {balance.asset.id.slice(0, 20)}...
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Group ID</Label>
                        <div className="font-mono bg-muted p-1 rounded">
                          {balance.asset.groupId.slice(0, 10)}...{balance.asset.groupId.slice(-6)}
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://basescan.org/token/${balance.asset.groupId}`, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Contract
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {walletData && walletData.balances.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Assets Found</h3>
            <p className="text-muted-foreground">
              This wallet doesn't contain any detectable assets on the Base network.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}