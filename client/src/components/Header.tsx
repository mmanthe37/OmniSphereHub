import { useState } from "react";
import { Bell, Settings, Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/SettingsModal";
import WalletConnectionModal from "@/components/WalletConnectionModal";
import { useQuery } from "@tanstack/react-query";
import type { TabType } from "@/types";
import omniSphereLogo from "@/assets/omnisphere-logo.jpg";

interface HeaderProps {
  activeTab: TabType;
  user?: any;
}

const tabTitles: Record<TabType, { title: string; subtitle: string }> = {
  dashboard: { title: "The Sphere", subtitle: "Your unified Web3 ecosystem hub" },
  socialfi: { title: "SocialFi", subtitle: "Social finance and creator economy platform" },
  trading: { title: "OmniTrade", subtitle: "Advanced trading with integrated wallet management" },
  staking: { title: "OmniYield", subtitle: "Staking and yield farming opportunities" },
  aibot: { title: "AI Bot", subtitle: "Automated trading with artificial intelligence" },
  nft: { title: "Creator Hub", subtitle: "NFT creation and monetization tools" },
  account: { title: "OmniAccount", subtitle: "Account management and wallet settings" },
  register: { title: "Join OmniSphere", subtitle: "Create your Web3 account" },
};

export function Header({ activeTab, user }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalMode, setWalletModalMode] = useState<'connect' | 'payment'>('connect');
  const { title, subtitle } = tabTitles[activeTab];

  const { data: connectedWallets = [] } = useQuery({
    queryKey: ['/api/wallet/connected'],
    refetchInterval: 10000
  });

  const handleWalletConnect = () => {
    setWalletModalMode('connect');
    setIsWalletModalOpen(true);
  };

  const handleAddFunds = () => {
    setWalletModalMode('payment');
    setIsWalletModalOpen(true);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <header className="bg-gradient-to-r from-gray-800 via-purple-900 to-gray-800 border-b border-purple-500/30 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <img 
              src={omniSphereLogo} 
              alt="OmniSphere" 
              className="w-12 h-12 rounded-xl object-cover shadow-lg border-2 border-purple-400/50"
            />
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-wider" 
                  style={{ fontFamily: 'Orbitron, monospace', textShadow: '0 0 20px rgba(139, 69, 255, 0.5)' }}>
                OMNISPHERE
              </h1>
              <p className="text-purple-200 text-sm font-light tracking-wide">The Ultimate Web3 Ecosystem</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <img 
              src={omniSphereLogo} 
              alt="OmniSphere" 
              className="w-8 h-8 rounded-lg object-cover opacity-60"
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent tracking-tight">{title}</h2>
            <p className="text-gray-300 text-base font-inter font-medium mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            {connectedWallets.length > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">
                    {formatAddress(connectedWallets[0].address)}
                  </span>
                  <span className="text-green-300 text-xs">
                    {connectedWallets[0].network}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddFunds}
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Funds
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleWalletConnect}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
            
            <Button variant="outline" size="icon" className="bg-gray-800/50 border-purple-400/50 hover:bg-purple-600/30 hover:border-purple-300 transition-all duration-300">
              <Bell className="h-5 w-5 text-cyan-400" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsSettingsOpen(true)}
              className="bg-gray-800/50 border-purple-400/50 hover:bg-purple-600/30 hover:border-purple-300 transition-all duration-300"
            >
              <Settings className="h-5 w-5 text-purple-400" />
            </Button>
          </div>
        </div>
      </header>
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={user}
      />
      
      <WalletConnectionModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        mode={walletModalMode}
      />
    </>
  );
}
