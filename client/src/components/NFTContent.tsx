import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Search, TrendingUp, TrendingDown, Eye, Users } from "lucide-react";
import type { NFTCollection } from "@/types";

const featuredCollections = [
  {
    id: "featured-1",
    name: "OmniSphere Genesis",
    description: "Exclusive NFTs for early OmniSphere community members",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&w=300&h=300",
    floor: 2.5,
    items: 1000,
    isLive: true
  },
  {
    id: "featured-2", 
    name: "Creator Badges",
    description: "Achievement NFTs earned through platform engagement",
    image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?ixlib=rb-4.0.3&w=300&h=300",
    floor: 0.5,
    items: 500,
    isLive: true
  }
];

const trendingCategories = [
  { name: "Art", volume: "2,847 ETH", change: "+23.4%" },
  { name: "Gaming", volume: "1,923 ETH", change: "+18.2%" },
  { name: "Music", volume: "1,456 ETH", change: "+12.8%" },
  { name: "Utility", volume: "987 ETH", change: "+8.7%" }
];

export function NFTContent() {
  const { data: collections = [] } = useQuery<NFTCollection[]>({
    queryKey: ['/api/nft-collections'],
  });

  return (
    <div className="space-y-6">
      {/* Featured Collections */}
      <Card className="bg-dark-card border-dark-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Featured Collections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCollections.map((collection) => (
              <div key={collection.id} className="relative bg-dark-primary p-4 rounded-lg border border-dark-border hover:border-neon-purple transition-colors">
                <div className="flex space-x-4">
                  <img 
                    src={collection.image} 
                    alt={collection.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{collection.name}</h4>
                      {collection.isLive && (
                        <Badge className="bg-neon-green text-dark-primary">Live</Badge>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mb-3">{collection.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-sm">
                        <span className="text-text-secondary">Floor: <span className="text-neon-cyan font-mono">{collection.floor} ETH</span></span>
                        <span className="text-text-secondary">Items: <span className="font-mono">{collection.items}</span></span>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:neon-glow transition-all duration-200">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collections List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Top Collections</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <Input 
                      placeholder="Search collections..." 
                      className="pl-10 bg-dark-primary border-dark-border"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="bg-dark-primary border-dark-border">
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {collections.map((collection, index) => (
                  <div key={collection.id} className="flex items-center justify-between p-4 bg-dark-primary rounded-lg hover:bg-dark-secondary transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="text-text-secondary font-mono w-6">{index + 1}</span>
                      <img 
                        src={collection.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&w=50&h=50"} 
                        alt={collection.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{collection.name}</h4>
                        <p className="text-sm text-text-secondary">{collection.symbol}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-right">
                        <p className="font-mono font-medium">{collection.floorPrice} ETH</p>
                        <p className="text-text-secondary">Floor</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-medium">{(collection.volume24h / 1000).toFixed(1)}K ETH</p>
                        <p className="text-text-secondary">Volume</p>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center ${collection.change24h >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                          {collection.change24h >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          <span className="font-mono">{collection.change24h >= 0 ? '+' : ''}{collection.change24h.toFixed(1)}%</span>
                        </div>
                        <p className="text-text-secondary">24h</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-medium">{collection.owners.toLocaleString()}</p>
                        <p className="text-text-secondary">Owners</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Market Stats */}
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Market Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Volume</span>
                  <span className="font-mono font-bold text-neon-green">24,567 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Active Collections</span>
                  <span className="font-mono font-bold">12,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Sales</span>
                  <span className="font-mono font-bold text-neon-cyan">847,293</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Avg Price</span>
                  <span className="font-mono font-bold text-neon-purple">2.43 ETH</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Trending Categories */}
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Trending Categories</h3>
              <div className="space-y-3">
                {trendingCategories.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-dark-primary rounded-lg">
                    <div>
                      <p className={`font-medium ${
                        index === 0 ? 'text-neon-green' :
                        index === 1 ? 'text-neon-purple' :
                        index === 2 ? 'text-neon-cyan' : 'text-foreground'
                      }`}>
                        {category.name}
                      </p>
                      <p className="text-sm text-text-secondary">{category.volume}</p>
                    </div>
                    <div className="text-neon-green text-sm font-mono">{category.change}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:neon-glow transition-all duration-200">
                  <Eye className="w-4 h-4 mr-2" />
                  Browse All
                </Button>
                <Button variant="outline" className="w-full py-3 bg-dark-primary border-dark-border hover:bg-dark-secondary">
                  <Users className="w-4 h-4 mr-2" />
                  Create Collection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}