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
import { LearnContent } from "@/components/LearnContent";
import { WalletDashboard } from "@/components/WalletDashboard";
import { LandingPage } from "@/components/LandingPage";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatusBanner } from "@/components/StatusBanner";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { TabType, User, CryptoPrice } from "@/types";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showLanding, setShowLanding] = useState(false);
  const { isConnected, cryptoPrices: livePrice } = useWebSocket('/ws');

  useEffect(() => {
    const handleShowLanding = () => setShowLanding(true);
    window.addEventListener('showLanding', handleShowLanding);
    return () => window.removeEventListener('showLanding', handleShowLanding);
  }, []);
  
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user/1'],
  });

  const { data: staticPrices = [] } = useQuery<CryptoPrice[]>({
    queryKey: ['/api/crypto-prices'],
  });

  // Use live prices from WebSocket if available, otherwise fall back to static data
  const cryptoPrices = livePrice.length > 0 ? livePrice : staticPrices;

  const handleGetStarted = (goal: 'create' | 'trade' | 'pool' | 'learn') => {
    const goalToTabMap: Record<string, TabType> = {
      create: 'creator',
      trade: 'trading',
      pool: 'staking',
      learn: 'learn'
    };
    
    setActiveTab(goalToTabMap[goal]);
    setShowLanding(false);
  };

  const renderContent = () => {
    if (showLanding) {
      return <LandingPage onGetStarted={handleGetStarted} />;
    }
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
      case 'learn':
        return <LearnContent />;
      default:
        return <DashboardOverview cryptoPrices={cryptoPrices} />;
    }
  };

  if (showLanding) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen">
          <StatusBanner />
          {renderContent()}
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex bg-dark-primary text-white">
        <StatusBanner />
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            user={user}
          />
        </div>
        
        {/* Mobile Navigation */}
        <MobileNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1 md:ml-52 pt-16 md:pt-0 pb-20 md:pb-0">
          <Header activeTab={activeTab} user={user} />
          
          <main className="p-4 md:p-6">
            {/* Breadcrumb Navigation */}
            <div className="hidden md:block">
              <Breadcrumb 
                activeTab={activeTab} 
                onNavigate={setActiveTab}
              />
            </div>
            
            {renderContent()}
          </main>
          
          {/* Enhanced Connection Status */}
          <div className="hidden md:block fixed bottom-4 right-4">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
              isConnected 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`} />
              <span>{isConnected ? 'Live Data Connected' : 'Connection Lost'}</span>
            </div>
          </div>
          
          {/* Quick Access to Landing */}
          <button
            onClick={() => setShowLanding(true)}
            className="hidden md:block fixed bottom-4 left-4 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-all duration-300 text-sm font-inter"
          >
            View Landing Page
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}
