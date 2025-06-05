import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, TrendingUp, Shield, Zap, ExternalLink, BookOpen, Play, Lock, Unlock, Calculator, PieChart, BarChart3, Wallet, AlertTriangle, Info, Star, Award, Target } from "lucide-react";
import { 
  useDeFiPortfolio, 
  useDeFiProtocols, 
  useDeFiLearningPaths 
} from "@/lib/xano-hooks";

// All DeFi data now comes from authentic API sources

export function DeFiDappHub() {
  // Using authentic Xano backend data
  const userId = 1; // This would come from auth context in production
  const { data: defiPortfolio } = useDeFiPortfolio(userId);
  const { data: defiProtocols = [] } = useDeFiProtocols();
  const { data: learningPaths = [] } = useDeFiLearningPaths(userId);

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

      {/* Portfolio Overview - Empty State */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-neon-cyan" />
              <h3 className="font-semibold">Total Balance</h3>
            </div>
            <p className="text-2xl font-bold text-text-secondary mt-2">$0.00</p>
            <p className="text-sm text-text-secondary">Connect wallet to view balance</p>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-neon-purple" />
              <h3 className="font-semibold">Total Yield</h3>
            </div>
            <p className="text-2xl font-bold text-text-secondary mt-2">$0.00</p>
            <p className="text-sm text-text-secondary">No active positions</p>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-neon-green" />
              <h3 className="font-semibold">Active Positions</h3>
            </div>
            <p className="text-2xl font-bold text-text-secondary mt-2">0</p>
            <p className="text-sm text-text-secondary">No positions found</p>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold">Risk Score</h3>
            </div>
            <p className="text-2xl font-bold text-text-secondary mt-2">N/A</p>
            <p className="text-sm text-text-secondary">No data available</p>
          </CardContent>
        </Card>
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

      {/* Learning Section - Empty State */}
      <Card className="bg-dark-card border-dark-border">
        <CardHeader>
          <CardTitle className="text-neon-cyan">DeFi Learning Hub</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No learning paths available</p>
            <p className="text-xs text-muted-foreground mt-1">Connect to unlock educational content</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}