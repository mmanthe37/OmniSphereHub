import { cn } from "@/lib/utils";
import type { TabType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ChartLine, 
  Users, 
  ArrowLeftRight, 
  Bot, 
  Coins,
  Grid3X3,
  User,
  UserPlus
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
  { id: "nft" as TabType, label: "NFT Creator", icon: Grid3X3, color: "text-neon-green" },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user } = useAuth();
  
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
      
      <nav className="space-y-2 flex-1">
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
      
      <div className="mt-auto pt-8 space-y-3">
        {user ? (
          <button
            onClick={() => onTabChange("account" as TabType)}
            className={cn(
              "w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 text-left",
              "hover:bg-dark-card",
              activeTab === "account" && "bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-neon"
            )}
          >
            <User className={cn("w-5 h-5", activeTab === "account" ? "text-white" : "text-neon-green")} />
            <span>OmniAccount</span>
          </button>
        ) : (
          <button
            onClick={() => onTabChange("register" as TabType)}
            className={cn(
              "w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 text-left",
              "hover:bg-dark-card",
              activeTab === "register" && "bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-neon"
            )}
          >
            <UserPlus className={cn("w-5 h-5", activeTab === "register" ? "text-white" : "text-neon-purple")} />
            <span>Create Account</span>
          </button>
        )}
        
        <div className="bg-dark-card p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <p className="font-medium text-white">{user?.email || 'Guest User'}</p>
              <p className="text-sm text-gray-400">
                {user ? 'Account Member' : 'Guest'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
