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
  Zap, 
  Shield, 
  CheckCircle,
  CreditCard,
  ArrowUpRight,
  Settings,
  Gauge,
  Clock
} from 'lucide-react';

interface SponsoredTransactionResult {
  success: boolean;
  transactionHash?: string;
  gasSponsored: boolean;
  error?: string;
}

interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  gasUsed?: string;
  gasSponsored?: boolean;
  error?: string;
}

export function PaymasterDashboard() {
  const [walletAddress, setWalletAddress] = useState('0x2d45014917c4bce08b6fb2b3a53960692b5b744b');
  const [paymentAmount, setPaymentAmount] = useState('0.001');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<SponsoredTransactionResult | null>(null);
  const { toast } = useToast();

  const paymasterConfig = {
    endpoint: 'https://api.developer.coinbase.com/rpc/v1/base/DfC2hHiGkzPrMbaQ19KR9cEg6DIe9H2A',
    contractAddress: '0x2d45014917c4bce08b6fb2b3a53960692b5b744b',
    network: 'Base Mainnet',
    status: 'Active'
  };

  const allowlistedWallets = [
    '0x2d45014917c4bce08b6fb2b3a53960692b5b744b',
    '0xF7DCa789B08Ed2F7995D9bC22c500A8CA715D0A8',
    // User's other allowlisted addresses would be here
  ];

  const processSponsoredPayment = async () => {
    if (!paymentAmount || !walletAddress) {
      toast({
        title: "Input Required",
        description: "Please enter both wallet address and payment amount",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await apiRequest('POST', '/api/contract/x402-payment', {
        amount: paymentAmount,
        senderAddress: walletAddress
      });
      const result: PaymentResult = await response.json();
      
      if (result.success) {
        setLastTransaction({
          success: true,
          transactionHash: result.transactionHash,
          gasSponsored: result.gasSponsored || false
        });
        
        toast({
          title: result.gasSponsored ? "Gas-Free Payment Successful" : "Payment Successful",
          description: result.gasSponsored ? 
            "Transaction completed with sponsored gas fees" :
            `Transaction hash: ${result.transactionHash?.slice(0, 10)}...`,
          variant: "default"
        });
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || "Payment processing failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Unable to process sponsored payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const testSponsoredTransaction = async () => {
    setIsProcessing(true);
    try {
      const response = await apiRequest('POST', '/api/contract/sponsored-transaction', {
        walletAddress,
        contractAddress: paymasterConfig.contractAddress,
        functionName: 'processX402Payment',
        args: [1000000000000000], // 0.001 ETH in wei
        value: 1000000000000000
      });
      
      const result: SponsoredTransactionResult = await response.json();
      setLastTransaction(result);
      
      if (result.success) {
        toast({
          title: "Sponsored Transaction Successful",
          description: result.gasSponsored ? 
            "Transaction completed with zero gas fees" :
            "Transaction completed",
          variant: "default"
        });
      } else {
        toast({
          title: "Transaction Failed", 
          description: result.error || "Sponsored transaction failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Transaction Error",
        description: "Unable to execute sponsored transaction",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isWalletAllowlisted = (address: string) => {
    return allowlistedWallets.some(wallet => 
      wallet.toLowerCase() === address.toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      {/* Paymaster Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            OmniSphere Paymaster Configuration
          </CardTitle>
          <CardDescription>
            Deployed gas sponsorship contract for premium wallet privileges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Paymaster Endpoint</Label>
              <div className="text-xs font-mono bg-muted p-2 rounded">
                {paymasterConfig.endpoint}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Contract Address</Label>
              <div className="text-xs font-mono bg-muted p-2 rounded">
                {paymasterConfig.contractAddress}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Network</Label>
              <Badge className="bg-blue-100 text-blue-800">
                {paymasterConfig.network}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                {paymasterConfig.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gas Sponsorship Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Gas-Free Transaction Testing
          </CardTitle>
          <CardDescription>
            Test sponsored transactions for allowlisted wallets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <Input
                id="wallet-address"
                placeholder="Enter wallet address (0x...)"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
              {walletAddress && (
                <div className="flex items-center gap-2 text-sm">
                  {isWalletAllowlisted(walletAddress) ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Eligible for gas sponsorship</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-600">Standard gas fees apply</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Payment Amount (ETH)</Label>
              <Input
                id="payment-amount"
                placeholder="0.001"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                type="number"
                step="0.001"
                min="0"
              />
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button 
              onClick={processSponsoredPayment}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <ArrowUpRight className="w-4 h-4 mr-2" />
              )}
              Process X402 Payment
            </Button>
            <Button 
              variant="outline"
              onClick={testSponsoredTransaction}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Clock className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Gauge className="w-4 h-4 mr-2" />
              )}
              Test Sponsorship
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Results */}
      {lastTransaction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Last Transaction Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {lastTransaction.success ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <CreditCard className="w-8 h-8 text-red-500" />
                  )}
                </div>
                <div className="text-sm font-medium">
                  {lastTransaction.success ? 'Success' : 'Failed'}
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {lastTransaction.gasSponsored ? (
                    <Zap className="w-8 h-8 text-blue-500" />
                  ) : (
                    <CreditCard className="w-8 h-8 text-orange-500" />
                  )}
                </div>
                <div className="text-sm font-medium">
                  {lastTransaction.gasSponsored ? 'Gas Sponsored' : 'Standard Fees'}
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xs font-mono bg-muted p-2 rounded mb-2">
                  {lastTransaction.transactionHash ? 
                    `${lastTransaction.transactionHash.slice(0, 10)}...` : 
                    'No hash'
                  }
                </div>
                <div className="text-sm font-medium">Transaction Hash</div>
              </div>
            </div>

            {lastTransaction.gasSponsored && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">Gas fees successfully sponsored by OmniSphere paymaster</span>
                </div>
                <div className="text-sm text-green-600 mt-1">
                  This transaction was processed at zero cost to the user
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Allowlist Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gas Sponsorship Allowlist
          </CardTitle>
          <CardDescription>
            Wallets eligible for sponsored transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allowlistedWallets.map((wallet, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {wallet}
                  </code>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Premium Access
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}