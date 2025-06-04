import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Image, Video, Upload, Palette, Zap, TrendingUp, DollarSign, Users, Eye, Heart, MessageCircle, Share, ShoppingCart, Award, Star, Layers, Plus, ExternalLink, BookOpen } from "lucide-react";
import type { NFTCollection } from "@/types";

// NFT Creation and Trading Data
const userNFTs = [
  {
    id: 1,
    name: "Cosmic Dreams #001",
    description: "First piece in my cosmic series exploring digital consciousness",
    image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400",
    price: 2.5,
    currency: "ETH",
    likes: 234,
    views: 1847,
    status: "listed",
    royalty: 10,
    earnings: 15.2,
    collection: "Cosmic Dreams"
  },
  {
    id: 2,
    name: "Neural Networks #047",
    description: "AI-generated abstract representing blockchain technology",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
    price: 1.8,
    currency: "ETH",
    likes: 189,
    views: 956,
    status: "sold",
    royalty: 7.5,
    earnings: 8.9,
    collection: "Neural Networks"
  },
  {
    id: 3,
    name: "DeFi Landscapes #012",
    description: "Visual representation of decentralized finance protocols",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
    price: 3.2,
    currency: "ETH",
    likes: 167,
    views: 1234,
    status: "minting",
    royalty: 12,
    earnings: 0,
    collection: "DeFi Landscapes"
  }
];

const trendingNFTs = [
  {
    id: 1,
    name: "Quantum Cats #2847",
    creator: "DigitalPaws",
    price: 12.5,
    change: "+45%",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200",
    volume: "847 ETH"
  },
  {
    id: 2,
    name: "MetaVerse Portals #156",
    creator: "VRCreator",
    price: 8.9,
    change: "+28%",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200",
    volume: "623 ETH"
  },
  {
    id: 3,
    name: "AI Dreamscapes #089",
    creator: "NeuralArt",
    price: 6.7,
    change: "+19%",
    image: "https://images.unsplash.com/photo-1686191128892-096d67761582?w=200",
    volume: "456 ETH"
  }
];

const creatorStats = {
  totalSales: 45.7,
  totalRoyalties: 12.3,
  totalViews: 28459,
  totalLikes: 3842,
  collectionsCreated: 5,
  itemsSold: 23,
  followers: 8947,
  avgSalePrice: 2.1
};

const learningModules = [
  {
    id: 1,
    title: "NFT Creation Basics",
    description: "Learn how to create, mint, and list your first NFT",
    progress: 75,
    duration: "15 min",
    difficulty: "Beginner",
    topics: ["Minting", "Metadata", "Gas Fees", "Marketplaces"]
  },
  {
    id: 2,
    title: "Smart Contract Royalties",
    description: "Set up automatic royalty payments for your NFT collections",
    progress: 45,
    duration: "20 min",
    difficulty: "Intermediate",
    topics: ["Smart Contracts", "Royalties", "EIP-2981", "Revenue Streams"]
  },
  {
    id: 3,
    title: "DeFi for Creators",
    description: "Use DeFi protocols to maximize your NFT earnings",
    progress: 0,
    duration: "25 min",
    difficulty: "Advanced",
    topics: ["Yield Farming", "Liquidity Pools", "Lending", "Staking"]
  }
];

