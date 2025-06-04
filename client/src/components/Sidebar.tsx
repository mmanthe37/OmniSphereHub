import { cn } from "@/lib/utils";
import { 
  ChartLine, 
  Users, 
  ArrowLeftRight, 
  Bot, 
  Coins,
  Image,
  Star,
  Circle
} from "lucide-react";
import type { TabType } from "@/types";
import omniSphereLogo from "../assets/omnisphere-logo.jpg";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  user: any;
}

const navigationItems = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: ChartLine, color: 'text-neon-cyan' },
  { id: 'socialfi' as TabType, label: 'SocialFi', icon: Users, color: 'text-neon-purple' },
  { id: 'creator' as TabType, label: 'Creator Hub', icon: Star, color: 'text-neon-cyan' },
  { id: 'trading' as TabType, label: 'Trading', icon: ArrowLeftRight, color: 'text-neon-green' },
  { id: 'nfts' as TabType, label: 'NFT Market', icon: Image, color: 'text-neon-purple' },
  { id: 'aibot' as TabType, label: 'AI Bot', icon: Bot, color: 'text-neon-cyan' },
  { id: 'staking' as TabType, label: 'Staking', icon: Coins, color: 'text-neon-green' },
];

export function Sidebar({ activeTab, onTabChange, user }: SidebarProps) {
  return (
    <div className="w-64 bg-gradient-to-b from-gray-800 via-gray-900 to-purple-900 border-r border-dark-border p-6 fixed h-full z-10">
      <div className="flex items-center space-x-3 mb-8">
        <img 
          src={omniSphereLogo} 
          alt="OmniSphere" 
          className="w-10 h-10 rounded-xl object-cover shadow-lg"
        />
        <h1 className="text-xl font-bold gradient-text">OmniSphere</h1>
      </div>
      
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 border",
                isActive
                  ? "sidebar-nav-active text-white border-purple-400"
                  : "hover:bg-dark-card text-muted-foreground hover:text-foreground border-gray-700 hover:border-gray-600"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : item.color)} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-8">
        <div className="bg-dark-card p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"} 
              alt="User profile" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{user?.name || "Alex Chen"}</p>
              <p className="text-sm text-text-secondary">{user?.tier || "Pro Trader"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
