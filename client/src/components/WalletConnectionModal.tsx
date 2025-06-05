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
  const [showAllWalletsModal, setShowAllWalletsModal] = useState(false);

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
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700 overflow-hidden">
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
            <ScrollArea className="h-[60vh] pr-4">
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
                  <svg className="w-8 h-8" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                </button>
                
                {/* Apple */}
                <button
                  className="w-16 h-16 rounded-full bg-black hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  onClick={() => connectWalletMutation.mutate('apple')}
                >
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                  </svg>
                </button>
                
                {/* Facebook */}
                <button
                  className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  onClick={() => connectWalletMutation.mutate('facebook')}
                >
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                
                {/* X (Twitter) */}
                <button
                  className="w-16 h-16 rounded-full bg-black hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  onClick={() => connectWalletMutation.mutate('twitter')}
                >
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                
                {/* Discord */}
                <button
                  className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  onClick={() => connectWalletMutation.mutate('discord')}
                >
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.196.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
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
                  onClick={() => setShowAllWalletsModal(true)}
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
            </ScrollArea>
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

    {/* All Wallets Modal */}
    <Dialog open={showAllWalletsModal} onOpenChange={setShowAllWalletsModal}>
      <DialogContent className="max-w-3xl bg-gray-900 border-gray-700 text-white max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">All Wallets (300+)</DialogTitle>
          <DialogDescription className="text-gray-400">
            Connect to any supported wallet provider
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Browser Extensions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-5 h-5 bg-orange-500 rounded"></div>
                Browser Extensions
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'metamask', name: 'MetaMask', logo: (
                    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
                      <path d="M37.0668 5.70203L22.1336 16.7687L25.0669 9.57203L37.0668 5.70203Z" fill="#E17726"/>
                      <path d="M2.86683 5.70203L17.6002 16.9354L14.8669 9.57203L2.86683 5.70203Z" fill="#E27625"/>
                      <path d="M31.7335 27.9021L27.8669 33.6021L36.2669 35.9021L38.7335 28.1021L31.7335 27.9021Z" fill="#E27625"/>
                      <path d="M1.33351 28.1021L3.80018 35.9021L12.2002 33.6021L8.33351 27.9021L1.33351 28.1021Z" fill="#E27625"/>
                    </svg>
                  )},
                  { id: 'brave', name: 'Brave Wallet', logo: (
                    <svg className="w-8 h-8" fill="#FB542B" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 1.5a10.5 10.5 0 110 21 10.5 10.5 0 010-21z"/>
                    </svg>
                  )},
                  { id: 'coinbase_wallet', name: 'Coinbase Wallet', logo: (
                    <svg className="w-8 h-8" fill="#0052FF" viewBox="0 0 24 24">
                      <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm-3-12a3 3 0 116 0 3 3 0 01-6 0z"/>
                    </svg>
                  )},
                  { id: 'phantom', name: 'Phantom', logo: (
                    <svg className="w-8 h-8" fill="#AB9FF2" viewBox="0 0 24 24">
                      <path d="M20.05 10.654C20.05 5.204 16.098.882 11.027.882 4.84.882.412 5.586.412 11.435c0 4.585 2.925 8.495 7.005 9.927.384-.674.552-1.49.552-2.365V12c0-.552.448-1 1-1s1 .448 1 1v6.997c0 .552-.448 1-1 1s-1-.448-1-1v-.632c-.64.24-1.34.369-2.069.369-2.925 0-5.369-2.304-5.369-5.369s2.444-5.369 5.369-5.369c.729 0 1.43.129 2.069.369V12c0-.552.448-1 1-1s1 .448 1 1v6.997c0 2.073-1.367 3.82-3.246 4.378C18.078 21.947 20.05 16.58 20.05 10.654z"/>
                    </svg>
                  )},
                  { id: 'rabby', name: 'Rabby', logo: (
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
                  )},
                  { id: 'frame', name: 'Frame', logo: (
                    <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
                  )},
                  { id: 'tally', name: 'Tally Ho', logo: (
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                  )},
                  { id: 'mathwallet', name: 'MathWallet', logo: (
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                  )}
                ].map((wallet) => (
                  <button
                    key={wallet.id}
                    className="flex flex-col items-center p-3 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      connectWalletMutation.mutate(wallet.id);
                      setShowAllWalletsModal(false);
                    }}
                  >
                    <div className="mb-2">{wallet.logo}</div>
                    <span className="text-xs text-white text-center font-medium">{wallet.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Wallets */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded"></div>
                Mobile Wallets
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'trust_wallet', name: 'Trust Wallet', logo: (
                    <svg className="w-8 h-8" fill="#3375BB" viewBox="0 0 24 24">
                      <path d="M12 0L2 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-10-5z"/>
                    </svg>
                  )},
                  { id: 'rainbow', name: 'Rainbow', logo: (
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">🌈</div>
                  )},
                  { id: 'argent', name: 'Argent', logo: (
                    <svg className="w-8 h-8" fill="#FF875B" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  )},
                  { id: 'imtoken', name: 'imToken', logo: (
                    <svg className="w-8 h-8" fill="#11C4D1" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <path fill="white" d="M8 12h8M12 8v8"/>
                    </svg>
                  )},
                  { id: 'exodus', name: 'Exodus', logo: (
                    <svg className="w-8 h-8" fill="#0B1426" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  )},
                  { id: 'coinomi', name: 'Coinomi', logo: (
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                  )},
                  { id: 'safepal', name: 'SafePal', logo: (
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                  )},
                  { id: 'tokenpocket', name: 'TokenPocket', logo: (
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">TP</div>
                  )}
                ].map((wallet) => (
                  <button
                    key={wallet.id}
                    className="flex flex-col items-center p-3 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      connectWalletMutation.mutate(wallet.id);
                      setShowAllWalletsModal(false);
                    }}
                  >
                    <div className="mb-2">{wallet.logo}</div>
                    <span className="text-xs text-white text-center font-medium">{wallet.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware Wallets */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded"></div>
                Hardware Wallets
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'ledger', name: 'Ledger', logo: (
                    <svg className="w-8 h-8" fill="white" viewBox="0 0 24 24">
                      <path d="M2 2h6v6H2V2zm14 0h6v6h-6V2zM2 16h6v6H2v-6zm14 0h6v6h-6v-6z"/>
                    </svg>
                  )},
                  { id: 'trezor', name: 'Trezor', logo: (
                    <svg className="w-8 h-8" fill="#00D7AA" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  )},
                  { id: 'keystone', name: 'Keystone', logo: (
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
                  )},
                  { id: 'bitbox', name: 'BitBox', logo: (
                    <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center text-white font-bold">BB</div>
                  )}
                ].map((wallet) => (
                  <button
                    key={wallet.id}
                    className="flex flex-col items-center p-3 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      connectWalletMutation.mutate(wallet.id);
                      setShowAllWalletsModal(false);
                    }}
                  >
                    <div className="mb-2">{wallet.logo}</div>
                    <span className="text-xs text-white text-center font-medium">{wallet.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Exchange Wallets */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-500 rounded"></div>
                Exchange Wallets
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'binance_wallet', name: 'Binance', logo: (
                    <svg className="w-8 h-8" fill="#F3BA2F" viewBox="0 0 24 24">
                      <path d="M12 2L15.5 5.5L19 2L22.5 5.5L19 9L15.5 5.5L12 2Z"/>
                    </svg>
                  )},
                  { id: 'okx_wallet', name: 'OKX Wallet', logo: (
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">OKX</div>
                  )},
                  { id: 'crypto_com', name: 'Crypto.com', logo: (
                    <svg className="w-8 h-8" fill="#003CDA" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  )},
                  { id: 'kucoin', name: 'KuCoin', logo: (
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">KC</div>
                  )}
                ].map((wallet) => (
                  <button
                    key={wallet.id}
                    className="flex flex-col items-center p-3 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      connectWalletMutation.mutate(wallet.id);
                      setShowAllWalletsModal(false);
                    }}
                  >
                    <div className="mb-2">{wallet.logo}</div>
                    <span className="text-xs text-white text-center font-medium">{wallet.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
    </>
  );
}