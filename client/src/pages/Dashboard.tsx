import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { DashboardOverview } from "@/components/DashboardOverview";
import { SocialFiContent } from "@/components/SocialFiContent";
import { CreatorContent } from "@/components/CreatorContent";
import { TradingContent } from "@/components/TradingContent";
import { NFTContent } from "@/components/NFTContent";
import { AIBotContent } from "@/components/AIBotContent";
import { StakingContent } from "@/components/StakingContent";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { TabType, User, CryptoPrice } from "@/types";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { isConnected, cryptoPrices: livePrice } = useWebSocket('/ws');
  
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user/1'],
  });

  const { data: staticPrices = [] } = useQuery<CryptoPrice[]>({
    queryKey: ['/api/crypto-prices'],
  });

  // Use live prices from WebSocket if available, otherwise fall back to static data
  const cryptoPrices = livePrice.length > 0 ? livePrice : staticPrices;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview cryptoPrices={cryptoPrices} />;
      case 'socialfi':
        return <SocialFiContent />;
      case 'creator':
        return <CreatorContent />;
      case 'trading':
        return <TradingContent cryptoPrices={cryptoPrices} />;
      case 'nfts':
        return <NFTContent />;
      case 'aibot':
        return <AIBotContent />;
      case 'staking':
        return <StakingContent />;
      default:
        return <DashboardOverview cryptoPrices={cryptoPrices} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-primary text-white">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        user={user}
      />
      
      <div className="flex-1 ml-52">
        <Header activeTab={activeTab} />
        
        <main className="p-6">
          {renderContent()}
        </main>
        
        {/* Connection status indicator */}
        <div className="fixed bottom-4 right-4">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
            isConnected 
              ? 'bg-neon-green bg-opacity-20 text-neon-green' 
              : 'bg-red-500 bg-opacity-20 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-neon-green animate-pulse' : 'bg-red-400'
            }`} />
            <span>{isConnected ? 'Live Data' : 'Disconnected'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
