import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Video, 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  Users, 
  TrendingUp, 
  Coins, 
  Wallet, 
  Brush, 
  Brain, 
  Zap, 
  Shield, 
  Play, 
  CheckCircle, 
  Lock,
  Search,
  Filter,
  BarChart3,
  Lightbulb,
  Award,
  Bookmark,
  Share2,
  MessageCircle
} from "lucide-react";
import omniSphereLogo from "@/assets/omnisphere-logo.jpg";

const learningPaths = [
  {
    id: 1,
    title: "Crypto Fundamentals",
    description: "Master the basics of cryptocurrency, blockchain technology, and digital assets",
    difficulty: "Beginner",
    duration: "6 weeks",
    modules: 12,
    completed: 3,
    progress: 25,
    category: "crypto",
    icon: Coins,
    color: "from-orange-500 to-yellow-500",
    skills: ["Blockchain Basics", "Wallet Security", "Trading Fundamentals", "Market Analysis"]
  },
  {
    id: 2,
    title: "DeFi Mastery",
    description: "Explore decentralized finance protocols, yield farming, and liquidity provision",
    difficulty: "Intermediate",
    duration: "8 weeks",
    modules: 16,
    completed: 0,
    progress: 0,
    category: "defi",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    skills: ["Liquidity Pools", "Yield Farming", "DEX Trading", "Protocol Analysis"]
  },
  {
    id: 3,
    title: "Content Creation & Monetization",
    description: "Build your creator brand and monetize content through Web3 platforms",
    difficulty: "Beginner",
    duration: "5 weeks",
    modules: 10,
    completed: 7,
    progress: 70,
    category: "creator",
    icon: Brush,
    color: "from-purple-500 to-pink-500",
    skills: ["Content Strategy", "NFT Creation", "Social Media", "Brand Building"]
  },
  {
    id: 4,
    title: "AI Trading Strategies",
    description: "Learn algorithmic trading, bot development, and AI-powered investment strategies",
    difficulty: "Advanced",
    duration: "10 weeks",
    modules: 20,
    completed: 2,
    progress: 10,
    category: "ai",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
    skills: ["Algorithm Design", "Risk Management", "Backtesting", "ML Models"]
  },
  {
    id: 5,
    title: "Web3 Security",
    description: "Protect your assets and understand security best practices in DeFi",
    difficulty: "Intermediate",
    duration: "4 weeks",
    modules: 8,
    completed: 0,
    progress: 0,
    category: "security",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    skills: ["Wallet Security", "Smart Contract Auditing", "Scam Prevention", "Risk Assessment"]
  }
];

const featuredCourses = [
  {
    id: 1,
    title: "NFT Creation Masterclass",
    instructor: "Sarah Chen",
    rating: 4.9,
    students: 2847,
    duration: "3h 45m",
    price: "Free",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
    category: "NFT",
    level: "Beginner"
  },
  {
    id: 2,
    title: "DeFi Yield Farming Strategies",
    instructor: "Alex Rodriguez",
    rating: 4.8,
    students: 1923,
    duration: "5h 20m",
    price: "$49",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
    category: "DeFi",
    level: "Intermediate"
  },
  {
    id: 3,
    title: "Social Media Monetization with Crypto",
    instructor: "Emma Wilson",
    rating: 4.7,
    students: 3542,
    duration: "4h 15m",
    price: "Free",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    category: "Creator",
    level: "Beginner"
  },
  {
    id: 4,
    title: "AI Trading Bot Development",
    instructor: "Dr. Marcus Kim",
    rating: 4.9,
    students: 987,
    duration: "8h 30m",
    price: "$99",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    category: "AI",
    level: "Advanced"
  }
];

const achievements = [
  {
    id: 1,
    title: "First Trade",
    description: "Complete your first cryptocurrency trade",
    icon: Trophy,
    earned: true,
    points: 100
  },
  {
    id: 2,
    title: "DeFi Explorer",
    description: "Interact with 5 different DeFi protocols",
    icon: Target,
    earned: false,
    points: 250
  },
  {
    id: 3,
    title: "Content Creator",
    description: "Create and mint your first NFT",
    icon: Star,
    earned: true,
    points: 200
  },
  {
    id: 4,
    title: "AI Strategist",
    description: "Deploy your first AI trading bot",
    icon: Brain,
    earned: false,
    points: 500
  }
];

const dailyChallenges = [
  {
    id: 1,
    title: "Market Analysis",
    description: "Analyze Bitcoin price movements for the past week",
    difficulty: "Easy",
    points: 50,
    timeLeft: "4h 23m",
    category: "Trading"
  },
  {
    id: 2,
    title: "Smart Contract Reading",
    description: "Review and explain a DeFi protocol's smart contract",
    difficulty: "Hard",
    points: 200,
    timeLeft: "2h 15m",
    category: "DeFi"
  },
  {
    id: 3,
    title: "Content Creation",
    description: "Create educational content about blockchain basics",
    difficulty: "Medium",
    points: 100,
    timeLeft: "6h 45m",
    category: "Creator"
  }
];

const communityStats = {
  totalLearners: 15847,
  coursesCompleted: 3924,
  averageRating: 4.8,
  expertMentors: 127
};

