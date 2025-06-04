import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap,
  Users,
  Award,
  CheckCircle
} from "lucide-react";

export function LearnContent() {
  const courses = [
    {
      id: 1,
      title: "Cryptocurrency Fundamentals",
      description: "Learn the basics of Bitcoin, Ethereum, and digital assets",
      level: "Beginner",
      duration: "2 hours",
      lessons: 8,
      progress: 75,
      rating: 4.8,
      students: 12450,
      completed: false,
      icon: TrendingUp,
      color: "text-cyan-400"
    },
    {
      id: 2,
      title: "DeFi Protocols Deep Dive",
      description: "Understanding AMMs, lending protocols, and yield farming",
      level: "Intermediate",
      duration: "4 hours",
      lessons: 12,
      progress: 30,
      rating: 4.9,
      students: 8920,
      completed: false,
      icon: Zap,
      color: "text-purple-400"
    },
    {
      id: 3,
      title: "Smart Contract Security",
      description: "Best practices for safe DeFi interactions",
      level: "Advanced",
      duration: "3 hours",
      lessons: 10,
      progress: 100,
      rating: 4.7,
      students: 5640,
      completed: true,
      icon: Shield,
      color: "text-green-400"
    },
    {
      id: 4,
      title: "NFT Trading Strategies",
      description: "Master the art of digital collectible investing",
      level: "Intermediate",
      duration: "2.5 hours",
      lessons: 9,
      progress: 0,
      rating: 4.6,
      students: 7830,
      completed: false,
      icon: Star,
      color: "text-pink-400"
    }
  ];

  const achievements = [
    { title: "First Course Completed", icon: Award, earned: true },
    { title: "DeFi Expert", icon: Zap, earned: true },
    { title: "Security Master", icon: Shield, earned: true },
    { title: "Community Leader", icon: Users, earned: false },
  ];

  return (
    <div className="space-y-6">
      {/* Learning Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-inter font-medium tracking-wide uppercase">Courses Completed</p>
                <p className="text-2xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  3/12
                </p>
                <p className="text-cyan-400 text-sm font-inter font-medium">Keep learning!</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-inter font-medium tracking-wide uppercase">Learning Streak</p>
                <p className="text-2xl font-bold font-orbitron bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  7 days
                </p>
                <p className="text-purple-400 text-sm font-inter font-medium">Personal best!</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-inter font-medium tracking-wide uppercase">Knowledge Score</p>
                <p className="text-2xl font-bold font-orbitron bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  852
                </p>
                <p className="text-green-400 text-sm font-inter font-medium">Top 10%</p>
              </div>
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Catalog */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Course Catalog
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => {
              const IconComponent = course.icon;
              return (
                <Card key={course.id} className="bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-5 h-5 ${course.color}`} />
                        </div>
                        <div>
                          <h3 className="font-rajdhani font-bold text-white text-lg">{course.title}</h3>
                          <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'} className="text-xs">
                            {course.level}
                          </Badge>
                        </div>
                      </div>
                      {course.completed && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-sm font-inter mb-4">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.lessons} lessons</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{course.rating}</span>
                        <span className="text-gray-500">({course.students.toLocaleString()})</span>
                      </div>
                    </div>

                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}

                    <Button 
                      className={`w-full ${course.completed ? 'bg-green-600 hover:bg-green-700' : course.progress > 0 ? 'bg-purple-600 hover:bg-purple-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {course.completed ? 'Review Course' : course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold font-rajdhani bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border-cyan-500/50' 
                      : 'bg-gray-800/30 border-gray-700/50'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-cyan-500/20' : 'bg-gray-700/30'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${achievement.earned ? 'text-cyan-400' : 'text-gray-500'}`} />
                  </div>
                  <h4 className={`font-rajdhani font-medium text-sm ${achievement.earned ? 'text-white' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}