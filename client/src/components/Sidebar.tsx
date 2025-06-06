import { cn } from "@/lib/utils";
import { 
  ChartLine, 
  Users, 
  ArrowLeftRight, 
  Bot, 
  Coins,
  Image,
  Star,
  GraduationCap,
  Wallet,
  Circle,
  Plus,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import WalletConnectionModal from "@/components/WalletConnectionModal";
import type { TabType } from "@/types";
import omniSphereLogo from "../assets/omnisphere-logo.jpg";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  user: any;
}

const navigationItems = [
  { id: 'dashboard' as TabType, label: 'The Sphere', icon: ChartLine, color: 'text-neon-cyan' },
  { id: 'socialfi' as TabType, label: 'SocialFi', icon: Users, color: 'text-neon-purple' },
  { id: 'trading' as TabType, label: 'OmniTrade', icon: ArrowLeftRight, color: 'text-neon-green' },
  { id: 'staking' as TabType, label: 'OmniYield', icon: Coins, color: 'text-neon-green' },
  { id: 'aibot' as TabType, label: 'AI Bot', icon: Bot, color: 'text-neon-cyan' },
  { id: 'nft' as TabType, label: 'Creator Hub', icon: Star, color: 'text-neon-cyan' },
  { id: 'account' as TabType, label: 'Account & Wallets', icon: Wallet, color: 'text-neon-blue' },
];

export function Sidebar({ activeTab, onTabChange, user }: SidebarProps) {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalMode, setWalletModalMode] = useState<'connect' | 'payment'>('connect');

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
      <div className="w-52 bg-gradient-to-b from-gray-800 via-gray-900 to-purple-900 border-r border-dark-border p-4 fixed h-full z-10 flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <img 
            src={omniSphereLogo} 
            alt="OmniSphere" 
            className="w-10 h-10 rounded-xl object-cover shadow-lg"
          />
          <h1 className="text-xl font-bold gradient-text">OmniSphere</h1>
        </div>

        {/* Wallet Section */}
        <div className="mb-6 p-3 bg-gray-800/50 rounded-lg border border-purple-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Wallet</span>
          </div>
          
          {Array.isArray(connectedWallets) && connectedWallets.length > 0 ? (
            <div className="space-y-2">
              <div className="p-2 bg-green-500/10 border border-green-500/30 rounded text-xs">
                <div className="flex items-center gap-1 mb-1">
                  <Circle className="h-2 w-2 fill-green-400 text-green-400" />
                  <span className="text-green-400 font-medium">Connected</span>
                </div>
                <div className="text-gray-300">{formatAddress(connectedWallets[0]?.address || '0x...')}</div>
                <div className="text-gray-400">{connectedWallets[0]?.network || 'ethereum'}</div>
              </div>
              <Button
                size="sm"
                onClick={handleAddFunds}
                className="w-full bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-300 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Funds
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleWalletConnect}
              className="w-full bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 text-purple-300 text-xs"
            >
              <Wallet className="h-3 w-3 mr-1" />
              Connect Wallet
            </Button>
          )}
        </div>
        
        <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 border text-sm",
                  isActive
                    ? "sidebar-nav-active text-white border-purple-400"
                    : "hover:bg-dark-card text-muted-foreground hover:text-foreground border-gray-700 hover:border-gray-600"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : item.color)} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-8 space-y-4">
          {/* Landing Page Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('showLanding'))}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-inter font-medium transition-all duration-300 text-sm"
          >
            View Landing Page
          </button>

          <div className="bg-dark-card p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.email ? user.email.charAt(0).toUpperCase() : 'G'}
              </div>
              <div>
                <p className="font-medium">{user?.email || 'Guest User'}</p>
                <p className="text-sm text-text-secondary">
                  {user?.accountType === 'paid' ? 'Premium Member' : 
                   user?.accountType === 'free' ? 'Free Account' : 'Guest'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isWalletModalOpen && (
        <WalletConnectionModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
          mode={walletModalMode}
        />
      )}
    </>
  );
}