import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Image, Video, Upload, Palette, Zap, TrendingUp, DollarSign, Users, Eye, Heart, MessageCircle, Share, ShoppingCart, Award, Star, Layers, Plus, ExternalLink } from "lucide-react";
import type { NFTCollection } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export function NFTCreatorHub() {
  const { user } = useAuth();
  
  const { data: nftCollections = [] } = useQuery<NFTCollection[]>({
    queryKey: ['/api/nft/collections'],
  });

  const { data: userNFTs = [] } = useQuery({
    queryKey: ['/api/nft/user-nfts'],
    enabled: !!user,
  });

  const handleCreateNFT = () => {
    console.log('NFT creation functionality - to be implemented');
  };

  const handleMintCollection = () => {
    console.log('NFT collection minting - to be implemented');
  };

  return (
    <div className="space-y-6">
      {/* Creator Dashboard Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-white">
                  {user ? "Connect Wallet" : "Login Required"}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Items Created</p>
                <p className="text-2xl font-bold text-white">{Array.isArray(userNFTs) ? userNFTs.length : 0}</p>
              </div>
              <Layers className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Followers</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <Users className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {user && (
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Plus className="w-5 h-5 mr-2 text-purple-400" />
              Create New NFT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={handleCreateNFT}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-24 flex flex-col items-center justify-center"
              >
                <Image className="w-6 h-6 mb-2" />
                Single NFT
              </Button>
              <Button 
                onClick={handleMintCollection}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-24 flex flex-col items-center justify-center"
              >
                <Layers className="w-6 h-6 mb-2" />
                Collection
              </Button>
              <Button 
                onClick={handleCreateNFT}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-24 flex flex-col items-center justify-center"
              >
                <Zap className="w-6 h-6 mb-2" />
                AI Generated
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My NFTs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-purple-400" />
                  My NFTs
                </span>
                {user && (
                  <Button size="sm" onClick={handleCreateNFT} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!Array.isArray(userNFTs) || userNFTs.length === 0 ? (
                <div className="text-center py-12">
                  <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No NFTs Created Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start your creative journey by minting your first NFT.
                  </p>
                  {user ? (
                    <Button onClick={handleCreateNFT} className="bg-gradient-to-r from-purple-500 to-pink-500">
                      Create Your First NFT
                    </Button>
                  ) : (
                    <p className="text-gray-400">Please log in to create NFTs</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userNFTs.map((nft: any) => (
                    <Card key={nft.id} className="bg-gray-800/50 border-gray-600/50">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                          <Image className="w-12 h-12 text-gray-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-2">{nft.name}</h4>
                        <p className="text-sm text-gray-400 mb-3">{nft.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                            {nft.status}
                          </Badge>
                          <span className="text-white font-medium">{nft.price} {nft.currency}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trending NFTs Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Trending NFTs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">No trending data available</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                Top Creators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">No creator data available</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-cyan-400" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                NFT Guidelines
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Creator Docs
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Community Forum
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}