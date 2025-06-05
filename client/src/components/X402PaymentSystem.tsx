import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Zap, 
  TrendingUp, 
  Users, 
  Crown, 
  Bot,
  Star,
  Gift,
  Target,
  ArrowRight,
  CheckCircle,
  Clock,
  Coins
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  color: string;
}

interface PaymentRequest {
  amount: number;
  recipient: string;
  purpose: string;
  metadata?: Record<string, any>;
}

export function X402PaymentSystem() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [tipAmount, setTipAmount] = useState(1);
  const [processingPayment, setProcessingPayment] = useState(false);

  const subscriptionTiers: PricingTier[] = [
    {
      id: 'basic',
      name: 'Basic Trader',
      price: 9.99,
      period: 'month',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Real-time market data',
        'Basic trading signals',
        'Community access',
        'Mobile app access'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Trader',
      price: 29.99,
      period: 'month',
      popular: true,
      color: 'from-purple-500 to-pink-500',
      features: [
        'All Basic features',
        'AI trading bot access',
        'Advanced analytics',
        'Premium signals',
        'Copy trading',
        'Priority support'
      ]
    },
    {
      id: 'elite',
      name: 'Elite Trader',
      price: 99.99,
      period: 'month',
      color: 'from-orange-500 to-red-500',
      features: [
        'All Pro features',
        'Custom bot strategies',
        'Institutional tools',
        'Personal account manager',
        'Early access features',
        'Revenue sharing'
      ]
    }
  ];

  const handleX402Payment = async (paymentRequest: PaymentRequest) => {
    setProcessingPayment(true);
    
    try {
      // X402 protocol payment simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would integrate with X402 protocol
      console.log('X402 Payment processed:', paymentRequest);
      
      // Success notification would go here
      alert(`Payment of $${paymentRequest.amount} processed successfully!`);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleSubscription = async (tier: PricingTier) => {
    await handleX402Payment({
      amount: tier.price,
      recipient: 'omnisphere_platform',
      purpose: 'subscription',
      metadata: {
        tierId: tier.id,
        userId: user?.id || 'guest',
        duration: tier.period
      }
    });
  };

  const handleCreatorTip = async () => {
    await handleX402Payment({
      amount: tipAmount,
      recipient: 'creator_wallet',
      purpose: 'tip',
      metadata: {
        creatorId: 'example_creator',
        userId: user?.id || 'guest'
      }
    });
  };

  const revenueStreams = [
    {
      name: 'Subscription Revenue',
      current: 45000,
      target: 100000,
      growth: 15.2,
      icon: Crown,
      color: 'text-purple-400'
    },
    {
      name: 'Trading Fees',
      current: 28000,
      target: 60000,
      growth: 22.8,
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      name: 'Creator Tips',
      current: 12000,
      target: 30000,
      growth: 8.5,
      icon: Gift,
      color: 'text-pink-400'
    },
    {
      name: 'Premium Signals',
      current: 18000,
      target: 40000,
      growth: 12.3,
      icon: Bot,
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Dashboard */}
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            X402 Protocol Revenue Streams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {revenueStreams.map((stream, index) => {
              const Icon = stream.icon;
              const percentage = (stream.current / stream.target) * 100;
              
              return (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${stream.color}`} />
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                      +{stream.growth}%
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-white text-sm">{stream.name}</h4>
                  <p className="text-2xl font-bold text-white">${stream.current.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">Target: ${stream.target.toLocaleString()}</p>
                  <Progress value={percentage} className="mt-2 h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Tiers */}
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Premium Subscriptions</CardTitle>
          <p className="text-gray-400">Choose your trading plan with X402 instant payments</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedTier === tier.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                } ${tier.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-white">${tier.price}</span>
                    <span className="text-gray-400 ml-1">/{tier.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscription(tier)}
                  disabled={processingPayment}
                  className={`w-full bg-gradient-to-r ${tier.color} hover:opacity-90 text-white font-semibold`}
                >
                  {processingPayment ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Creator Monetization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Gift className="w-5 h-5 mr-2 text-pink-400" />
              Support Creators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Tip Amount (USD)</Label>
              <div className="flex space-x-2">
                {[1, 5, 10, 25].map((amount) => (
                  <Button
                    key={amount}
                    size="sm"
                    variant={tipAmount === amount ? "default" : "outline"}
                    onClick={() => setTipAmount(amount)}
                    className="flex-1"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(Number(e.target.value))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Custom amount"
              />
            </div>
            
            <Button
              onClick={handleCreatorTip}
              disabled={processingPayment}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              <Gift className="w-4 h-4 mr-2" />
              Send Tip
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-400" />
              Premium Signals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">BTC Long Signal</p>
                    <p className="text-sm text-gray-400">92% accuracy • High confidence</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    $0.50
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">ETH Scalp Setup</p>
                    <p className="text-sm text-gray-400">89% accuracy • Medium confidence</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    $0.25
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Portfolio Rebalance</p>
                    <p className="text-sm text-gray-400">95% accuracy • AI-generated</p>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    $1.00
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Features */}
      <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">X402 Protocol Benefits</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Ultra-low fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Instant settlements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Global accessibility</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Smart routing</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">$103K</p>
              <p className="text-indigo-300">Monthly Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}