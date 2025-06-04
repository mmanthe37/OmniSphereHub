import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { 
  TrendingUp, 
  Users, 
  ArrowLeftRight, 
  Bot, 
  Coins,
  Image,
  Star,
  GraduationCap,
  ChevronRight,
  Play,
  BarChart3,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import type { CryptoPrice } from "@/types";

interface LandingPageProps {
  onGetStarted: (goal: 'create' | 'trade' | 'pool' | 'learn') => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isConnected } = useWebSocket('/ws');
  
  const { data: cryptoPrices = [] } = useQuery<CryptoPrice[]>({
    queryKey: ['/api/crypto-prices'],
  });

  // Simulated real-time KPIs (would be replaced with actual API data)
  const [kpis, setKpis] = useState({
    tvl: 127582450,
    creators: 12450,
    trades: 892031,
    volume24h: 45821930
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(prev => ({
        tvl: prev.tvl + Math.floor(Math.random() * 10000),
        creators: prev.creators + Math.floor(Math.random() * 5),
        trades: prev.trades + Math.floor(Math.random() * 20),
        volume24h: prev.volume24h + Math.floor(Math.random() * 50000)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const productFeatures = [
    {
      id: 'socialfi',
      title: 'OmniFi Social',
      subtitle: 'Earn with your community',
      description: 'Turn your social engagement into crypto rewards through our innovative SocialFi platform',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      features: ['Creator monetization', 'Social rewards', 'Community governance', 'Content NFTs']
    },
    {
      id: 'trading',
      title: 'OmniTrade DEX',
      subtitle: 'Advanced DeFi trading',
      description: 'Access the best prices across all DEXs with our intelligent aggregation technology',
      icon: ArrowLeftRight,
      color: 'from-green-500 to-emerald-500',
      features: ['DEX aggregation', 'MEV protection', 'Advanced charts', 'Limit orders']
    },
    {
      id: 'aibot',
      title: 'OmniAgent AI',
      subtitle: 'Automated intelligence',
      description: 'Let AI manage your portfolio with proven strategies and risk management',
      icon: Bot,
      color: 'from-cyan-500 to-blue-500',
      features: ['Strategy automation', 'Risk management', 'Performance analytics', 'Backtesting']
    },
    {
      id: 'staking',
      title: 'OmniPool Staking',
      subtitle: 'Passive yield generation',
      description: 'Maximize your returns with optimized staking across multiple protocols',
      icon: Coins,
      color: 'from-orange-500 to-red-500',
      features: ['Auto-compounding', 'Multi-protocol', 'Yield optimization', 'Risk assessment']
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productFeatures.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span>{isConnected ? 'Live Data Connected' : 'Connecting...'}</span>
              </div>
            </Badge>
            
            <h1 className="text-6xl font-bold font-orbitron mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                The Ultimate
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Web3 Ecosystem
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 font-inter max-w-3xl mx-auto mb-8">
              OmniSphere unifies SocialFi, DeFi trading, AI automation, and yield farming into one powerful platform. 
              Start earning, trading, and learning in the decentralized future.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-rajdhani"
                onClick={() => onGetStarted('create')}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Creating
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg font-rajdhani"
                onClick={() => onGetStarted('trade')}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Start Trading
              </Button>
            </div>

            {/* Interactive KPI Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold font-orbitron bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {formatNumber(kpis.tvl)}
                </div>
                <div className="text-gray-400 text-sm font-inter">Total Value Locked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-orbitron bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {kpis.creators.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-sm font-inter">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {kpis.trades.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm font-inter">Total Trades</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-orbitron bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  {formatNumber(kpis.volume24h)}
                </div>
                <div className="text-gray-400 text-sm font-inter">24h Volume</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tour Carousel */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Four Pillars, One Platform
          </h2>
          <p className="text-gray-400 font-inter text-lg max-w-2xl mx-auto">
            Discover how OmniSphere integrates everything you need for Web3 success
          </p>
        </div>

        <div className="relative">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 min-h-[500px]">
                {/* Product Content */}
                <div className="p-8 flex flex-col justify-center">
                  {productFeatures.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div 
                        key={feature.id}
                        className={`transition-all duration-500 ${
                          index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-6">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-3 flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold font-rajdhani text-white">{feature.title}</h3>
                            <p className="text-purple-300 font-inter">{feature.subtitle}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 font-inter text-lg mb-6">
                          {feature.description}
                        </p>
                        
                        <div className="space-y-2 mb-6">
                          {feature.features.map((item, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400" />
                              <span className="text-gray-400 font-inter">{item}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          className={`bg-gradient-to-r ${feature.color} hover:opacity-90 text-white`}
                          onClick={() => onGetStarted(feature.id as any)}
                        >
                          Explore {feature.title}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {/* Visual Preview */}
                <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 p-8 flex items-center justify-center">
                  <div className="w-full max-w-md">
                    {productFeatures.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div 
                          key={feature.id}
                          className={`transition-all duration-500 ${
                            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
                          }`}
                        >
                          <div className={`w-64 h-64 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} p-1`}>
                            <div className="w-full h-full bg-gray-900 rounded-xl p-8 flex flex-col items-center justify-center">
                              <IconComponent className="w-20 h-20 text-white mb-4" />
                              <h4 className="text-white font-rajdhani font-bold text-xl text-center">
                                {feature.title}
                              </h4>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {productFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Get Started Wizard */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Choose Your Journey
          </h2>
          <p className="text-gray-400 font-inter text-lg">
            Tell us your goal and we'll guide you to the right tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { goal: 'create', title: 'Create & Earn', description: 'Build your content empire', icon: Star, color: 'purple' },
            { goal: 'trade', title: 'Trade & Swap', description: 'Access best prices', icon: ArrowLeftRight, color: 'green' },
            { goal: 'pool', title: 'Stake & Earn', description: 'Generate passive income', icon: Coins, color: 'orange' },
            { goal: 'learn', title: 'Learn & Grow', description: 'Master crypto & DeFi', icon: GraduationCap, color: 'cyan' }
          ].map((item) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={item.goal}
                className="bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                onClick={() => onGetStarted(item.goal as any)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-${item.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 text-${item.color}-400`} />
                  </div>
                  <h3 className="font-rajdhani font-bold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 font-inter text-sm">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="border-t border-gray-700/50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold font-rajdhani text-white mb-2">
              Trusted by the Web3 Community
            </h3>
            <p className="text-gray-400 font-inter">Audited, secure, and battle-tested</p>
          </div>
          
          <div className="flex justify-center items-center space-x-8 opacity-70">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 font-inter">Audited Smart Contracts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 font-inter">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 font-inter">Multi-chain Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}