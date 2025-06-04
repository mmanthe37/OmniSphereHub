import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StakingPool } from "@/types";

const myPositions = [
  {
    pool: "ETH 2.0",
    staked: "12.5 ETH",
    earned: "+0.847 ETH",
    apy: "18.5%",
    status: "Active",
  },
  {
    pool: "SOL Validators",
    staked: "245 SOL",
    earned: "+18.3 SOL",
    apy: "24.3%",
    status: "Active",
  },
];

const rewardsSummary = {
  totalStaked: 47892.34,
  pending: 1247.89,
  claimedToday: 347.23,
  totalEarned: 18942.67,
};

export function StakingContent() {
  const { data: pools = [] } = useQuery<StakingPool[]>({
    queryKey: ['/api/staking-pools'],
  });

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Staking Pools */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Available Staking Pools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pools.map((pool) => (
                <div 
                  key={pool.id} 
                  className="bg-dark-primary p-4 rounded-lg border border-dark-border hover:border-neon-green transition-colors"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 ${getPoolColor(pool.symbol)} rounded-full flex items-center justify-center`}>
                      <span className="text-sm font-bold text-white">
                        {getPoolIcon(pool.symbol)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{pool.name}</h4>
                      <p className="text-sm text-text-secondary">{pool.protocol}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">APY</span>
                      <span className="font-mono font-bold text-neon-green">
                        {pool.apy}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">TVL</span>
                      <span className="font-mono">
                        ${(pool.tvl / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Min Stake</span>
                      <span className="font-mono">
                        {pool.minStake} {pool.symbol}
                      </span>
                    </div>
                  </div>
                  
                  <Button className="w-full py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-dark-primary hover:neon-glow-green transition-all duration-200">
                    {pool.symbol === 'LP' ? 'Add Liquidity' : pool.symbol === 'wBTC' ? 'Deposit' : 'Stake Now'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Staking Dashboard */}
      <div className="space-y-6">
        {/* My Positions */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">My Staking Positions</h3>
            <div className="space-y-4">
              {myPositions.map((position, index) => (
                <div key={position.pool} className="bg-dark-primary p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{position.pool}</h4>
                    <span className={`text-sm ${
                      index === 0 ? 'text-neon-green' : 'text-neon-purple'
                    }`}>
                      {position.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Staked</span>
                      <span className="font-mono">{position.staked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Earned</span>
                      <span className={`font-mono ${
                        index === 0 ? 'text-neon-green' : 'text-neon-purple'
                      }`}>
                        {position.earned}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">APY</span>
                      <span className="font-mono">{position.apy}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 py-2 bg-dark-card border-dark-border hover:bg-dark-border transition-colors"
                  >
                    Claim Rewards
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Rewards Summary */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Rewards Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Staked Value</span>
                <span className="font-mono font-bold">
                  ${rewardsSummary.totalStaked.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Pending Rewards</span>
                <span className="font-mono font-bold text-neon-green">
                  ${rewardsSummary.pending.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Claimed Today</span>
                <span className="font-mono font-bold text-neon-cyan">
                  ${rewardsSummary.claimedToday.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Earned</span>
                <span className="font-mono font-bold text-neon-purple">
                  ${rewardsSummary.totalEarned.toLocaleString()}
                </span>
              </div>
              
              <Button className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-dark-primary hover:neon-glow-green transition-all duration-200 mt-4">
                Claim All Rewards
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Staking Calculator */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Staking Calculator</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-text-secondary">Amount to Stake</Label>
                <Input 
                  type="text" 
                  placeholder="0.00" 
                  className="bg-dark-primary border-dark-border font-mono"
                />
              </div>
              
              <div>
                <Label className="text-sm text-text-secondary">Select Pool</Label>
                <Select>
                  <SelectTrigger className="bg-dark-primary border-dark-border">
                    <SelectValue placeholder="Choose a pool" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-primary border-dark-border">
                    <SelectItem value="eth">ETH 2.0 (18.5% APY)</SelectItem>
                    <SelectItem value="sol">SOL Validators (24.3% APY)</SelectItem>
                    <SelectItem value="lp">ETH-USDC LP (34.7% APY)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-dark-primary p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Daily Rewards</span>
                    <span className="font-mono text-neon-green">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Monthly Rewards</span>
                    <span className="font-mono text-neon-purple">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Yearly Rewards</span>
                    <span className="font-mono text-neon-cyan">$0.00</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
