import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { 
  Fuel, 
  Search,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Activity,
  TrendingUp,
  Zap,
  DollarSign
} from 'lucide-react';

interface PaymasterAnalytics {
  supportedEntryPoints: string[];
  acceptedTokens: string[];
  policyId: string;
  totalSponsored: number;
}

interface UserOperationReceipt {
  userOpHash: string;
  entryPoint: string;
  sender: string;
  nonce: string;
  paymaster: string;
  actualGasCost: string;
  actualGasUsed: string;
  success: boolean;
  reason?: string;
}

interface SponsorshipInfo {
  isSponsored: boolean;
  sponsorshipLimit: string;
  sponsorshipUsed: string;
}

export function PaymasterJSONRPCDashboard() {
  const [operationHash, setOperationHash] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [operationData, setOperationData] = useState<any>(null);
  const [receiptData, setReceiptData] = useState<UserOperationReceipt | null>(null);
  const [sponsorshipData, setSponsorshipData] = useState<SponsorshipInfo | null>(null);
  const { toast } = useToast();

  const { data: analytics } = useQuery<PaymasterAnalytics>({
    queryKey: ['/api/paymaster/analytics'],
    refetchInterval: 60000
  });

  const { data: entryPoints } = useQuery<{ entryPoints: string[] }>({
    queryKey: ['/api/paymaster/entry-points'],
    refetchInterval: 300000
  });

  const { data: acceptedTokens } = useQuery<{ tokens: string[] }>({
    queryKey: ['/api/paymaster/accepted-tokens'],
    refetchInterval: 300000
  });

  const searchOperation = async () => {
    if (!operationHash) {
      toast({
        title: "Search Error",
        description: "Please enter an operation hash",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/paymaster/operation/${operationHash}`);
      if (response.ok) {
        const data = await response.json();
        setOperationData(data);
        toast({
          title: "Operation Found",
          description: "User operation data retrieved successfully",
          variant: "default"
        });
      } else {
        throw new Error('Operation not found');
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to find operation with that hash",
        variant: "destructive"
      });
    }
  };

  const getReceipt = async () => {
    if (!operationHash) {
      toast({
        title: "Receipt Error",
        description: "Please enter an operation hash",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/paymaster/receipt/${operationHash}`);
      if (response.ok) {
        const data = await response.json();
        setReceiptData(data);
        toast({
          title: "Receipt Retrieved",
          description: "Operation receipt loaded successfully",
          variant: "default"
        });
      } else {
        throw new Error('Receipt not found');
      }
    } catch (error) {
      toast({
        title: "Receipt Failed",
        description: "Unable to get receipt for that operation",
        variant: "destructive"
      });
    }
  };

  const checkSponsorship = async () => {
    if (!walletAddress) {
      toast({
        title: "Sponsorship Error",
        description: "Please enter a wallet address",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/paymaster/sponsorship/${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setSponsorshipData(data);
        toast({
          title: "Sponsorship Checked",
          description: "Sponsorship information retrieved",
          variant: "default"
        });
      } else {
        throw new Error('Sponsorship data not found');
      }
    } catch (error) {
      toast({
        title: "Check Failed",
        description: "Unable to check sponsorship for that address",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      {/* Paymaster Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="w-5 h-5" />
            Coinbase Paymaster JSON-RPC Dashboard
          </CardTitle>
          <CardDescription>
            Live access to official Coinbase Paymaster API methods and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {entryPoints?.entryPoints?.length || 1}
              </div>
              <div className="text-sm text-muted-foreground">Entry Points</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {acceptedTokens?.tokens?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Payment Tokens</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analytics?.totalSponsored || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Sponsored</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Active</div>
              <div className="text-sm text-muted-foreground">API Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Tools */}
      <Tabs defaultValue="operations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="sponsorship">Sponsorship</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Operation Lookup
              </CardTitle>
              <CardDescription>
                Search for user operations and receipts using transaction hash
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter operation hash (0x...)"
                  value={operationHash}
                  onChange={(e) => setOperationHash(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={searchOperation}>
                  <Search className="w-4 h-4 mr-1" />
                  Search
                </Button>
                <Button onClick={getReceipt} variant="outline">
                  Receipt
                </Button>
              </div>

              {operationData && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-800">User Operation</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(JSON.stringify(operationData, null, 2))}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Sender:</span>
                      <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                        {operationData.sender}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">Nonce:</span>
                      <span className="ml-2">{operationData.nonce}</span>
                    </div>
                    <div>
                      <span className="font-medium">Gas Limit:</span>
                      <span className="ml-2">{operationData.callGasLimit}</span>
                    </div>
                    <div>
                      <span className="font-medium">Max Fee:</span>
                      <span className="ml-2">{operationData.maxFeePerGas}</span>
                    </div>
                  </div>
                </div>
              )}

              {receiptData && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={receiptData.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {receiptData.success ? 'Success' : 'Failed'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(JSON.stringify(receiptData, null, 2))}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Gas Cost:</span>
                      <span className="ml-2">{receiptData.actualGasCost}</span>
                    </div>
                    <div>
                      <span className="font-medium">Gas Used:</span>
                      <span className="ml-2">{receiptData.actualGasUsed}</span>
                    </div>
                    <div>
                      <span className="font-medium">Paymaster:</span>
                      <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                        {receiptData.paymaster}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">Entry Point:</span>
                      <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                        {receiptData.entryPoint}
                      </code>
                    </div>
                  </div>
                  {receiptData.reason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                      <span className="font-medium text-red-800">Failure Reason:</span>
                      <span className="ml-2 text-red-700">{receiptData.reason}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sponsorship" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Sponsorship Checker
              </CardTitle>
              <CardDescription>
                Check sponsorship status and limits for wallet addresses
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
                <Button onClick={checkSponsorship}>
                  Check Status
                </Button>
              </div>

              {sponsorshipData && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={sponsorshipData.isSponsored ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {sponsorshipData.isSponsored ? 'Sponsored' : 'Not Sponsored'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Sponsorship Limit:</span>
                      <span className="ml-2">{sponsorshipData.sponsorshipLimit}</span>
                    </div>
                    <div>
                      <span className="font-medium">Sponsorship Used:</span>
                      <span className="ml-2">{sponsorshipData.sponsorshipUsed}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Paymaster Configuration
              </CardTitle>
              <CardDescription>
                Live configuration and supported features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {entryPoints?.entryPoints && (
                <div>
                  <Label className="text-sm font-medium">Supported Entry Points</Label>
                  <div className="mt-2 space-y-2">
                    {entryPoints.entryPoints.map((entryPoint, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{entryPoint}</code>
                        <Badge className="bg-green-100 text-green-800">v0.6</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {acceptedTokens?.tokens && acceptedTokens.tokens.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Accepted Payment Tokens</Label>
                  <div className="mt-2 space-y-2">
                    {acceptedTokens.tokens.map((token, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{token}</span>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analytics?.policyId && (
                <div>
                  <Label className="text-sm font-medium">Policy Configuration</Label>
                  <div className="mt-2 p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Policy ID:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{analytics.policyId}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(analytics.policyId)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">API Methods Available</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    'eth_supportedEntryPoints',
                    'eth_getUserOperationByHash',
                    'eth_getUserOperationReceipt',
                    'eth_sendUserOperation',
                    'eth_estimateUserOperationGas',
                    'pm_getPaymasterStubData',
                    'pm_getPaymasterData',
                    'pm_sponsorUserOperation'
                  ].map((method) => (
                    <div key={method} className="flex items-center gap-2 p-2 border rounded">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-mono">{method}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}