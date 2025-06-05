import { useState, useEffect } from "react";
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Shield, 
  Zap, 
  Star, 
  TrendingUp, 
  Bot,
  Target,
  CheckCircle,
  Unlock,
  DollarSign
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface WalletPrivileges {
  isPremium: boolean;
  canUseX402: boolean;
  maxTransactionAmount: number;
  dailyLimit: number;
  features: string[];
}

interface WalletStatus {
  address: string;
  isAllowlisted: boolean;
  privileges: WalletPrivileges;
  specialFeatures: string[];
}

export function WalletPrivilegeDisplay() {
  const { address, isConnected } = useAccount();
  const [walletStatus, setWalletStatus] = useState<WalletStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address && isConnected) {
      fetchWalletPrivileges();
    }
  }, [address, isConnected]);

  const fetchWalletPrivileges = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const response = await apiRequest('GET', `/api/wallet/privileges/${address}`);
      setWalletStatus(response);
    } catch (error) {
      console.error('Failed to fetch wallet privileges:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'unlimited_x402_transactions': return Zap;
      case 'premium_ai_signals': return Bot;
      case 'institutional_access': return Crown;
      case 'advanced_analytics': return TrendingUp;
      case 'priority_support': return Star;
      default: return CheckCircle;
    }
  };

  const getFeatureLabel = (feature: string) => {
    switch (feature) {
      case 'unlimited_x402_transactions': return 'Unlimited X402 Transactions';
      case 'premium_ai_signals': return 'Premium AI Trading Signals';
      case 'institutional_access': return 'Institutional Features';
      case 'advanced_analytics': return 'Advanced Analytics';
      case 'priority_support': return 'Priority Support';
      case 'unlimited_trading_signals': return 'Unlimited Trading Signals';
      case 'premium_ai_bot_access': return 'Premium AI Bot Access';
      case 'institutional_features': return 'Institutional Features';
      case 'custom_api_limits': return 'Custom API Limits';
      case 'cross_chain_privileges': return 'Cross-Chain Privileges';
      default: return feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardContent className="p-6 text-center">
          <Unlock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-gray-400">
            Connect your wallet to view your privileges and access premium features.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading wallet privileges...</p>
        </CardContent>
      </Card>
    );
  }

  if (!walletStatus) {
    return (
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Privileges</h3>
          <p className="text-gray-400 mb-4">
            There was an issue loading your wallet privileges.
          </p>
          <Button onClick={fetchWalletPrivileges} className="bg-purple-600 hover:bg-purple-700">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Status Header */}
      <Card className={`${walletStatus.isAllowlisted 
        ? 'bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/50' 
        : 'bg-gray-900/50 border-gray-700/50'
      }`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              {walletStatus.isAllowlisted ? (
                <Crown className="w-6 h-6 mr-2 text-purple-400" />
              ) : (
                <Shield className="w-6 h-6 mr-2 text-gray-400" />
              )}
              Wallet Status
            </div>
            <Badge className={walletStatus.isAllowlisted 
              ? "bg-purple-500/20 text-purple-300 border-purple-500/50" 
              : "bg-gray-500/20 text-gray-300 border-gray-500/50"
            }>
              {walletStatus.isAllowlisted ? 'ALLOWLISTED' : 'STANDARD'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Connected Address</p>
              <p className="font-mono text-white text-sm break-all">{walletStatus.address}</p>
            </div>
            
            {walletStatus.isAllowlisted && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-5 h-5 text-purple-400" />
                  <h4 className="font-semibold text-purple-300">Premium Allowlisted Wallet</h4>
                </div>
                <p className="text-purple-200 text-sm">
                  Your wallet has been granted premium access with enhanced privileges and unlimited features.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Privilege Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-400" />
              Transaction Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Max Transaction</span>
              <span className="text-white font-medium">
                {formatCurrency(walletStatus.privileges.maxTransactionAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Daily Limit</span>
              <span className="text-white font-medium">
                {formatCurrency(walletStatus.privileges.dailyLimit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">X402 Protocol</span>
              <Badge className={walletStatus.privileges.canUseX402 
                ? "bg-green-500/20 text-green-300 border-green-500/50" 
                : "bg-red-500/20 text-red-300 border-red-500/50"
              }>
                {walletStatus.privileges.canUseX402 ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-cyan-400" />
              Account Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Membership</span>
              <Badge className={walletStatus.privileges.isPremium 
                ? "bg-purple-500/20 text-purple-300 border-purple-500/50" 
                : "bg-gray-500/20 text-gray-300 border-gray-500/50"
              }>
                {walletStatus.privileges.isPremium ? 'Premium' : 'Standard'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Features</span>
              <span className="text-white font-medium">
                {walletStatus.privileges.features.length} Available
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Special Access</span>
              <span className="text-white font-medium">
                {walletStatus.specialFeatures.length} Features
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Features */}
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-400" />
            Available Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {walletStatus.privileges.features.map((feature, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-800/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-white">{getFeatureLabel(feature)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Special Premium Features */}
      {walletStatus.specialFeatures.length > 0 && (
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Crown className="w-5 h-5 mr-2 text-purple-400" />
              Premium Exclusive Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {walletStatus.specialFeatures.map((feature, index) => {
                const Icon = getFeatureIcon(feature);
                return (
                  <div key={index} className="flex items-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <Icon className="w-5 h-5 text-purple-400 mr-3" />
                    <span className="text-purple-200">{getFeatureLabel(feature)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}