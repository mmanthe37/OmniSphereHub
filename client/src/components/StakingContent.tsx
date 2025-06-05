import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, TrendingUp, DollarSign, Users, Lock, Unlock, Plus } from "lucide-react";
import type { StakingPool } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export function StakingContent() {
  const { user } = useAuth();
  
  const { data: stakingPools = [] } = useQuery<StakingPool[]>({
    queryKey: ['/api/staking/pools'],
  });

  const { data: userPositions = [] } = useQuery({
    queryKey: ['/api/staking/positions'],
    enabled: !!user,
  });

  const handleStakeTokens = () => {
    console.log('Token staking functionality - to be implemented');
  };

  const handleUnstakeTokens = () => {
    console.log('Token unstaking functionality - to be implemented');
  };

  const handleClaimRewards = () => {
    console.log('Reward claiming functionality - to be implemented');
  };

  const getPoolIcon = (symbol: string) => {
    switch (symbol) {
      case 'ETH': return 'Ξ';
      case 'SOL': return '◎';
      case 'wBTC': return '₿';
      case 'LP': return 'LP';
      default: return symbol.charAt(0);
    }
  };

  const getPoolColor = (symbol: string) => {
    switch (symbol) {
      case 'ETH': return 'bg-blue-500';
      case 'SOL': return 'bg-purple-500';
      case 'wBTC': return 'bg-orange-500';
      case 'LP': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Staking Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Staked</p>
                <p className="text-2xl font-bold text-white">
                  {user ? "$0.00" : "Login Required"}
                </p>
              </div>
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Rewards</p>
                <p className="text-2xl font-bold text-white">$0.00</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Positions</p>
                <p className="text-2xl font-bold text-white">{Array.isArray(userPositions) ? userPositions.length : 0}</p>
              </div>
              <Coins className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg APY</p>
                <p className="text-2xl font-bold text-white">0%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Staking Pools */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Coins className="w-5 h-5 mr-2 text-blue-400" />
                Available Staking Pools
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stakingPools.length === 0 ? (
                <div className="text-center py-12">
                  <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Staking Pools Available</h3>
                  <p className="text-gray-400 mb-6">
                    Staking pools will be available once the feature is fully implemented.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stakingPools.map((pool) => (
                    <Card key={pool.id} className="bg-gray-800/50 border-gray-600/50 hover:border-blue-500/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-10 h-10 ${getPoolColor(pool.symbol)} rounded-full flex items-center justify-center`}>
                            <span className="text-sm font-bold text-white">
                              {getPoolIcon(pool.symbol)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{pool.name}</h4>
                            <p className="text-sm text-gray-400">{pool.protocol}</p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">APY</span>
                            <span className="text-green-400 font-medium">{pool.apy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">TVL</span>
                            <span className="text-white">${pool.tvl.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Min Stake</span>
                            <span className="text-white">{pool.minStake} {pool.symbol}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={handleStakeTokens}
                          disabled={!user}
                        >
                          {user ? 'Stake Now' : 'Login to Stake'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* My Positions & Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="w-5 h-5 mr-2 text-purple-400" />
                My Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!Array.isArray(userPositions) || userPositions.length === 0 ? (
                <div className="text-center py-8">
                  <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">No active positions</p>
                  {user && (
                    <Button 
                      size="sm" 
                      className="mt-3 bg-purple-600 hover:bg-purple-700"
                      onClick={handleStakeTokens}
                    >
                      Start Staking
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {userPositions.map((position: any) => (
                    <div key={position.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{position.pool}</span>
                        <span className="text-green-400 text-sm">{position.apy}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Staked: {position.staked}</span>
                        <span className="text-green-400">+{position.earned}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {user && (
            <Card className="bg-gray-900/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-green-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleStakeTokens}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Stake Tokens
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-orange-500/30 text-orange-300 hover:bg-orange-600/20"
                  onClick={handleUnstakeTokens}
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Unstake Tokens
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-600/20"
                  onClick={handleClaimRewards}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Claim Rewards
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-cyan-400" />
                Pool Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Pools</span>
                  <span className="text-white">{stakingPools.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Highest APY</span>
                  <span className="text-green-400">
                    {stakingPools.length > 0 ? `${Math.max(...stakingPools.map(p => p.apy))}%` : '0%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total TVL</span>
                  <span className="text-white">
                    ${stakingPools.reduce((sum, pool) => sum + pool.tvl, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Stakers</span>
                  <span className="text-white">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}