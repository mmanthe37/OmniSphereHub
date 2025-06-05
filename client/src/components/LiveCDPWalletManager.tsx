import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Wallet, 
  Plus, 
  Send,
  RefreshCw,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CDPWallet {
  walletId: string;
  address: string;
  network: string;
  balance: number;
}

interface TransferResult {
  transactionId: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  amount: number;
  currency: string;
  fee: number;
}

export function LiveCDPWalletManager() {
  const [wallets, setWallets] = useState<CDPWallet[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferData, setTransferData] = useState({
    walletId: '',
    toAddress: '',
    amount: '',
    assetId: 'ETH'
  });
  const { toast } = useToast();

  const createWallet = async () => {
    setIsCreating(true);
    try {
      const response = await apiRequest('POST', '/api/cdp/create-wallet', {
        network: 'base-mainnet'
      });
      const wallet: CDPWallet = await response.json();
      
      setWallets(prev => [...prev, wallet]);
      
      toast({
        title: "Wallet Created",
        description: `New CDP wallet created: ${wallet.address.slice(0, 8)}...`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Unable to create CDP wallet",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getWalletBalance = async (walletId: string) => {
    try {
      const response = await apiRequest('GET', `/api/cdp/wallet-balance/${walletId}?assetId=ETH`);
      const data = await response.json();
      
      setWallets(prev => 
        prev.map(w => 
          w.walletId === walletId 
            ? { ...w, balance: data.balance }
            : w
        )
      );
    } catch (error) {
      toast({
        title: "Balance Error",
        description: "Unable to fetch wallet balance",
        variant: "destructive"
      });
    }
  };

  const processTransfer = async () => {
    if (!transferData.walletId || !transferData.toAddress || !transferData.amount) {
      toast({
        title: "Transfer Error",
        description: "Please fill in all transfer fields",
        variant: "destructive"
      });
      return;
    }

    setIsTransferring(true);
    try {
      const response = await apiRequest('POST', '/api/cdp/transfer', transferData);
      const result: TransferResult = await response.json();
      
      toast({
        title: "Transfer Initiated",
        description: `Transaction ${result.transactionId.slice(0, 10)}... initiated`,
        variant: "default"
      });

      // Reset form
      setTransferData({
        walletId: '',
        toAddress: '',
        amount: '',
        assetId: 'ETH'
      });
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Unable to process transfer",
        variant: "destructive"
      });
    } finally {
      setIsTransferring(false);
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
      {/* Wallet Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Live CDP Wallet Manager
          </CardTitle>
          <CardDescription>
            Create and manage wallets using your authenticated mmanthe37 CDP account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={createWallet}
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Create New CDP Wallet
          </Button>
        </CardContent>
      </Card>

      {/* Wallet List */}
      {wallets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your CDP Wallets</CardTitle>
            <CardDescription>
              Wallets created through your authenticated CDP account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wallets.map((wallet) => (
                <div key={wallet.walletId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {wallet.network}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ID: {wallet.walletId.slice(0, 8)}...
                        </span>
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
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {wallet.balance ? wallet.balance.toFixed(6) : '0.000000'} ETH
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => getWalletBalance(wallet.walletId)}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setTransferData(prev => ({ ...prev, walletId: wallet.walletId }))}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Transfer
                    </Button>
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
      )}

      {/* Transfer Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Transfer Funds
          </CardTitle>
          <CardDescription>
            Send funds between CDP wallets or to external addresses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-select">From Wallet</Label>
              <select
                id="wallet-select"
                className="w-full p-2 border rounded-md"
                value={transferData.walletId}
                onChange={(e) => setTransferData(prev => ({ ...prev, walletId: e.target.value }))}
              >
                <option value="">Select wallet...</option>
                {wallets.map((wallet) => (
                  <option key={wallet.walletId} value={wallet.walletId}>
                    {wallet.address.slice(0, 8)}... ({wallet.balance?.toFixed(4) || '0'} ETH)
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-address">To Address</Label>
              <Input
                id="to-address"
                placeholder="0x..."
                value={transferData.toAddress}
                onChange={(e) => setTransferData(prev => ({ ...prev, toAddress: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                placeholder="0.001"
                type="number"
                step="0.000001"
                value={transferData.amount}
                onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <select
                id="asset"
                className="w-full p-2 border rounded-md"
                value={transferData.assetId}
                onChange={(e) => setTransferData(prev => ({ ...prev, assetId: e.target.value }))}
              >
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
                <option value="WETH">WETH</option>
              </select>
            </div>
          </div>

          <Separator />

          <Button 
            onClick={processTransfer}
            disabled={isTransferring || !transferData.walletId || !transferData.toAddress || !transferData.amount}
            className="w-full"
          >
            {isTransferring ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Process Transfer
          </Button>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>CDP Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">Connected to mmanthe37 CDP account</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">Live wallet creation and management enabled</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">Base network transactions active</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}