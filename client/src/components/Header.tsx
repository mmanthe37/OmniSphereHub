import { useState } from "react";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/SettingsModal";
import type { TabType } from "@/types";

interface HeaderProps {
  activeTab: TabType;
  user?: any;
}

const tabTitles: Record<TabType, { title: string; subtitle: string }> = {
  sphere: { title: "The Sphere", subtitle: "Your unified Web3 ecosystem hub" },
  omnifi: { title: "OmniFi", subtitle: "Social finance and creator economy platform" },
  omnitrade: { title: "OmniTrade", subtitle: "Advanced trading with integrated wallet management" },
  omniyield: { title: "OmniYield", subtitle: "Staking and yield farming opportunities" },
  aibot: { title: "AI Bot", subtitle: "Automated trading with artificial intelligence" },
  creator: { title: "Creator Hub", subtitle: "NFT creation and monetization tools" },
  learn: { title: "DeFi Academy", subtitle: "Learn Web3, DeFi, and NFT fundamentals" },
};

export function Header({ activeTab, user }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { title, subtitle } = tabTitles[activeTab];

  return (
    <>
      <header className="bg-gradient-to-r from-gray-800 to-purple-900 border-b border-purple-500/30 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent tracking-tight">{title}</h2>
            <p className="text-gray-300 text-base font-inter font-medium mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
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
    </>
  );
}
