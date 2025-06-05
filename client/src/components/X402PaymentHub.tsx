import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Square, 
  Bot, 
  Zap, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Shield,
  Network,
  ArrowRight,
  Coins,
  Activity
} from "lucide-react";

interface X402Transaction {
  id: string;
  paymentHeader: {
    protocol: 'x402';
    amount: number;
    currency: string;
    receiver: string;
    memo?: string;
    timestamp: number;
  };
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  gasUsed?: number;
  fee: number;
}

interface StreamingPayment {
  id: string;
  rate: number;
  recipient: string;
  totalPaid: number;
  startTime: string;
  active: boolean;
}

interface PaymentService {
  service: string;
  endpoint: string;
  supportedCurrencies: string[];
  fees: Record<string, number>;
}

export default function X402PaymentHub() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [paymentAmount, setPaymentAmount] = useState("0.01");
  const [paymentCurrency, setPaymentCurrency] = useState("USDC");
  const [paymentReceiver, setPaymentReceiver] = useState("0x742d35Cc7370C4532C3F3D3f4F41e85b39fD3f97");
  const [paymentMemo, setPaymentMemo] = useState("");
  
  const [streamRate, setStreamRate] = useState("0.01");
  const [streamRecipient, setStreamRecipient] = useState("0x742d35Cc7370C4532C3F3D3f4F41e85b39fD3f97");
  const [activeStreamId, setActiveStreamId] = useState<string | null>(null);
  
  const [aiAgentId, setAiAgentId] = useState("trading-bot-alpha");
  const [aiMaxAmount, setAiMaxAmount] = useState("1000");
  const [aiPaymentAmount, setAiPaymentAmount] = useState("50");
  const [aiPaymentPurpose, setAiPaymentPurpose] = useState("Arbitrage execution");

  // Queries
  const { data: transactions = [] } = useQuery({
    queryKey: ['/api/x402/transactions'],
    refetchInterval: 2000
  });

  const { data: activeStreams = [] } = useQuery({
    queryKey: ['/api/x402/streams'],
    refetchInterval: 1000
  });

  const { data: paymentServices = [] } = useQuery({
    queryKey: ['/api/x402/discovery']
  });

  // Mutations
  const createPaymentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/x402/payment", data),
    onSuccess: () => {
      toast({
        title: "X402 Payment Created",
        description: "Payment transaction initiated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/x402/transactions'] });
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Failed to create X402 payment",
        variant: "destructive"
      });
    }
  });

  const startStreamMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/x402/stream/start", data),
    onSuccess: (data: any) => {
      setActiveStreamId(data.streamId);
      toast({
        title: "Payment Stream Started",
        description: `Streaming ${streamRate} USDC/second`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/x402/streams'] });
    },
    onError: () => {
      toast({
        title: "Stream Failed",
        description: "Failed to start payment stream",
        variant: "destructive"
      });
    }
  });

  const stopStreamMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/x402/stream/stop", data),
    onSuccess: (data: any) => {
      setActiveStreamId(null);
      toast({
        title: "Payment Stream Stopped",
        description: `Total paid: $${data.totalPaid.toFixed(2)}`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/x402/streams'] });
    },
    onError: () => {
      toast({
        title: "Stop Failed",
        description: "Failed to stop payment stream",
        variant: "destructive"
      });
    }
  });

  const authorizeAIMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/x402/ai-agent/authorize", data),
    onSuccess: (data: any) => {
      toast({
        title: "AI Agent Authorized",
        description: `${data.agentId} can now make autonomous payments up to $${data.authorizedAmount}`
      });
    },
    onError: () => {
      toast({
        title: "Authorization Failed",
        description: "Failed to authorize AI agent",
        variant: "destructive"
      });
    }
  });

  const aiPaymentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/x402/ai-agent/payment", data),
    onSuccess: () => {
      toast({
        title: "AI Payment Processed",
        description: "AI agent executed autonomous payment"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/x402/transactions'] });
    },
    onError: () => {
      toast({
        title: "AI Payment Failed",
        description: "Failed to process AI agent payment",
        variant: "destructive"
      });
    }
  });

  const handleCreatePayment = () => {
    createPaymentMutation.mutate({
      amount: parseFloat(paymentAmount),
      currency: paymentCurrency,
      receiver: paymentReceiver,
      memo: paymentMemo
    });
  };

  const handleStartStream = () => {
    startStreamMutation.mutate({
      rate: parseFloat(streamRate),
      recipient: streamRecipient
    });
  };

  const handleStopStream = () => {
    if (activeStreamId) {
      stopStreamMutation.mutate({ streamId: activeStreamId });
    }
  };

  const handleAuthorizeAI = () => {
    authorizeAIMutation.mutate({
      agentId: aiAgentId,
      maxAmount: parseFloat(aiMaxAmount)
    });
  };

  const handleAIPayment = () => {
    aiPaymentMutation.mutate({
      agentId: aiAgentId,
      amount: parseFloat(aiPaymentAmount),
      purpose: aiPaymentPurpose
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const totalStreamValue = activeStreams.reduce((sum: number, stream: StreamingPayment) => sum + stream.totalPaid, 0);
  const recentTransactions = transactions.slice(-5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Zap className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              X402 Payment Protocol Hub
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Advanced micropayment streaming with AI agent autonomous transactions. 
            Process micro-payments at $0.01/second with institutional-grade security.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Transactions</p>
                  <p className="text-2xl font-bold text-white">{transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Active Streams</p>
                  <p className="text-2xl font-bold text-white">{activeStreams.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Coins className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Stream Value</p>
                  <p className="text-2xl font-bold text-white">${totalStreamValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Network className="h-8 w-8 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-400">Services</p>
                  <p className="text-2xl font-bold text-white">{paymentServices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="payments">One-time Payments</TabsTrigger>
            <TabsTrigger value="streaming">Payment Streaming</TabsTrigger>
            <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
            <TabsTrigger value="discovery">Service Discovery</TabsTrigger>
          </TabsList>

          {/* One-time Payments */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <DollarSign className="h-5 w-5" />
                    Create X402 Payment
                  </CardTitle>
                  <CardDescription>
                    Send instant micropayments with X402 protocol
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        value={paymentCurrency}
                        onChange={(e) => setPaymentCurrency(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="receiver">Receiver Address</Label>
                    <Input
                      id="receiver"
                      value={paymentReceiver}
                      onChange={(e) => setPaymentReceiver(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="memo">Memo (Optional)</Label>
                    <Input
                      id="memo"
                      value={paymentMemo}
                      onChange={(e) => setPaymentMemo(e.target.value)}
                      placeholder="Payment description"
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCreatePayment}
                    disabled={createPaymentMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {createPaymentMutation.isPending ? "Processing..." : "Send Payment"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {recentTransactions.map((tx: X402Transaction) => (
                        <div key={tx.id} className="p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`${getStatusColor(tx.status)} text-white`}>
                              {tx.status}
                            </Badge>
                            <span className="text-sm text-gray-400">
                              {formatTime(tx.paymentHeader.timestamp)}
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Amount:</span>
                              <span className="text-white">{tx.paymentHeader.amount} {tx.paymentHeader.currency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Fee:</span>
                              <span className="text-white">{tx.fee.toFixed(4)} {tx.paymentHeader.currency}</span>
                            </div>
                            {tx.paymentHeader.memo && (
                              <div className="text-xs text-gray-500 mt-2">
                                {tx.paymentHeader.memo}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payment Streaming */}
          <TabsContent value="streaming" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="h-5 w-5" />
                    Micropayment Streaming
                  </CardTitle>
                  <CardDescription>
                    Stream payments at $0.01/second rate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="streamRate">Rate (per second)</Label>
                    <Input
                      id="streamRate"
                      type="number"
                      step="0.01"
                      value={streamRate}
                      onChange={(e) => setStreamRate(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="streamRecipient">Recipient Address</Label>
                    <Input
                      id="streamRecipient"
                      value={streamRecipient}
                      onChange={(e) => setStreamRecipient(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleStartStream}
                      disabled={startStreamMutation.isPending || activeStreamId !== null}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Stream
                    </Button>
                    
                    <Button 
                      onClick={handleStopStream}
                      disabled={stopStreamMutation.isPending || activeStreamId === null}
                      variant="outline"
                      className="flex-1"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop Stream
                    </Button>
                  </div>

                  {activeStreamId && (
                    <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <p className="text-sm text-green-400 font-medium">
                        Stream Active: {activeStreamId}
                      </p>
                      <p className="text-xs text-gray-400">
                        Streaming {streamRate} USDC/second
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5" />
                    Active Streams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {activeStreams.map((stream: StreamingPayment) => (
                        <div key={stream.id} className="p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-green-500 text-white">Active</Badge>
                            <span className="text-sm text-gray-400">
                              ${stream.rate}/sec
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Paid:</span>
                              <span className="text-white">${stream.totalPaid.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Started:</span>
                              <span className="text-white">
                                {new Date(stream.startTime).toLocaleTimeString()}
                              </span>
                            </div>
                            <Progress 
                              value={(stream.totalPaid / 10) * 100} 
                              className="mt-2" 
                            />
                          </div>
                        </div>
                      ))}
                      {activeStreams.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                          No active payment streams
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Agents */}
          <TabsContent value="ai-agents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Bot className="h-5 w-5" />
                    AI Agent Authorization
                  </CardTitle>
                  <CardDescription>
                    Enable autonomous payments for AI trading agents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="aiAgent">AI Agent</Label>
                    <select
                      id="aiAgent"
                      value={aiAgentId}
                      onChange={(e) => setAiAgentId(e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                      <option value="trading-bot-alpha">Trading Bot Alpha</option>
                      <option value="arbitrage-scanner">Arbitrage Scanner</option>
                      <option value="yield-optimizer">Yield Optimizer</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="maxAmount">Max Authorization ($)</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      value={aiMaxAmount}
                      onChange={(e) => setAiMaxAmount(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAuthorizeAI}
                    disabled={authorizeAIMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Authorize AI Agent
                  </Button>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-white">Execute AI Payment</h4>
                    
                    <div>
                      <Label htmlFor="aiPayAmount">Amount ($)</Label>
                      <Input
                        id="aiPayAmount"
                        type="number"
                        value={aiPaymentAmount}
                        onChange={(e) => setAiPaymentAmount(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="aiPurpose">Purpose</Label>
                      <Input
                        id="aiPurpose"
                        value={aiPaymentPurpose}
                        onChange={(e) => setAiPaymentPurpose(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleAIPayment}
                      disabled={aiPaymentMutation.isPending}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Execute AI Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Bot className="h-5 w-5" />
                    AI Agent Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">Trading Bot Alpha</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Balance:</span>
                          <span className="text-white">$10,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Transactions:</span>
                          <span className="text-white">0</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">Arbitrage Scanner</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Balance:</span>
                          <span className="text-white">$5,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Transactions:</span>
                          <span className="text-white">0</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">Yield Optimizer</span>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Balance:</span>
                          <span className="text-white">$15,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Transactions:</span>
                          <span className="text-white">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Service Discovery */}
          <TabsContent value="discovery" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Network className="h-5 w-5" />
                  X402 Payment Service Discovery
                </CardTitle>
                <CardDescription>
                  Discover X402-compatible payment services and their capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paymentServices.map((service: PaymentService, index: number) => (
                    <div key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{service.service}</h4>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Endpoint:</span>
                          <span className="text-white ml-2 font-mono text-xs">{service.endpoint}</span>
                        </div>
                        
                        <div>
                          <span className="text-gray-400">Currencies:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {service.supportedCurrencies.map((currency: string) => (
                              <Badge key={currency} variant="outline" className="text-xs">
                                {currency}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-gray-400">Fees:</span>
                          <div className="mt-1 space-y-1">
                            {Object.entries(service.fees).map(([currency, fee]) => (
                              <div key={currency} className="flex justify-between text-xs">
                                <span className="text-gray-300">{currency}:</span>
                                <span className="text-white">{(fee as number * 100).toFixed(3)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}