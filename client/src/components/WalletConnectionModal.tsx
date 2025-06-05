import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { WalletOnboardingWizard } from './WalletOnboardingWizard';
import { walletManager } from '@/lib/walletConnection';
import { 
  Wallet, 
  CreditCard, 
  Smartphone, 
  HardDrive, 
  Building,
  QrCode,
  Download,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Percent,
  Shield,
  Zap,
  Copy,
  RefreshCw
} from "lucide-react";

interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'browser' | 'mobile' | 'hardware' | 'institutional';
  supported: boolean;
  deepLink?: string;
  downloadUrl?: string;
}

interface ConnectedWallet {
  address: string;
  provider: string;
  chainId: number;
  balance: number;
  network: string;
  isConnected: boolean;
  lastConnected: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'crypto' | 'wallet' | 'payment_service';
  name: string;
  description: string;
  icon: string;
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  limits: {
    min: number;
    max: number;
    daily: number;
  };
  processingTime: string;
  supported: boolean;
}

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  fees: number;
  destinationAddress: string;
  timestamp: string;
  confirmations?: number;
  txHash?: string;
}

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'connect' | 'payment';
}

export default function WalletConnectionModal({ isOpen, onClose, mode }: WalletConnectionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("100");
  const [paymentCurrency, setPaymentCurrency] = useState("USD");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [currentStep, setCurrentStep] = useState<'select' | 'connect' | 'payment' | 'confirm'>('select');
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);

  // Queries
  const { data: walletProviders = [] } = useQuery<WalletProvider[]>({
    queryKey: ['/api/wallet/providers'],
    enabled: isOpen
  });

  const { data: connectedWallets = [] } = useQuery<ConnectedWallet[]>({
    queryKey: ['/api/wallet/connected'],
    enabled: isOpen,
    refetchInterval: 5000
  });

  const { data: paymentMethods = [] } = useQuery<PaymentMethod[]>({
    queryKey: ['/api/payment/methods'],
    enabled: isOpen && mode === 'payment'
  });

  const { data: paymentHistory = [] } = useQuery<PaymentTransaction[]>({
    queryKey: ['/api/payment/history'],
    enabled: isOpen && mode === 'payment'
  });

  // Browser-based wallet connections
  const connectWalletMutation = useMutation({
    mutationFn: async (walletId: string) => {
      // Handle social authentication
      if (['google', 'facebook', 'twitter', 'discord', 'apple'].includes(walletId)) {
        const response = await fetch(`/api/auth/social/${walletId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
      }
      // Handle regular wallet connections
      return await walletManager.connectWallet(walletId);
    },
    onSuccess: (walletData: any) => {
      toast({
        title: "Wallet Connected",
        description: `Successfully connected ${walletData.provider} with gasless transactions enabled`
      });
      setCurrentStep('confirm');
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/connected'] });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
    }
  });

  const disconnectWalletMutation = useMutation({
    mutationFn: (address: string) => apiRequest("POST", "/api/wallet/disconnect", { address }),
    onSuccess: () => {
      toast({
        title: "Wallet Disconnected",
        description: "Wallet has been disconnected successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/connected'] });
    }
  });

  const initiatePaymentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/payment/initiate", data),
    onSuccess: (data: any) => {
      if (data.success) {
        toast({
          title: "Payment Initiated",
          description: `Transaction ID: ${data.transaction.id}`
        });
        setCurrentStep('confirm');
        queryClient.invalidateQueries({ queryKey: ['/api/payment/history'] });
      } else {
        toast({
          title: "Payment Failed",
          description: data.error || "Failed to initiate payment",
          variant: "destructive"
        });
      }
    }
  });

  const handleWalletConnect = (walletId: string) => {
    setSelectedWallet(walletId);
    setCurrentStep('connect');
    connectWalletMutation.mutate(walletId);
  };

  const handleWalletDisconnect = (address: string) => {
    disconnectWalletMutation.mutate(address);
  };

  const handlePaymentInitiate = () => {
    if (!selectedPaymentMethod || !paymentAmount || !destinationAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    initiatePaymentMutation.mutate({
      amount: parseFloat(paymentAmount),
      currency: paymentCurrency,
      paymentMethodId: selectedPaymentMethod,
      destinationAddress
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'browser': return <CreditCard className="h-5 w-5" />;
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'hardware': return <HardDrive className="h-5 w-5" />;
      case 'institutional': return <Building className="h-5 w-5" />;
      default: return <Wallet className="h-5 w-5" />;
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'bank': return <Building className="h-5 w-5" />;
      case 'crypto': return <Wallet className="h-5 w-5" />;
      case 'wallet': return <Smartphone className="h-5 w-5" />;
      case 'payment_service': return <Zap className="h-5 w-5" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard"
    });
  };

  const groupedWallets = walletProviders.reduce((acc, wallet) => {
    if (!acc[wallet.category]) {
      acc[wallet.category] = [];
    }
    acc[wallet.category].push(wallet);
    return acc;
  }, {} as Record<string, WalletProvider[]>);

  const groupedPaymentMethods = paymentMethods.reduce((acc, method) => {
    if (!acc[method.type]) {
      acc[method.type] = [];
    }
    acc[method.type].push(method);
    return acc;
  }, {} as Record<string, PaymentMethod[]>);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('select');
      setSelectedWallet(null);
      setSelectedPaymentMethod(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {mode === 'connect' ? 'Connect Wallet' : 'Payment On-Ramp'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'connect' 
              ? 'Connect your crypto wallet to access OmniSphere features'
              : 'Add funds to your account using various payment methods'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Onboarding Wizard Integration */}
        {showOnboardingWizard && (
          <WalletOnboardingWizard
            isOpen={showOnboardingWizard}
            onClose={() => setShowOnboardingWizard(false)}
            onWalletConnected={(wallet) => {
              setShowOnboardingWizard(false);
              onClose();
              toast({
                title: "Wallet Connected Successfully",
                description: `Your ${wallet.provider} wallet is now connected with gasless transactions enabled`
              });
            }}
          />
        )}

        <Tabs defaultValue={mode === 'connect' ? 'wallets' : 'payment'} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Wallet Connection Tab */}
          <TabsContent value="wallets" className="space-y-4">
            {connectedWallets.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Connected Wallets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {connectedWallets.map((wallet) => (
                    <div key={wallet.address} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-full">
                          <Wallet className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{wallet.provider}</p>
                          <p className="text-sm text-gray-400">{formatAddress(wallet.address)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{wallet.network}</Badge>
                        <span className="text-sm text-green-400">{formatCurrency(wallet.balance)}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(wallet.address)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleWalletDisconnect(wallet.address)}
                          disabled={disconnectWalletMutation.isPending}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Guided Setup Button */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">New to Web3?</h3>
                    <p className="text-blue-100">
                      Get step-by-step guidance to set up your first crypto wallet with gasless transactions
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowOnboardingWizard(true)}
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Guided Setup
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Login Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white text-center mb-6">Connect with Social Account</h3>
              <div className="grid grid-cols-5 gap-4 justify-items-center">
                {/* Google */}
                <button
                  className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  onClick={() => connectWalletMutation.mutate('google')}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">G</span>
                  </div>
                </button>
                
                {/* Apple */}
                <button
                  className="w-16 h-16 rounded-full bg-black hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  onClick={() => connectWalletMutation.mutate('apple')}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className="text-white text-xl">🍎</span>
                  </div>
                </button>
                
                {/* Facebook */}
                <button
                  className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  onClick={() => connectWalletMutation.mutate('facebook')}
                >
                  <span className="text-white font-bold text-xl">f</span>
                </button>
                
                {/* X (Twitter) */}
                <button
                  className="w-16 h-16 rounded-full bg-black hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  onClick={() => connectWalletMutation.mutate('twitter')}
                >
                  <span className="text-white font-bold text-xl">𝕏</span>
                </button>
                
                {/* Discord */}
                <button
                  className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  onClick={() => connectWalletMutation.mutate('discord')}
                >
                  <span className="text-white text-xl">💬</span>
                </button>
              </div>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Featured Wallets */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Popular Wallets</h3>
              <div className="space-y-3">
                {/* WalletConnect */}
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-all duration-200"
                  onClick={() => connectWalletMutation.mutate('walletconnect')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">WC</span>
                    </div>
                    <span className="text-white font-medium">WalletConnect</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">QR CODE</Badge>
                </button>

                {/* Uniswap */}
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-all duration-200"
                  onClick={() => connectWalletMutation.mutate('uniswap')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🦄</span>
                    </div>
                    <span className="text-white font-medium">Uniswap</span>
                  </div>
                  <Badge className="bg-gray-600 text-gray-300">RECENT</Badge>
                </button>

                {/* MetaMask */}
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-all duration-200"
                  onClick={() => connectWalletMutation.mutate('metamask')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🦊</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">MetaMask</span>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </button>

                {/* Trust */}
                <button
                  className="w-full flex items-center p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-all duration-200"
                  onClick={() => connectWalletMutation.mutate('trust_wallet')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-400 rounded transform rotate-45"></div>
                    </div>
                    <span className="text-white font-medium">Trust</span>
                  </div>
                </button>

                {/* Coinbase */}
                <button
                  className="w-full flex items-center p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-all duration-200"
                  onClick={() => connectWalletMutation.mutate('coinbase_wallet')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <span className="text-white font-medium">Coinbase</span>
                  </div>
                </button>

                {/* All Wallets */}
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-all duration-200"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "Comprehensive wallet selection will be available soon"
                    });
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-white font-medium">All wallets</span>
                  </div>
                  <Badge className="bg-gray-600 text-gray-300">300+</Badge>
                </button>
              </div>
            </div>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination Address</Label>
                <Input
                  id="destination"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="0x... or wallet address"
                  className="bg-gray-800 border-gray-600"
                />
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                {Object.entries(groupedPaymentMethods).map(([type, methods]) => (
                  <div key={type}>
                    <div className="flex items-center gap-2 mb-3">
                      {getPaymentTypeIcon(type)}
                      <h3 className="text-lg font-semibold text-white capitalize">
                        {type === 'card' ? 'Credit & Debit Cards' :
                         type === 'bank' ? 'Bank Transfers' :
                         type === 'crypto' ? 'Cryptocurrency' :
                         type === 'wallet' ? 'Crypto Wallets' :
                         'Payment Services'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {methods.map((method) => (
                        <Card 
                          key={method.id}
                          className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:bg-gray-750 ${
                            selectedPaymentMethod === method.id ? 'ring-2 ring-blue-500' : ''
                          } ${!method.supported ? 'opacity-50' : ''}`}
                          onClick={() => method.supported && setSelectedPaymentMethod(method.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                  <img 
                                    src={method.icon} 
                                    alt={method.name}
                                    className="h-6 w-6"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  {getPaymentTypeIcon(method.type)}
                                </div>
                                <div>
                                  <h4 className="font-medium text-white">{method.name}</h4>
                                  <p className="text-sm text-gray-400">{method.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 text-sm">
                                  <Percent className="h-3 w-3 text-gray-400" />
                                  <span className="text-white">
                                    {method.fees.percentage}% + {formatCurrency(method.fees.fixed)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{method.processingTime}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                              <div className="text-xs text-gray-400">
                                Limits: {formatCurrency(method.limits.min)} - {formatCurrency(method.limits.max)}
                              </div>
                              {!method.supported && (
                                <Badge variant="secondary">Coming Soon</Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {selectedPaymentMethod && (
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
                <Button variant="outline" onClick={() => setSelectedPaymentMethod(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handlePaymentInitiate}
                  disabled={initiatePaymentMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {initiatePaymentMutation.isPending ? "Processing..." : "Initiate Payment"}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
                <CardDescription>Recent wallet connections and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {paymentHistory.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <p className="font-medium text-white">
                              {formatCurrency(transaction.amount, transaction.currency)}
                            </p>
                            <p className="text-sm text-gray-400">
                              {transaction.paymentMethod} • {new Date(transaction.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            transaction.status === 'completed' ? 'bg-green-500' :
                            transaction.status === 'pending' ? 'bg-yellow-500' :
                            transaction.status === 'processing' ? 'bg-blue-500' :
                            'bg-red-500'
                          }>
                            {transaction.status}
                          </Badge>
                          {transaction.txHash && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-1 h-6 text-xs"
                              onClick={() => copyToClipboard(transaction.txHash!)}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {paymentHistory.length === 0 && (
                      <div className="text-center text-gray-400 py-8">
                        <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No transaction history yet</p>
                        <p className="text-sm">Connect a wallet or make a payment to get started</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}