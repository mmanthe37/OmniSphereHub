import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedTradingHub } from "./AdvancedTradingHub";
import { CreatorMonetizationHub } from "./CreatorMonetizationHub";
import { DeFiYieldHub } from "./DeFiYieldHub";
import { AnalyticsAIDashboard } from "./AnalyticsAIDashboard";
import { 
  Zap, Network, DollarSign, TrendingUp, Shield, Brain, 
  Play, Gift, Target, Repeat, Lock, Eye 
} from "lucide-react";

export function CoinbaseFeatureShowcase() {
  const [activeTab, setActiveTab] = useState("overview");

  const features = [
    {
      category: "Advanced Trading",
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      items: [
        "Smart Order Routing with multi-DEX optimization",
        "Institutional Volume Batching for better pricing",
        "Gas Fee Optimization via Base network routing",
        "Cross-Chain Bridging with 90% fee reduction",
        "Real-time route comparison across networks"
      ]
    },
    {
      category: "Payment & Commerce",
      icon: <DollarSign className="h-6 w-6 text-green-400" />,
      items: [
        "Micropayment Streaming for content creators",
        "NFT Marketplace with instant settlements",
        "Subscription Plans with recurring payments",
        "Creator Monetization with QR code payments",
        "Instant Payouts with 5-minute settlement"
      ]
    },
    {
      category: "DeFi & Yield",
      icon: <TrendingUp className="h-6 w-6 text-blue-400" />,
      items: [
        "Automated Yield Farming across protocols",
        "Liquid Staking with immediate liquidity",
        "Risk-Adjusted Portfolio optimization",
        "Automated Rebalancing with drift monitoring",
        "Institutional Custody with $250M insurance"
      ]
    },
    {
      category: "Analytics & AI",
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      items: [
        "Institutional Portfolio Metrics (Sharpe, Alpha, Beta)",
        "AI Market Predictions with 65-95% confidence",
        "Automated Trading Signals with risk scoring",
        "Real-time Risk Management (VaR, ES)",
        "Tax Loss Harvesting optimization"
      ]
    }
  ];

  const stats = [
    { label: "Fee Savings", value: "Up to 90%", color: "text-green-400" },
    { label: "Execution Speed", value: "15 min avg", color: "text-blue-400" },
    { label: "Insurance Coverage", value: "$250M max", color: "text-purple-400" },
    { label: "Network Support", value: "5+ chains", color: "text-yellow-400" },
    { label: "API Uptime", value: "99.9%", color: "text-cyan-400" },
    { label: "Institutional Grade", value: "SOC 2", color: "text-orange-400" }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Coinbase CDP Integration
        </h1>
        <p className="text-gray-300 max-w-3xl mx-auto">
          Comprehensive Web3 infrastructure powered by Coinbase's institutional-grade APIs. 
          Experience advanced trading, creator monetization, automated yield farming, and AI-powered analytics.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Overview */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full bg-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="trading" className="data-[state=active]:bg-yellow-600">
            Trading
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-green-600">
            Payments
          </TabsTrigger>
          <TabsTrigger value="defi" className="data-[state=active]:bg-blue-600">
            DeFi
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.category} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    {feature.icon}
                    {feature.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Integration Benefits */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-blue-400" />
                Coinbase CDP Integration Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Cost Efficiency</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Route via Base for 90% gas savings</li>
                    <li>• Institutional volume discounts</li>
                    <li>• Batch processing optimization</li>
                    <li>• x402 payment protocol efficiency</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Security & Compliance</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• SOC 2 Type II certification</li>
                    <li>• $250M insurance coverage</li>
                    <li>• Multi-signature custody</li>
                    <li>• Regulatory compliance built-in</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Performance</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 99.9% API uptime guarantee</li>
                    <li>• Sub-second quote generation</li>
                    <li>• Real-time settlement</li>
                    <li>• Global network infrastructure</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading">
          <AdvancedTradingHub />
        </TabsContent>

        <TabsContent value="payments">
          <CreatorMonetizationHub />
        </TabsContent>

        <TabsContent value="defi">
          <DeFiYieldHub />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsAIDashboard />
        </TabsContent>
      </Tabs>

      {/* API Status */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Network className="h-5 w-5 text-green-400" />
            Coinbase CDP API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">CDP Wallets</span>
              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Payment Streams</span>
              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Route Optimization</span>
              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Webhooks</span>
              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}