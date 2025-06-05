import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Play, Pause, Users, TrendingUp, Zap, Gift } from "lucide-react";

interface CreatorRevenue {
  totalRevenue: number;
  streamingRevenue: number;
  nftRevenue: number;
  subscriptionRevenue: number;
  tipRevenue: number;
  projectedMonthly: number;
}

interface PaymentStream {
  streamId: string;
  totalPaid: number;
  status: 'active' | 'paused' | 'ended';
}

export function CreatorMonetizationHub() {
  const [streamRate, setStreamRate] = useState("0.01");
  const [subscriptionPrice, setSubscriptionPrice] = useState("9.99");
  const [activeStreams, setActiveStreams] = useState<PaymentStream[]>([]);
  const [revenue, setRevenue] = useState<CreatorRevenue | null>(null);
  const [monetizationType, setMonetizationType] = useState("tip");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchCreatorRevenue();
  }, []);

  const fetchCreatorRevenue = async () => {
    try {
      const response = await fetch('/api/payments/creator-revenue/1/month');
      const data = await response.json();
      setRevenue(data);
    } catch (error) {
      console.error('Failed to fetch creator revenue:', error);
    }
  };

  const startMicropaymentStream = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payments/micropayment-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: 1,
          subscriberId: 2,
          ratePerSecond: parseFloat(streamRate),
          currency: 'USDC'
        })
      });

      const stream = await response.json();
      setActiveStreams(prev => [...prev, stream]);
    } catch (error) {
      console.error('Failed to start payment stream:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopPaymentStream = async (streamId: string) => {
    try {
      await fetch(`/api/payments/stream/${streamId}`, {
        method: 'DELETE'
      });

      setActiveStreams(prev => 
        prev.map(stream => 
          stream.streamId === streamId 
            ? { ...stream, status: 'ended' as const }
            : stream
        )
      );
    } catch (error) {
      console.error('Failed to stop payment stream:', error);
    }
  };

  const createSubscriptionPlan = async () => {
    try {
      const response = await fetch('/api/payments/subscription-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `plan_${Date.now()}`,
          creatorId: 1,
          name: 'Premium Content Access',
          price: parseFloat(subscriptionPrice),
          currency: 'USDC',
          duration: 30,
          features: ['Exclusive content', 'Direct messaging', 'Early access']
        })
      });

      const result = await response.json();
      alert(`Subscription plan created! Payment URL: ${result.paymentUrl}`);
    } catch (error) {
      console.error('Failed to create subscription plan:', error);
    }
  };

  const enableMonetization = async () => {
    try {
      const response = await fetch('/api/payments/creator-monetization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: 1,
          contentId: 'content_123',
          monetizationType,
          amount: monetizationType === 'tip' ? 1 : undefined
        })
      });

      const result = await response.json();
      alert(`Monetization enabled! Payment URL: ${result.paymentUrl}`);
    } catch (error) {
      console.error('Failed to enable monetization:', error);
    }
  };

  const requestInstantPayout = async () => {
    if (!revenue) return;

    try {
      const response = await fetch('/api/payments/instant-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: 1,
          amount: revenue.totalRevenue * 0.8, // 80% of available balance
          currency: 'USDC'
        })
      });

      const result = await response.json();
      alert(`Instant payout initiated! Net amount: $${result.netAmount.toFixed(2)}, Arrival: ${new Date(result.estimatedArrival).toLocaleTimeString()}`);
    } catch (error) {
      console.error('Failed to request instant payout:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Revenue Overview */}
      {revenue && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">${revenue.totalRevenue.toFixed(0)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-400">Streaming</p>
                  <p className="text-2xl font-bold text-white">${revenue.streamingRevenue.toFixed(0)}</p>
                </div>
                <Play className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-400">NFT Sales</p>
                  <p className="text-2xl font-bold text-white">${revenue.nftRevenue.toFixed(0)}</p>
                </div>
                <Gift className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-400">Subscriptions</p>
                  <p className="text-2xl font-bold text-white">${revenue.subscriptionRevenue.toFixed(0)}</p>
                </div>
                <Users className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-400">Tips</p>
                  <p className="text-2xl font-bold text-white">${revenue.tipRevenue.toFixed(0)}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/20 border-cyan-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-400">Projected</p>
                  <p className="text-2xl font-bold text-white">${revenue.projectedMonthly.toFixed(0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Micropayment Streaming */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Play className="h-5 w-5 text-blue-400" />
            Micropayment Streaming
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Rate per Second (USDC)</label>
              <Input
                value={streamRate}
                onChange={(e) => setStreamRate(e.target.value)}
                placeholder="0.01"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={startMicropaymentStream}
                disabled={isProcessing}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 w-full"
              >
                {isProcessing ? 'Starting...' : 'Start Stream'}
              </Button>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={requestInstantPayout}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full"
              >
                Instant Payout
              </Button>
            </div>
          </div>

          {activeStreams.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Active Streams</h4>
              {activeStreams.map((stream, index) => (
                <div key={stream.streamId} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-mono text-sm">{stream.streamId}</p>
                    <p className="text-sm text-gray-400">
                      Total Paid: <span className="text-green-400">${stream.totalPaid.toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={stream.status === 'active' ? 'default' : 'secondary'}
                      className={
                        stream.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }
                    >
                      {stream.status}
                    </Badge>
                    {stream.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => stopPaymentStream(stream.streamId)}
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5 text-orange-400" />
            Subscription Plans
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Monthly Price (USDC)</label>
              <Input
                value={subscriptionPrice}
                onChange={(e) => setSubscriptionPrice(e.target.value)}
                placeholder="9.99"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={createSubscriptionPlan}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 w-full"
              >
                Create Plan
              </Button>
            </div>
          </div>

          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-orange-400 mb-2">Premium Features Included</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Exclusive content access</li>
              <li>• Direct messaging with creator</li>
              <li>• Early access to new releases</li>
              <li>• Member-only community access</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Content Monetization */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Gift className="h-5 w-5 text-purple-400" />
            Content Monetization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Monetization Type</label>
              <Select value={monetizationType} onValueChange={setMonetizationType}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tip">Tips</SelectItem>
                  <SelectItem value="paywall">Paywall</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="nft">NFT Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={enableMonetization}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full"
              >
                Enable Monetization
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-400 mb-2">Payment Methods</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Coinbase CDP x402 protocol</li>
                <li>• USDC, ETH, BTC accepted</li>
                <li>• Instant settlement</li>
                <li>• QR code payments</li>
              </ul>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">Fee Structure</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Platform fee: 2.5%</li>
                <li>• Instant payout: 1%</li>
                <li>• Gas fees optimized via Base</li>
                <li>• Volume discounts available</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}