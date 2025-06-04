import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import DashboardOverview from "@/components/dashboard/overview";
import SocialFeed from "@/components/socialfi/social-feed";
import TradingInterface from "@/components/trading/trading-interface";
import BotDashboard from "@/components/aibot/bot-dashboard";
import StakingPools from "@/components/staking/staking-pools";

export type TabType = "dashboard" | "socialfi" | "trading" | "aibot" | "staking";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case "dashboard": return "Dashboard";
      case "socialfi": return "SocialFi";
      case "trading": return "Trading";
      case "aibot": return "AI Bot";
      case "staking": return "Staking";
      default: return "Dashboard";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardOverview />;
      case "socialfi": return <SocialFeed />;
      case "trading": return <TradingInterface />;
      case "aibot": return <BotDashboard />;
      case "staking": return <StakingPools />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-primary text-white">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 ml-64">
        <Header title={getTabTitle(activeTab)} />
        <main className="p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
