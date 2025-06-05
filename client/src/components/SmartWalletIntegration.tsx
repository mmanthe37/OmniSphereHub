import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Wallet, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Plus,
  ExternalLink,
  Key,
  Fuel,
  Network,
  Clock
} from "lucide-react";

interface SponsorshipStatus {
  isSponsored: boolean;
  policyId?: string;
  dailyTransactionCount: number;
  dailyLimit: number;
  gasRemaining: string;
}

interface PaymasterService {
  url: string;
  context: {
    policyId: string;
    entryPoint: string;
    chainId: number;
  };
}

interface SponsorshipPolicy {
  id: string;
  name: string;
  rules: {
    addressAllowlist: string[];
    maxGasPerTransaction: string;
    maxTransactionsPerDay: number;
    contractWhitelist: string[];
  };
  active: boolean;
}

interface UserOperation {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData?: string;
  signature: string;
}

export function SmartWalletIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChainId, setSelectedChainId] = useState(8453); // Base mainnet
  const [testAddress, setTestAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Fetch sponsorship policies
  const { data: policiesData } = useQuery({
    queryKey: ["/api/smart-wallet/policies"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch paymaster service for selected chain
  const { data: paymasterService } = useQuery({
    queryKey: ["/api/smart-wallet/paymaster-service", selectedChainId],
    enabled: !!selectedChainId,
  });

  // Fetch sponsorship status for test address
  const { data: sponsorshipStatus, refetch: refetchSponsorship } = useQuery({
    queryKey: ["/api/smart-wallet/sponsorship", testAddress],
    enabled: !!testAddress && testAddress.length === 42,
  });

  // Coinbase Smart Wallet connection
  const connectSmartWallet = async () => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Get connected accounts
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          setTestAddress(accounts[0]);
          toast({
            title: "Smart Wallet Connected",
            description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
        }
      } else {
        // Redirect to Coinbase Wallet if not available
        window.open('https://www.coinbase.com/wallet', '_blank');
        toast({
          title: "Install Coinbase Wallet",
          description: "Please install Coinbase Wallet to continue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect Smart Wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Test user operation validation
  const validateOperation = useMutation({
    mutationFn: async (userOp: Partial<UserOperation>) => {
      return await apiRequest("POST", "/api/smart-wallet/validate-operation", {
        userOperation: userOp,
        entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Operation Validated",
        description: data.valid ? "UserOperation is valid for sponsorship" : `Validation failed: ${data.reason}`,
        variant: data.valid ? "default" : "destructive",
      });
    },
  });

  // Prepare gasless transaction calls
  const prepareCalls = useMutation({
    mutationFn: async (callData: { calls: any[], sender: string, chainId: number }) => {
      return await apiRequest("POST", "/api/smart-wallet/prepare-calls", callData);
    },
    onSuccess: (data) => {
      toast({
        title: "Calls Prepared",
        description: "Transaction calls prepared with paymaster service",
      });
    },
  });

  const testUserOperation: Partial<UserOperation> = {
    sender: testAddress || "0x2d45014917c4bce08b6fb2b3a53960692b5b744b",
    nonce: "0x1",
    initCode: "0x",
    callData: "0x",
    callGasLimit: "0x76c0", // 30,400 gas
    verificationGasLimit: "0x186a0", // 100,000 gas
    preVerificationGas: "0x5208", // 21,000 gas
    maxFeePerGas: "0x59682f00", // 1.5 gwei
    maxPriorityFeePerGas: "0x59682f00", // 1.5 gwei
    signature: "0x"
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <CardTitle>Smart Wallet Integration</CardTitle>
          </div>
          <Badge variant="outline" className="text-blue-600">
            ERC-4337 Compliant
          </Badge>
        </div>
        <CardDescription>
          Gas-free transactions with ERC-4337 Account Abstraction and ERC-7677 paymaster services
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connect">Connect</TabsTrigger>
            <TabsTrigger value="sponsorship">Sponsorship</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Smart Wallet Connection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={connectSmartWallet}
                    disabled={isConnecting}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Wallet className="h-4 w-4 mr-2" />
                    )}
                    Connect Coinbase Smart Wallet
                  </Button>
                  
                  {testAddress && (
                    <div className="text-sm space-y-1">
                      <Label>Connected Address</Label>
                      <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {testAddress}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Network Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Chain ID</Label>
                    <select 
                      value={selectedChainId} 
                      onChange={(e) => setSelectedChainId(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    >
                      <option value={8453}>Base Mainnet (8453)</option>
                      <option value={84532}>Base Sepolia (84532)</option>
                    </select>
                  </div>
                  
{paymasterService && typeof paymasterService === 'object' && 'context' in paymasterService ? (
                    <div className="text-sm space-y-1">
                      <Label>Paymaster Service</Label>
                      <div className="font-mono text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Active</span>
                        </div>
                        <div>Policy: {String((paymasterService as PaymasterService).context?.policyId || 'default')}</div>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Smart Wallet enables gasless transactions through ERC-4337 Account Abstraction. 
                Transactions are sponsored by the OmniSphere paymaster for allowlisted addresses.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="sponsorship" className="space-y-4">
            <div className="space-y-3">
              <Label>Test Address Sponsorship</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="0x... (42 characters)"
                  value={testAddress}
                  onChange={(e) => setTestAddress(e.target.value)}
                  className="font-mono text-sm"
                />
                <Button 
                  onClick={() => refetchSponsorship()}
                  disabled={!testAddress || testAddress.length !== 42}
                  size="sm"
                >
                  Check Status
                </Button>
              </div>
            </div>

{sponsorshipStatus && typeof sponsorshipStatus === 'object' && 'isSponsored' in sponsorshipStatus ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    {(sponsorshipStatus as SponsorshipStatus).isSponsored ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>
                      {(sponsorshipStatus as SponsorshipStatus).isSponsored ? "Sponsored Address" : "Not Sponsored"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Policy ID</Label>
                      <div className="font-mono">{(sponsorshipStatus as SponsorshipStatus).policyId || "None"}</div>
                    </div>
                    <div>
                      <Label>Daily Transactions</Label>
                      <div>{(sponsorshipStatus as SponsorshipStatus).dailyTransactionCount} / {(sponsorshipStatus as SponsorshipStatus).dailyLimit}</div>
                    </div>
                  </div>
                  <div>
                    <Label>Gas Remaining</Label>
                    <div className="font-mono text-sm">{(sponsorshipStatus as SponsorshipStatus).gasRemaining} wei</div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="operations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Test UserOperation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => validateOperation.mutate(testUserOperation)}
                    disabled={validateOperation.isPending}
                    className="w-full"
                  >
                    {validateOperation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2" />
                    )}
                    Validate Operation
                  </Button>
                  
                  <div className="text-xs space-y-1">
                    <Label>Sample UserOp</Label>
                    <div className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-32 overflow-y-auto">
                      {JSON.stringify(testUserOperation, null, 2)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Gasless Transaction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => prepareCalls.mutate({
                      calls: [
                        {
                          to: "0x2d45014917c4bce08b6fb2b3a53960692b5b744b",
                          value: "0x0",
                          data: "0x"
                        }
                      ],
                      sender: testAddress || "0x2d45014917c4bce08b6fb2b3a53960692b5b744b",
                      chainId: selectedChainId
                    })}
                    disabled={prepareCalls.isPending}
                    className="w-full"
                  >
                    {prepareCalls.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    Prepare Gasless Call
                  </Button>
                  
                  <Alert>
                    <Fuel className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      This will prepare a gasless transaction call with ERC-7677 paymaster service capabilities.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            {policiesData && typeof policiesData === 'object' && 'policies' in policiesData && Array.isArray((policiesData as any).policies) ? (
              (policiesData as any).policies.map((policy: SponsorshipPolicy) => (
                <Card key={policy.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{policy.name}</CardTitle>
                      <Badge variant={policy.active ? "default" : "secondary"}>
                        {policy.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>Max Gas Per Transaction</Label>
                        <div className="font-mono">{policy.rules.maxGasPerTransaction}</div>
                      </div>
                      <div>
                        <Label>Daily Transaction Limit</Label>
                        <div>{policy.rules.maxTransactionsPerDay}</div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Allowlisted Addresses ({policy.rules.addressAllowlist.length})</Label>
                      <div className="max-h-24 overflow-y-auto space-y-1">
                        {policy.rules.addressAllowlist.map((address, index) => (
                          <div key={index} className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">
                            {address}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Whitelisted Contracts ({policy.rules.contractWhitelist.length})</Label>
                      <div className="max-h-24 overflow-y-auto space-y-1">
                        {policy.rules.contractWhitelist.map((contract, index) => (
                          <div key={index} className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">
                            {contract}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Loading sponsorship policies...
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Network className="h-3 w-3" />
              <span>Base Network</span>
            </div>
            <div className="flex items-center space-x-1">
              <Key className="h-3 w-3" />
              <span>ERC-4337</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>ERC-7677</span>
            </div>
          </div>
          <a 
            href="https://docs.base.org/identity/smart-wallet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-blue-500"
          >
            <span>Learn More</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}