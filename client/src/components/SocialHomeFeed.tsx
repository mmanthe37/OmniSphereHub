import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, Image, Video, TrendingUp, TrendingDown, DollarSign, Users, Eye, Bell, Star, Zap, ArrowUp, ArrowDown, Play, Camera } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { SocialPost, PortfolioData, CryptoPrice } from "@/types";

// Enhanced social posts with creator and trading content
const enhancedSocialPosts = [
  {
    id: 1,
    userId: 1,
    author: "CryptoQueen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    content: "Just hit 500% returns on my AI trading strategy! 🚀 Check out my latest analysis on $SOL",
    type: "trading_update",
    mediaUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600",
    mediaType: "image",
    likes: 247,
    comments: 34,
    shares: 12,
    pnl: 15840.23,
    performance: "+23.4%",
    timeAgo: "2 hours ago",
    isVerified: true,
    followerCount: "12.3K",
    tradingStats: { winRate: "87%", totalTrades: 156 }
  },
  {
    id: 2,
    userId: 2,
    author: "DeFiMaster",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    content: "New staking pool launched! 18.5% APY on ETH. Don't sleep on this opportunity 💎",
    type: "staking_opportunity",
    mediaType: "video",
    mediaUrl: "/api/placeholder-video",
    likes: 189,
    comments: 67,
    shares: 23,
    stakingApy: 18.5,
    poolTvl: "$2.4M",
    timeAgo: "4 hours ago",
    isVerified: true,
    followerCount: "8.7K",
    expertise: ["DeFi", "Staking", "Yield Farming"]
  },
  {
    id: 3,
    userId: 3,
    author: "NFT_Creator_X",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    content: "Behind the scenes of my latest NFT drop! Sold out in 3 minutes 🔥 Community is everything",
    type: "nft_content",
    mediaType: "video",
    likes: 423,
    comments: 89,
    shares: 45,
    nftFloorPrice: 2.4,
    nftVolume: "847 ETH",
    timeAgo: "6 hours ago",
    isVerified: true,
    followerCount: "24.1K",
    collections: 3
  },
  {
    id: 4,
    userId: 4,
    author: "AlgoTrader_Pro",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    content: "Market analysis: BTC showing strong support at $43K. My bot just opened a long position. Full breakdown in my latest video 📈",
    type: "market_analysis",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600",
    likes: 156,
    comments: 28,
    shares: 19,
    prediction: "Bullish",
    confidence: 84,
    timeAgo: "8 hours ago",
    isVerified: false,
    followerCount: "5.2K",
    accuracy: "76%"
  }
];