export function OmniLearnHub() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPath, setSelectedPath] = useState<number | null>(null);

  const categories = [
    { id: "all", label: "All Courses", icon: BookOpen },
    { id: "crypto", label: "Crypto", icon: Coins },
    { id: "defi", label: "DeFi", icon: TrendingUp },
    { id: "creator", label: "Creator", icon: Brush },
    { id: "ai", label: "AI Trading", icon: Brain },
    { id: "security", label: "Security", icon: Shield }
  ];

  const filteredPaths = learningPaths.filter(path => 
    (selectedCategory === "all" || path.category === selectedCategory) &&
    (searchQuery === "" || path.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     path.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-400 bg-green-500/20";
      case "Intermediate": return "text-yellow-400 bg-yellow-500/20";
      case "Advanced": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const handleStartPath = (pathId: number) => {
    setSelectedPath(pathId);
    alert(`Starting learning path: ${learningPaths.find(p => p.id === pathId)?.title}`);
  };

  const handleEnrollCourse = (courseId: number) => {
    const course = featuredCourses.find(c => c.id === courseId);
    alert(`Enrolling in course: ${course?.title} by ${course?.instructor}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-green-900/30 border border-purple-500/30">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img 
                src={omniSphereLogo} 
                alt="OmniSphere" 
                className="w-12 h-12 rounded-lg object-cover border border-purple-400/50"
              />
              <div>
                <h1 className="text-4xl font-bold font-orbitron bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  OmniLearn
                </h1>
                <p className="text-gray-300 text-lg mt-2">Master Web3, DeFi, Content Creation & AI Trading</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4">
                <p className="text-2xl font-bold font-orbitron text-cyan-400">1,247</p>
                <p className="text-sm text-gray-400">Learning Points</p>
              </div>
            </div>
          </div>
          
          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Users className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-xl font-bold">{communityStats.totalLearners.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Learners</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-xl font-bold">{communityStats.coursesCompleted.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Star className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-xl font-bold">{communityStats.averageRating}</p>
              <p className="text-sm text-gray-400">Avg Rating</p>
            </div>
            <div className="text-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Award className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <p className="text-xl font-bold">{communityStats.expertMentors}</p>
              <p className="text-sm text-gray-400">Mentors</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="paths" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="courses">Featured Courses</TabsTrigger>
          <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="paths" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search learning paths..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Learning Paths */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPaths.map((path) => {
              const Icon = path.icon;
              return (
                <Card key={path.id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${path.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{path.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getDifficultyColor(path.difficulty)}>
                              {path.difficulty}
                            </Badge>
                            <span className="text-sm text-gray-400">{path.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{path.description}</p>
                    
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-cyan-400">{path.completed}/{path.modules} modules</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                      <p className="text-xs text-gray-500">{path.progress}% complete</p>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Skills you'll learn:</p>
                      <div className="flex flex-wrap gap-1">
                        {path.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleStartPath(path.id)}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500"
                      >
                        {path.progress > 0 ? "Continue" : "Start Learning"}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black/50 text-white">{course.category}</Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className={course.price === "Free" ? "bg-green-500" : "bg-purple-500"}>
                      {course.price}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <Button size="sm" className="bg-white/20 hover:bg-white/30">
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{course.title}</h3>
                    <p className="text-xs text-gray-400">by {course.instructor}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => handleEnrollCourse(course.id)}
                      className="bg-gradient-to-r from-purple-500 to-cyan-500"
                    >
                      Enroll
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyChallenges.map((challenge) => (
              <Card key={challenge.id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-yellow-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <Badge className={`${
                      challenge.difficulty === "Easy" ? "bg-green-500/20 text-green-400" :
                      challenge.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{challenge.timeLeft}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{challenge.points} pts</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{challenge.category}</Badge>
                    <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                      Start Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card key={achievement.id} className={`${
                  achievement.earned 
                    ? "bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/30" 
                    : "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50"
                }`}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                      achievement.earned 
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500" 
                        : "bg-gray-700"
                    }`}>
                      <Icon className={`w-8 h-8 ${achievement.earned ? "text-white" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium">{achievement.points} points</span>
                    </div>
                    {achievement.earned ? (
                      <Badge className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Earned
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-400">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Discussion Feed */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Community Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      user: "Alex Chen",
                      topic: "Best DeFi protocols for beginners?",
                      replies: 23,
                      time: "2h ago",
                      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                    },
                    {
                      user: "Sarah Kim",
                      topic: "NFT marketplace comparison - OpenSea vs Foundation",
                      replies: 15,
                      time: "4h ago",
                      avatar: "https://images.unsplash.com/photo-1494790108755-2616b5b8b0b5?w=100"
                    },
                    {
                      user: "Marcus Johnson",
                      topic: "AI trading bot performance tracking",
                      replies: 8,
                      time: "6h ago",
                      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                    }
                  ].map((discussion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={discussion.avatar} />
                        <AvatarFallback>{discussion.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-sm">{discussion.user}</p>
                          <span className="text-xs text-gray-400">{discussion.time}</span>
                        </div>
                        <p className="text-gray-300 mb-2">{discussion.topic}</p>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {discussion.replies} replies
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-3 h-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard */}
            <div>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Top Learners
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Emma Wilson", points: 15420, level: "Expert", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
                    { name: "David Park", points: 12890, level: "Advanced", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" },
                    { name: "Lisa Zhang", points: 11650, level: "Advanced", avatar: "https://images.unsplash.com/photo-1494790108755-2616b5b8b0b5?w=100" },
                    { name: "You", points: 1247, level: "Beginner", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" }
                  ].map((user, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                      user.name === "You" ? "bg-purple-500/20 border border-purple-500/30" : "bg-gray-800/30"
                    }`}>
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-sm font-bold w-6">{index + 1}</span>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono">{user.points.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">points</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}