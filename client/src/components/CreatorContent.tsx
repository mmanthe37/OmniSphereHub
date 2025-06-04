import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Heart, 
  Eye, 
  DollarSign, 
  Star, 
  Award, 
  TrendingUp, 
  MessageSquare,
  Share,
  Calendar,
  Target,
  Trophy
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { formatDistanceToNow } from "date-fns";
import type { ContentStats, CreatorBadge } from "@/types";

// Mock creator performance data
const creatorPerformanceData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  followers: 5000 + (i * 95) + Math.random() * 200,
  engagement: 3.2 + (i * 0.1) + Math.random() * 0.5,
  earnings: 100 + (i * 15) + Math.random() * 50,
}));

const monthlyStats = [
  { month: 'Jan', posts: 45, likes: 2400, views: 18000, earnings: 1200 },
  { month: 'Feb', posts: 52, likes: 2800, views: 21000, earnings: 1450 },
  { month: 'Mar', posts: 48, likes: 3200, views: 24000, earnings: 1680 },
  { month: 'Apr', posts: 61, likes: 3800, views: 28000, earnings: 2100 },
  { month: 'May', posts: 55, likes: 4200, views: 32000, earnings: 2400 },
  { month: 'Jun', posts: 67, likes: 4900, views: 39000, earnings: 3247 },
];

const creatorGoals = [
  { title: "10K Followers", current: 5847, target: 10000, reward: "500 OMNI tokens" },
  { title: "1M Total Views", current: 247892, target: 1000000, reward: "Creator NFT Badge" },
  { title: "4.5★ Rating", current: 4.8, target: 4.5, reward: "Verified Creator Status", completed: true },
];

const leaderboard = [
  { rank: 1, name: "CryptoQueen", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&w=40&h=40", earnings: 8934, change: "+12%" },
  { rank: 2, name: "BlockchainGuru", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=40&h=40", earnings: 7421, change: "+8%" },
  { rank: 3, name: "DeFiMaster", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=40&h=40", earnings: 6789, change: "+15%" },
  { rank: 4, name: "You", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=40&h=40", earnings: 3247, change: "+23%", isUser: true },
];

export function CreatorContent() {
  const { data: contentStats } = useQuery<ContentStats>({
    queryKey: ['/api/content-stats/1'],
  });

  const { data: badges = [] } = useQuery<CreatorBadge[]>({
    queryKey: ['/api/creator-badges/1'],
  });

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'engagement': return Users;
      case 'content': return Star;
      case 'trading': return TrendingUp;
      default: return Award;
    }
  };

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case 'engagement': return 'text-neon-purple';
      case 'content': return 'text-neon-cyan';
      case 'trading': return 'text-neon-green';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Creator Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-dark-card border-dark-border hover:neon-glow-purple transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Followers</p>
                <p className="text-2xl font-bold font-mono">
                  {contentStats?.totalFollowers.toLocaleString() || "5,847"}
                </p>
                <p className="text-neon-purple text-sm flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-neon-purple bg-opacity-20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-neon-purple" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border hover:neon-glow-cyan transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Views</p>
                <p className="text-2xl font-bold font-mono">
                  {contentStats?.totalViews.toLocaleString() || "247K"}
                </p>
                <p className="text-neon-cyan text-sm">Avg: 3.7K per post</p>
              </div>
              <div className="w-12 h-12 bg-neon-cyan bg-opacity-20 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-neon-cyan" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border hover:neon-glow-green transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Monthly Earnings</p>
                <p className="text-2xl font-bold font-mono text-neon-green">
                  ${contentStats?.monthlyEarnings.toLocaleString() || "3,247"}
                </p>
                <p className="text-neon-green text-sm">+23% vs last month</p>
              </div>
              <div className="w-12 h-12 bg-neon-green bg-opacity-20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-neon-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border hover:neon-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Content Rating</p>
                <p className="text-2xl font-bold font-mono">
                  {contentStats?.contentRating.toFixed(1) || "4.8"}⭐
                </p>
                <p className="text-neon-cyan text-sm">Excellent quality</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Creator Performance (30 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={creatorPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dark-border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--text-secondary))" />
                  <YAxis stroke="hsl(var(--text-secondary))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--dark-card))',
                      border: '1px solid hsl(var(--dark-border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="followers" 
                    stroke="hsl(var(--neon-purple))" 
                    strokeWidth={2}
                    name="Followers"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="hsl(var(--neon-green))" 
                    strokeWidth={2}
                    name="Earnings ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Analytics</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--dark-border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--text-secondary))" />
                  <YAxis stroke="hsl(var(--text-secondary))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--dark-card))',
                      border: '1px solid hsl(var(--dark-border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="posts" fill="hsl(var(--neon-cyan))" name="Posts" />
                  <Bar dataKey="likes" fill="hsl(var(--neon-purple))" name="Likes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Creator Goals */}
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Creator Goals</h3>
              <div className="space-y-4">
                {creatorGoals.map((goal, index) => (
                  <div key={goal.title} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{goal.title}</h4>
                      {goal.completed && (
                        <Badge className="bg-neon-green text-dark-primary">
                          <Trophy className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>
                    <Progress 
                      value={goal.completed ? 100 : (goal.current / goal.target) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                      </span>
                      <span className="text-neon-cyan">{goal.reward}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Creator Badges */}
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Creator Badges</h3>
              <div className="space-y-3">
                {badges.map((badge) => {
                  const Icon = getBadgeIcon(badge.badgeType);
                  return (
                    <div key={badge.id} className="flex items-center space-x-3 p-3 bg-dark-primary rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-opacity-20 ${
                        badge.badgeType === 'engagement' ? 'bg-neon-purple' :
                        badge.badgeType === 'content' ? 'bg-neon-cyan' : 'bg-neon-green'
                      }`}>
                        <Icon className={`w-5 h-5 ${getBadgeColor(badge.badgeType)}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{badge.badgeName}</h4>
                        <p className="text-sm text-text-secondary">{badge.description}</p>
                        <p className="text-xs text-text-secondary">
                          {formatDistanceToNow(new Date(badge.earnedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Creator Leaderboard */}
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Creators</h3>
              <div className="space-y-3">
                {leaderboard.map((creator) => (
                  <div key={creator.rank} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    creator.isUser ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-neon-cyan' : 'bg-dark-primary'
                  }`}>
                    <span className={`font-mono text-sm w-6 ${
                      creator.rank === 1 ? 'text-yellow-400' :
                      creator.rank === 2 ? 'text-gray-300' :
                      creator.rank === 3 ? 'text-amber-600' : 'text-text-secondary'
                    }`}>
                      #{creator.rank}
                    </span>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className={`font-medium ${creator.isUser ? 'text-neon-cyan' : ''}`}>
                        {creator.name}
                      </p>
                      <p className="text-sm text-text-secondary">${creator.earnings}</p>
                    </div>
                    <span className="text-neon-green text-sm font-mono">{creator.change}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}