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
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  Wallet, 
  DollarSign,
  Zap,
  Shield,
  ExternalLink
} from 'lucide-react';

interface ContractInfo {
  name: string;
  symbol: string;
  address: string;
  network: string;
}

interface ValidationResult {
  isValid: boolean;
  isAllowlisted: boolean;
  privilegeLevel: number;
  contractVerified: boolean;
}

interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  gasUsed?: string;
  error?: string;
}

export function SmartContractDashboard() {
  const [walletToValidate, setWalletToValidate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { toast } = useToast();

  // Fetch contract information
  const { data: contractInfo, isLoading: contractLoading } = useQuery<ContractInfo>({
    queryKey: ['/api/contract/info'],
    retry: false
  });

  const validateWallet = async () => {
    if (!walletToValidate) {
      toast({
        title: "Validation Error",
        description: "Please enter a wallet address to validate",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    try {
      const response = await apiRequest('POST', '/api/contract/validate-wallet', {
        walletAddress: walletToValidate
      });
      const result = await response.json();
      setValidationResult(result);
      
      toast({
        title: "Validation Complete",
        description: result.isAllowlisted ? "Wallet is allowlisted with premium privileges" : "Wallet validation complete",
        variant: result.isAllowlisted ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Unable to validate wallet on-chain",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const processX402Payment = async () => {
    if (!paymentAmount || !walletToValidate) {
      toast({
        title: "Payment Error",
        description: "Please enter both wallet address and payment amount",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingPayment(true);
    try {
      const response = await apiRequest('POST', '/api/contract/x402-payment', {
        amount: paymentAmount,
        senderAddress: walletToValidate
      });
      const result: PaymentResult = await response.json();
      
      if (result.success) {
        toast({
          title: "Payment Successful",
          description: `Transaction hash: ${result.transactionHash?.slice(0, 10)}...`,
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
        description: "Unable to process X402 payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getPrivilegeBadge = (level: number) => {
    if (level >= 3) return <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600">Premium</Badge>;
    if (level >= 2) return <Badge className="bg-gradient-to-r from-blue-400 to-blue-600">Standard</Badge>;
    return <Badge variant="outline">Basic</Badge>;
  };

  if (contractLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Smart Contract Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            OmniSphere Core Contract
          </CardTitle>
          <CardDescription>
            Registered smart contract for premium wallet validation and X402 payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contractInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contract Name</Label>
                <p className="text-sm text-muted-foreground">{contractInfo.name}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Symbol</Label>
                <p className="text-sm text-muted-foreground">{contractInfo.symbol}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Network</Label>
                <Badge variant="outline">{contractInfo.network}</Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contract Address</Label>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {contractInfo.address}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`https://basescan.org/address/${contractInfo.address}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            On-Chain Wallet Validation
          </CardTitle>
          <CardDescription>
            Validate wallet privileges directly through the smart contract
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter wallet address (0x...)"
              value={walletToValidate}
              onChange={(e) => setWalletToValidate(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={validateWallet}
              disabled={isValidating}
            >
              {isValidating ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Validate
            </Button>
          </div>

          {validationResult && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Validation Results</span>
                {validationResult.contractVerified ? (
                  <Badge className="bg-green-100 text-green-800">Contract Verified</Badge>
                ) : (
                  <Badge variant="outline">Local Fallback</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  {validationResult.isValid ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Wallet Valid</span>
                </div>
                <div className="flex items-center gap-2">
                  {validationResult.isAllowlisted ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Allowlisted</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Privilege Level:</span>
                {getPrivilegeBadge(validationResult.privilegeLevel)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* X402 Payment Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            X402 Payment Processing
          </CardTitle>
          <CardDescription>
            Process micropayments through the registered smart contract
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label>Gas Estimation</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (paymentAmount) {
                    try {
                      const response = await apiRequest('POST', '/api/contract/estimate-gas', {
                        amount: paymentAmount
                      });
                      const result = await response.json();
                      toast({
                        title: "Gas Estimate",
                        description: `Estimated gas: ${result.gasEstimate} units`,
                        variant: "default"
                      });
                    } catch (error) {
                      toast({
                        title: "Estimation Failed",
                        description: "Unable to estimate gas costs",
                        variant: "destructive"
                      });
                    }
                  }
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Estimate Gas
              </Button>
            </div>
          </div>

          <Separator />

          <Button 
            onClick={processX402Payment}
            disabled={isProcessingPayment || !validationResult?.isAllowlisted}
            className="w-full"
          >
            {isProcessingPayment ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            ) : (
              <ArrowUpRight className="w-4 h-4 mr-2" />
            )}
            Process X402 Payment
          </Button>

          {!validationResult?.isAllowlisted && validationResult && (
            <p className="text-sm text-muted-foreground text-center">
              Wallet must be allowlisted to process X402 payments
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}