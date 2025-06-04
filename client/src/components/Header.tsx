import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TabType } from "@/types";

interface HeaderProps {
  activeTab: TabType;
}

const tabTitles: Record<TabType, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Welcome back, manage your Web3 portfolio" },
  socialfi: { title: "SocialFi", subtitle: "Connect with the crypto community" },
  creator: { title: "Creator Hub", subtitle: "Track your content performance and earnings" },
  trading: { title: "Trading", subtitle: "Advanced DEX trading and analysis" },
  nfts: { title: "NFT Market", subtitle: "Discover and trade digital collectibles" },
  aibot: { title: "AI Bot", subtitle: "Automated trading with artificial intelligence" },
  staking: { title: "Staking", subtitle: "Earn rewards by staking your assets" },
};

export function Header({ activeTab }: HeaderProps) {
  const { title, subtitle } = tabTitles[activeTab];

  return (
    <header className="bg-dark-secondary border-b border-dark-border p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-text-secondary">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" className="bg-dark-card border-dark-border">
            <Bell className="h-4 w-4 text-neon-cyan" />
          </Button>
          <Button variant="outline" size="icon" className="bg-dark-card border-dark-border">
            <Settings className="h-4 w-4 text-text-secondary" />
          </Button>
        </div>
      </div>
    </header>
  );
}
