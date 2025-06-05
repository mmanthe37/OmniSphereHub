import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, TrendingUp, Shield, Zap, ExternalLink, BookOpen, Play, Lock, Unlock, Calculator, PieChart, BarChart3, Wallet, AlertTriangle, Info, Star, Award, Target } from "lucide-react";

// DeFi Protocols data now comes from authentic API sources

export function DeFiDappHub() {
  // Fetch authentic DeFi portfolio data
  const { data: defiPortfolio } = useQuery({
    queryKey: ['/api/defi/portfolio'],
    select: (data: any) => data || {}
  });

  const { data: defiProtocols = [] } = useQuery({
    queryKey: ['/api/defi/protocols'],
    select: (data: any) => data || []
  });

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-neon-cyan mb-4">DeFi Protocol Hub</h2>
        <p className="text-text-secondary">Connect your wallet to access DeFi protocols and start earning yield</p>
        <div className="mt-6">
          <Button className="bg-neon-cyan text-dark-primary hover:bg-neon-cyan/80">
            Connect Wallet
          </Button>
        </div>
      </div>

      {/* Protocol Grid - Empty State */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-dark-card border-dark-border opacity-50">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-dark-primary rounded-full mx-auto mb-4"></div>
                <p className="text-text-secondary">Protocol {i}</p>
                <p className="text-xs text-muted-foreground mt-1">Connect wallet to view</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const learningPaths = [
  {
    id: 1,
    title: "DeFi Fundamentals",
    description: "Learn the basics of decentralized finance",
    modules: [
      { name: "What is DeFi?", duration: "10 min", completed: true },
      { name: "Wallets & Security", duration: "15 min", completed: true },
      { name: "Gas Fees", duration: "8 min", completed: false },
      { name: "Smart Contracts", duration: "12 min", completed: false }
    ],
    progress: 50,
    difficulty: "Beginner",
    reward: "100 XP + DeFi Basics NFT"
  },
  {
    id: 2,
    title: "Yield Farming Mastery",
    description: "Advanced strategies for maximizing DeFi yields",
    modules: [
      { name: "Liquidity Pools", duration: "20 min", completed: true },
      { name: "Impermanent Loss", duration: "18 min", completed: false },
      { name: "Strategy Selection", duration: "25 min", completed: false },
      { name: "Risk Management", duration: "22 min", completed: false }
    ],
    progress: 25,
    difficulty: "Advanced",
    reward: "500 XP + Yield Master Badge"
  },
  {
    id: 3,
    title: "NFT Monetization",
    description: "Turn your NFTs into income-generating assets",
    modules: [
      { name: "NFT Lending", duration: "15 min", completed: false },
      { name: "Fractionalization", duration: "20 min", completed: false },
      { name: "Rental Markets", duration: "18 min", completed: false },
      { name: "Utility Integration", duration: "25 min", completed: false }
    ],
    progress: 0,
    difficulty: "Intermediate",
    reward: "300 XP + NFT Entrepreneur Badge"
  }
];

const userStats = {
  totalValueLocked: 8472.34,
  totalEarnings: 1456.78,
  activePositions: 8,
  completedCourses: 12,
  xpEarned: 2400,
  nftBadges: 5,
  riskScore: "Medium"
};

export function DeFiDappHub() {
  const handleConnectProtocol = (protocolName: string) => {
    alert(`Connecting to ${protocolName} - wallet connection and approval process would begin here`);
  };

  const handleStartLearning = (pathTitle: string) => {
    alert(`Starting learning path: ${pathTitle} - interactive modules with hands-on DeFi practice would open here`);
  };

  const handleOpenDapp = (protocolName: string) => {
    alert(`Opening ${protocolName} dapp interface - integrated within OmniSphere with social features and learning guides`);
  };

  const handleCalculateYield = () => {
    alert('DeFi yield calculator would open here - compare protocols, calculate potential returns, and optimize strategies');
  };

  const handleRiskAssessment = () => {
    alert('Risk assessment tool would open here - analyze protocol risks, smart contract audits, and portfolio diversification');
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dex': return 'text-blue-400 bg-blue-500/20';
      case 'lending': return 'text-purple-400 bg-purple-500/20';
      case 'yield': return 'text-green-400 bg-green-500/20';
      case 'stablecoin': return 'text-cyan-400 bg-cyan-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* DeFi Dashboard Header */}
      <Card className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 border border-purple-500/30">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                DeFi Hub
              </h1>
              <p className="text-gray-300">Access decentralized finance protocols with guided learning</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleCalculateYield} className="bg-gradient-to-r from-green-500 to-emerald-500">
                <Calculator className="w-4 h-4 mr-2" />
                Yield Calculator
              </Button>
              <Button onClick={handleRiskAssessment} variant="outline" className="border-purple-500/50">
                <Shield className="w-4 h-4 mr-2" />
                Risk Assessment
              </Button>
            </div>
          </div>

          {/* User DeFi Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold font-orbitron text-green-400">${userStats.totalValueLocked.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Value Locked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-orbitron text-purple-400">${userStats.totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Earnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-orbitron text-cyan-400">{userStats.activePositions}</p>
              <p className="text-sm text-gray-400">Active Positions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-orbitron text-pink-400">{userStats.xpEarned}</p>
              <p className="text-sm text-gray-400">Learning XP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="protocols" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="protocols">DeFi Protocols</TabsTrigger>
          <TabsTrigger value="learning">Learn DeFi</TabsTrigger>
          <TabsTrigger value="analytics">Portfolio Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="protocols" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defiProtocols.map((protocol) => (
              <Card key={protocol.id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img src={protocol.logo} alt={protocol.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <h3 className="font-bold">{protocol.name}</h3>
                        <Badge className={`text-xs ${getCategoryColor(protocol.category)}`}>
                          {protocol.category}
                        </Badge>
                      </div>
                    </div>
                    {protocol.isConnected ? (
                      <Unlock className="w-5 h-5 text-green-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mb-4">{protocol.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">TVL</span>
                      <span className="text-sm font-mono">{protocol.tvl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">APY</span>
                      <span className="text-sm font-mono text-green-400">{protocol.apy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Risk</span>
                      <Badge className={`text-xs ${getRiskColor(protocol.risk)}`}>
                        {protocol.risk}
                      </Badge>
                    </div>
                  </div>

                  {protocol.isConnected && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-green-400">Your Position</p>
                          <p className="font-mono text-sm">{protocol.userBalance}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-400">Earnings</p>
                          <p className="font-mono text-sm text-green-400">{protocol.earnings}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Learning Progress</span>
                      <span className="text-sm">{protocol.learningProgress}%</span>
                    </div>
                    <Progress value={protocol.learningProgress} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {protocol.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    {protocol.isConnected ? (
                      <Button onClick={() => handleOpenDapp(protocol.name)} size="sm" className="flex-1">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Open Dapp
                      </Button>
                    ) : (
                      <Button onClick={() => handleConnectProtocol(protocol.name)} size="sm" className="flex-1">
                        <Wallet className="w-3 h-3 mr-2" />
                        Connect
                      </Button>
                    )}
                    <Button onClick={() => handleStartLearning(protocol.name)} variant="outline" size="sm">
                      <BookOpen className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {learningPaths.map((path) => (
              <Card key={path.id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">{path.title}</CardTitle>
                      <p className="text-sm text-gray-400">{path.description}</p>
                    </div>
                    <Badge className={`${
                      path.difficulty === 'Beginner' ? 'text-green-400 bg-green-500/20' :
                      path.difficulty === 'Intermediate' ? 'text-yellow-400 bg-yellow-500/20' :
                      'text-red-400 bg-red-500/20'
                    }`}>
                      {path.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {path.modules.map((module, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {module.completed ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">✓</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                              <Play className="w-3 h-3 text-gray-300" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{module.name}</p>
                            <p className="text-xs text-gray-400">{module.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="text-sm">{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-sm text-purple-400">Completion Reward</p>
                        <p className="text-xs text-gray-400">{path.reward}</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleStartLearning(path.title)} className="w-full bg-gradient-to-r from-purple-500 to-cyan-500">
                    {path.progress > 0 ? 'Continue Learning' : 'Start Course'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Portfolio Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {defiProtocols.filter(p => p.isConnected).map((protocol) => (
                    <div key={protocol.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={protocol.logo} alt={protocol.name} className="w-6 h-6 rounded-full" />
                        <span className="text-sm">{protocol.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono">{protocol.userBalance}</p>
                        <p className="text-xs text-green-400">{protocol.earnings}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Risk Score</span>
                    <Badge className="text-yellow-400 bg-yellow-500/20">
                      {userStats.riskScore}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Smart Contract Risk</span>
                      <span className="text-green-400">Low</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Liquidity Risk</span>
                      <span className="text-yellow-400">Medium</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Market Risk</span>
                      <span className="text-yellow-400">Medium</span>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-400">Recommendation</p>
                        <p className="text-xs text-gray-400">Consider diversifying across more protocols to reduce concentration risk</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}