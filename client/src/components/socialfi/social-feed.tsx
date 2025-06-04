import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share, Image, TrendingUp } from "lucide-react";
import { formatCurrency, getTimeAgo } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SocialFeed() {
  const [postContent, setPostContent] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts = [] } = useQuery({
    queryKey: ["/api/social-posts"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/social-posts", {
        userId: 1,
        content,
        imageUrl: null,
        pnl: null
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-posts"] });
      setPostContent("");
      toast({
        title: "Post created",
        description: "Your post has been shared with the community.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("PUT", `/api/social-posts/${postId}/like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-posts"] });
    },
  });

  const handleCreatePost = () => {
    if (!postContent.trim()) return;
    createPostMutation.mutate(postContent);
  };

  const handleLikePost = (postId: number) => {
    likePostMutation.mutate(postId);
  };

  const trendingTopics = [
    { hashtag: "#DeFi", posts: "2.4k posts", change: "+15%" },
    { hashtag: "#Ethereum", posts: "1.8k posts", change: "+8%" },
    { hashtag: "#AITrading", posts: "947 posts", change: "+23%" },
  ];

  const topPerformers = [
    { name: "TradeMaster", returns: "+847% returns", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&w=40&h=40&fit=crop" },
    { name: "YieldQueen", returns: "+623% returns", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=40&h=40&fit=crop" },
    { name: "AlgoBot_AI", returns: "+456% returns", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&w=40&h=40&fit=crop" },
  ];

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
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=50&h=50&fit=crop" 
                  alt="Your avatar" 
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <Textarea
                    placeholder="Share your crypto insights..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="bg-dark-card border-dark-border text-white placeholder-text-secondary resize-none h-20"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-neon-cyan hover:text-neon-cyan">
                        <Image className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-neon-purple hover:text-neon-purple">
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      onClick={handleCreatePost}
                      disabled={!postContent.trim() || createPostMutation.isPending}
                      className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:shadow-neon"
                    >
                      {createPostMutation.isPending ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post: any) => (
                <div key={post.id} className="bg-dark-primary p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={post.user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=50&h=50&fit=crop"} 
                      alt="User avatar" 
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{post.user?.displayName || "Anonymous"}</h4>
                        <span className="text-neon-green text-sm">@{post.user?.username || "user"}</span>
                        <span className="text-text-secondary text-sm">
                          • {getTimeAgo(new Date(post.createdAt))}
                        </span>
                      </div>
                      <p className="mb-3">{post.content}</p>
                      
                      {post.imageUrl && (
                        <img 
                          src={post.imageUrl} 
                          alt="Post image" 
                          className="rounded-lg mb-3 w-full max-h-64 object-cover"
                        />
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center space-x-1 text-text-secondary hover:text-neon-green"
                          >
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 text-text-secondary hover:text-neon-cyan"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 text-text-secondary hover:text-neon-purple"
                          >
                            <Share className="w-4 h-4" />
                            <span>{post.shares}</span>
                          </Button>
                        </div>
                        {post.pnl && (
                          <div className="text-neon-green font-mono text-sm">
                            +{formatCurrency(post.pnl)} PnL
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
              {trendingTopics.map((topic) => (
                <div key={topic.hashtag} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neon-cyan">{topic.hashtag}</p>
                    <p className="text-sm text-text-secondary">{topic.posts}</p>
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
              {topPerformers.map((user) => (
                <div key={user.name} className="flex items-center space-x-3">
                  <img 
                    src={user.avatar} 
                    alt="Top performer" 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-neon-green">{user.returns}</p>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:shadow-neon"
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
