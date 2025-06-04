import { cn } from "@/lib/utils";
import { TabType } from "@/pages/dashboard";
import { 
  ChartLine, 
  Users, 
  ArrowLeftRight, 
  Bot, 
  Coins,
  Grid3X3
} from "lucide-react";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems = [
  { id: "dashboard" as TabType, label: "Dashboard", icon: ChartLine, color: "text-neon-cyan" },
  { id: "socialfi" as TabType, label: "SocialFi", icon: Users, color: "text-neon-purple" },
  { id: "trading" as TabType, label: "Trading", icon: ArrowLeftRight, color: "text-neon-green" },
  { id: "aibot" as TabType, label: "AI Bot", icon: Bot, color: "text-neon-cyan" },
  { id: "staking" as TabType, label: "Staking", icon: Coins, color: "text-neon-purple" },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-dark-secondary border-r border-dark-border p-6 fixed h-full z-10">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-xl flex items-center justify-center">
          <Grid3X3 className="text-white text-xl" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          OmniSphere
        </h1>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 text-left",
                "hover:bg-dark-card",
                activeTab === item.id && "bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-neon"
              )}
            >
              <Icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : item.color)} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-8">
        <div className="bg-dark-card p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=100&h=100&fit=crop" 
              alt="User profile" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">Alex Chen</p>
              <p className="text-sm text-text-secondary">Pro Trader</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