const trendingCreators = [
  { name: "CryptoQueen", returns: "+847%", followers: "12.3K", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150", verified: true },
  { name: "DeFiMaster", returns: "+623%", followers: "8.7K", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", verified: true },
  { name: "NFT_Creator_X", returns: "+456%", followers: "24.1K", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", verified: true },
  { name: "AlgoTrader_Pro", returns: "+234%", followers: "5.2K", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", verified: false }
];

const notifications = [
  { type: "follow", user: "TradeMaster", action: "started following you", time: "5m", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150" },
  { type: "like", user: "YieldQueen", action: "liked your post", time: "12m", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
  { type: "trade", user: "System", action: "AI bot executed profitable trade", time: "15m", pnl: "+$247", avatar: null },
  { type: "stake", user: "System", action: "Staking rewards received", time: "1h", amount: "+147 USDC", avatar: null }
];

interface SocialHomeFeedProps {
  cryptoPrices: CryptoPrice[];
}

export function SocialHomeFeed({ cryptoPrices }: SocialHomeFeedProps) {
  const { data: portfolio } = useQuery<PortfolioData>({
    queryKey: ['/api/portfolio/1'],
  });

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'trading_update': return TrendingUp;
      case 'staking_opportunity': return DollarSign;
      case 'nft_content': return Image;
      case 'market_analysis': return TrendingUp;
      default: return MessageCircle;
    }
  };

  const handleCreatePost = () => {
    alert('Post creation modal would open here - allowing you to share content, trading insights, or portfolio updates');
  };

  const handleLiveStream = () => {
    alert('Live streaming setup would open here - start broadcasting your trading session or content creation');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Social Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Create Content Section */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea 
                  placeholder="Share your crypto insights, trading wins, or market analysis..."
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 resize-none h-20 mb-4"
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={handleCreatePost} className="text-purple-400 hover:text-purple-300">
                      <Image className="w-4 h-4 mr-2" />
                      Photo
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCreatePost} className="text-cyan-400 hover:text-cyan-300">
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLiveStream} className="text-red-400 hover:text-red-300">
                      <Camera className="w-4 h-4 mr-2" />
                      Live
                    </Button>
                  </div>
                  <Button onClick={handleCreatePost} className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Posts Feed */}
        <div className="space-y-6">
          {enhancedSocialPosts.map((post) => {
            const PostIcon = getPostIcon(post.type);
            return (
              <Card key={post.id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-white">{post.author}</h4>
                          {post.isVerified && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                          <Badge variant="outline" className="text-xs">
                            {post.followerCount}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{post.timeAgo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PostIcon className={`w-5 h-5 ${
                        post.type === 'trading_update' ? 'text-green-400' :
                        post.type === 'staking_opportunity' ? 'text-purple-400' :
                        post.type === 'nft_content' ? 'text-cyan-400' : 'text-blue-400'
                      }`} />
                      <Badge variant="secondary" className="text-xs">
                        {post.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-200 mb-4">{post.content}</p>

                  {/* Trading/Financial Data */}
                  {post.pnl && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">P&L Update</span>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-green-400">+${post.pnl.toLocaleString()}</p>
                          <p className="text-xs text-green-300">{post.performance}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {post.stakingApy && (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-400">Staking Opportunity</p>
                          <p className="text-xs text-gray-400">TVL: {post.poolTvl}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-400">{post.stakingApy}% APY</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Media Content */}
                  {post.mediaType === 'image' && post.mediaUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img src={post.mediaUrl} alt="Post media" className="w-full h-64 object-cover" />
                    </div>
                  )}

                  {post.mediaType === 'video' && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-gray-800 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400">Video Content</p>
                      </div>
                    </div>
                  )}

                  {/* Engagement Actions */}
                  <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                    <div className="flex space-x-6">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                        <Heart className="w-4 h-4 mr-2" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
                        <Share className="w-4 h-4 mr-2" />
                        {post.shares}
                      </Button>
                    </div>
                    {post.tradingStats && (
                      <div className="text-xs text-gray-400">
                        Win Rate: {post.tradingStats.winRate}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Portfolio Quick View */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Your Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  ${portfolio?.totalValue.toLocaleString() || "127,582"}
                </p>
                <p className="text-sm text-gray-400">Total Value</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-orbitron bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  +${portfolio?.dailyPnl.toLocaleString() || "2,847"}
                </p>
                <p className="text-sm text-gray-400">24h P&L</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {cryptoPrices.slice(0, 3).map((crypto) => (
                <div key={crypto.symbol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      crypto.symbol === 'BTC' ? 'bg-orange-500/20 text-orange-400' :
                      crypto.symbol === 'ETH' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {crypto.symbol === 'BTC' ? '₿' : crypto.symbol === 'ETH' ? 'Ξ' : '◎'}
                    </div>
                    <span className="text-sm">{crypto.symbol}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">${crypto.price.toLocaleString()}</p>
                    <p className={`text-xs ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending Creators */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Trending Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingCreators.map((creator, index) => (
                <div key={creator.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback>{creator.name[0]}</AvatarFallback>
                      </Avatar>
                      {creator.verified && (
                        <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{creator.name}</p>
                      <p className="text-xs text-gray-400">{creator.followers}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-green-400">{creator.returns}</p>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {notification.avatar ? (
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>{notification.user[0]}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      notification.type === 'trade' ? 'bg-green-500/20' : 'bg-purple-500/20'
                    }`}>
                      {notification.type === 'trade' ? (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <DollarSign className="w-3 h-3 text-purple-400" />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{notification.user}</span>{' '}
                      <span className="text-gray-400">{notification.action}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{notification.time}</p>
                      {(notification.pnl || notification.amount) && (
                        <p className="text-xs font-mono text-green-400">
                          {notification.pnl || notification.amount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}