export function NFTCreatorHub() {
  const { data: nftCollections = [] } = useQuery<NFTCollection[]>({
    queryKey: ['/api/nft-collections'],
  });

  const handleCreateNFT = () => {
    alert('NFT creation wizard would open here - upload artwork, set metadata, configure royalties, and mint to blockchain');
  };

  const handleStartCollection = () => {
    alert('Collection creation tools would open here - design collection artwork, set up smart contracts, and configure drop mechanics');
  };

  const handleOpenMarketplace = () => {
    alert('Integrated NFT marketplace would open here - browse, buy, sell, and trade NFTs with social features');
  };

  const handleViewAnalytics = () => {
    alert('Creator analytics dashboard would open here - track sales, royalties, audience engagement, and performance metrics');
  };

  const handleLaunchDrop = () => {
    alert('NFT drop launcher would open here - schedule reveals, set up whitelist, configure pricing, and manage community access');
  };

  return (
    <div className="space-y-8">
      {/* Creator Dashboard Header */}
      <Card className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 border border-purple-500/30">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Creator Studio
                </h1>
                <p className="text-gray-300">Monetize your creativity through NFTs and social engagement</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleCreateNFT} className="bg-gradient-to-r from-purple-500 to-cyan-500">
                <Plus className="w-4 h-4 mr-2" />
                Create NFT
              </Button>
              <Button onClick={handleLaunchDrop} variant="outline" className="border-purple-500/50 text-purple-200">
                <Zap className="w-4 h-4 mr-2" />
                Launch Drop
              </Button>
            </div>
          </div>

          {/* Creator Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold font-orbitron text-green-400">{creatorStats.totalSales} ETH</p>
              <p className="text-sm text-gray-400">Total Sales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-orbitron text-purple-400">{creatorStats.totalRoyalties} ETH</p>
              <p className="text-sm text-gray-400">Royalties Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-orbitron text-cyan-400">{creatorStats.totalViews.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-orbitron text-pink-400">{creatorStats.followers.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Followers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Your NFTs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Your NFT Portfolio
                </CardTitle>
                <Button onClick={handleViewAnalytics} variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userNFTs.map((nft) => (
                  <Card key={nft.id} className="bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-lg" />
                        <Badge className={`absolute top-2 right-2 ${
                          nft.status === 'listed' ? 'bg-green-500/20 text-green-400' :
                          nft.status === 'sold' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {nft.status}
                        </Badge>
                      </div>
                      
                      <h3 className="font-bold mb-2">{nft.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">{nft.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-red-400">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{nft.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-blue-400">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{nft.views}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold">{nft.price} {nft.currency}</p>
                          {nft.earnings > 0 && (
                            <p className="text-xs text-green-400">+{nft.earnings} ETH earned</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {nft.royalty}% royalty
                        </Badge>
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button onClick={handleStartCollection} className="bg-gradient-to-r from-purple-500 to-cyan-500">
                  <Layers className="w-4 h-4 mr-2" />
                  Start New Collection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Learning Center */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Creator Learning Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningModules.map((module) => (
                  <Card key={module.id} className="bg-gray-800/30 border-gray-700/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{module.title}</h4>
                          <p className="text-sm text-gray-400">{module.description}</p>
                        </div>
                        <Badge variant="outline" className={`text-xs ${
                          module.difficulty === 'Beginner' ? 'text-green-400' :
                          module.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {module.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">Progress</span>
                          <span className="text-sm">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {module.topics.slice(0, 2).map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {module.topics.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{module.topics.length - 2} more
                            </Badge>
                          )}
                        </div>
                        <Button size="sm" variant="ghost">
                          {module.progress > 0 ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleCreateNFT} className="w-full bg-gradient-to-r from-purple-500 to-cyan-500">
                <Upload className="w-4 h-4 mr-2" />
                Upload & Mint NFT
              </Button>
              <Button onClick={handleOpenMarketplace} variant="outline" className="w-full border-purple-500/50">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Browse Marketplace
              </Button>
              <Button onClick={handleViewAnalytics} variant="outline" className="w-full border-cyan-500/50">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Trending NFTs */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Trending NFTs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingNFTs.map((nft, index) => (
                  <div key={nft.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={nft.image} alt={nft.name} className="w-12 h-12 object-cover rounded-lg" />
                      <Badge className="absolute -top-1 -left-1 bg-yellow-500/20 text-yellow-400 text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{nft.name}</p>
                      <p className="text-xs text-gray-400">by {nft.creator}</p>
                      <p className="text-xs text-gray-500">{nft.volume} volume</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">{nft.price} ETH</p>
                      <p className="text-xs text-green-400">{nft.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Creator Achievements */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <div>
                    <p className="font-medium text-sm">First Sale</p>
                    <p className="text-xs text-gray-400">Sold your first NFT</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="font-medium text-sm">Top Creator</p>
                    <p className="text-xs text-gray-400">Ranked in top 100 creators</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 opacity-50">
                  <DollarSign className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">High Roller</p>
                    <p className="text-xs text-gray-400">Earn 100 ETH in sales</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}