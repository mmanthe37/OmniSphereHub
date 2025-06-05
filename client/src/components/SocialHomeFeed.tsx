import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, Image, Video, Users, Bell, Camera } from "lucide-react";
import type { SocialPost, PortfolioData, CryptoPrice } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface SocialHomeFeedProps {
  cryptoPrices: CryptoPrice[];
}

export function SocialHomeFeed({ cryptoPrices }: SocialHomeFeedProps) {
  const { user } = useAuth();
  
  const { data: portfolio } = useQuery<PortfolioData>({
    queryKey: ['/api/portfolio/1'],
  });

  const { data: socialPosts = [] } = useQuery<SocialPost[]>({
    queryKey: ['/api/social/posts'],
  });

  const handleCreatePost = () => {
    // Future implementation: Open post creation modal
    console.log('Post creation functionality - to be implemented');
  };

  const handleLiveStream = () => {
    // Future implementation: Start live streaming
    console.log('Live streaming functionality - to be implemented');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Social Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Create Content Section */}
        {user && (
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
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
        )}

        {/* Social Posts Feed */}
        <div className="space-y-4">
          {socialPosts.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-700/50">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Posts Yet</h3>
                <p className="text-gray-400 mb-4">
                  Be the first to share your trading insights and connect with the community.
                </p>
                {user && (
                  <Button onClick={handleCreatePost} className="bg-gradient-to-r from-purple-500 to-cyan-500">
                    Create First Post
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            socialPosts.map((post) => (
              <Card key={post.id} className="bg-gray-900/50 border-gray-700/50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-white">User #{post.userId}</span>
                        <span className="text-gray-400 text-sm">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-200 mb-4">{post.content}</p>
                      {post.imageUrl && (
                        <img src={post.imageUrl} alt="Post content" className="rounded-lg mb-4 max-w-full h-auto" />
                      )}
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                          <Share className="w-4 h-4" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Sidebar - Trending Creators */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-400" />
              Trending Creators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">No trending data available</p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="w-5 h-5 mr-2 text-cyan-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">No notifications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Market Data */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {cryptoPrices.length > 0 ? (
              <div className="space-y-3">
                {cryptoPrices.slice(0, 5).map((crypto) => (
                  <div key={crypto.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{crypto.symbol}</p>
                      <p className="text-sm text-gray-400">{crypto.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">${crypto.price.toFixed(2)}</p>
                      <p className={`text-sm ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Market data loading...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}