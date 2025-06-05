import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, TrendingUp } from "lucide-react";

interface EmptyPortfolioProps {
  onAddHolding: () => void;
}

export default function EmptyPortfolio({ onAddHolding }: EmptyPortfolioProps) {
  return (
    <div className="space-y-6">
      {/* Empty State Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold text-white">$0.00</p>
                <p className="text-xs text-muted-foreground">No holdings yet</p>
              </div>
              <Wallet className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Return</p>
                <p className="text-2xl font-bold text-white">0.00%</p>
                <p className="text-xs text-muted-foreground">All time</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Holdings</p>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-muted-foreground">Active positions</p>
              </div>
              <Plus className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Trades</p>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State Call-to-Action */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
        <CardContent className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Welcome to OmniSphere
            </h3>
            <p className="text-muted-foreground mb-6">
              Start building your crypto portfolio by adding your first holding. 
              Track performance, enable AI trading, and explore DeFi opportunities.
            </p>
            <Button 
              onClick={onAddHolding}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Holding
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/30 border-slate-700/30">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Connect Wallet</h4>
              <p className="text-sm text-muted-foreground">
                Link your crypto wallet to track holdings automatically
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700/30">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Add Holdings</h4>
              <p className="text-sm text-muted-foreground">
                Manually add crypto positions to start tracking performance
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/30 border-slate-700/30">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Enable AI Trading</h4>
              <p className="text-sm text-muted-foreground">
                Let our AI algorithms optimize your trading strategies
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}