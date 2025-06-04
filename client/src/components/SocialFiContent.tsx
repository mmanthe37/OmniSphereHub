import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share, Image, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { SocialPost } from "@/types";

const trendingTopics = [
  { hashtag: "#DeFi", posts: "2.4k", change: "+15%" },
  { hashtag: "#ContentCreator", posts: "1.9k", change: "+32%" },
  { hashtag: "#NFTAlpha", posts: "1.8k", change: "+28%" },
  { hashtag: "#Ethereum", posts: "1.6k", change: "+8%" },
  { hashtag: "#AITrading", posts: "947", change: "+23%" },
];

const topPerformers = [
  { name: "TradeMaster", returns: "+847% returns", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40" },
  { name: "YieldQueen", returns: "+623% returns", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40" },
  { name: "AlgoBot_AI", returns: "+456% returns", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40" },
];

export function SocialFiContent() {
  const { data: posts = [] } = useQuery<SocialPost[]>({
    queryKey: ['/api/social-posts'],
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Social Feed */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Community Feed</h3>
            
            {/* Post Creation */}
            <div className="bg-dark-primary p-4 rounded-lg mb-6">
              <div className="flex space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50" 
                  alt="Your avatar" 
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <Textarea 
                    placeholder="Share your crypto insights..." 
                    className="bg-dark-card border-dark-border text-white placeholder:text-text-secondary resize-none h-20"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-neon-cyan hover:text-neon-cyan/80">
                        <Image className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-neon-purple hover:text-neon-purple/80">
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:neon-glow transition-all duration-200">
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-dark-primary p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50" 
                      alt="User avatar" 
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">CryptoKing_47</h4>
                        <span className="text-neon-green text-sm">@crypto_king</span>
                        <span className="text-text-secondary text-sm">
                          • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="mb-3">{post.content}</p>
                      
                      {post.imageUrl && (
                        <img 
                          src={post.imageUrl} 
                          alt="Post content" 
                          className="rounded-lg mb-3 w-full max-h-64 object-cover"
                        />
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-6">
                          <Button variant="ghost" size="sm" className="text-text-secondary hover:text-neon-green transition-colors">
                            <Heart className="w-4 h-4 mr-1" />
                            <span>{post.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-text-secondary hover:text-neon-cyan transition-colors">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            <span>{post.comments}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-text-secondary hover:text-neon-purple transition-colors">
                            <Share className="w-4 h-4 mr-1" />
                            <span>{post.shares}</span>
                          </Button>
                        </div>
                        {post.pnl && (
                          <div className="text-neon-green font-mono text-sm">
                            +${post.pnl.toLocaleString()} PnL
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Social Sidebar */}
      <div className="space-y-6">
        {/* Trending Topics */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trending</h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={topic.hashtag} className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${
                      index === 0 ? 'text-neon-cyan' :
                      index === 1 ? 'text-neon-purple' : 'text-neon-green'
                    }`}>
                      {topic.hashtag}
                    </p>
                    <p className="text-sm text-text-secondary">{topic.posts} posts</p>
                  </div>
                  <div className="text-neon-green text-sm">{topic.change}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Top Performers */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
            <div className="space-y-4">
              {topPerformers.map((user, index) => (
                <div key={user.name} className="flex items-center space-x-3">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className={`text-sm ${
                      index === 0 ? 'text-neon-green' :
                      index === 1 ? 'text-neon-purple' : 'text-neon-cyan'
                    }`}>
                      {user.returns}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:neon-glow transition-all duration-200"
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
