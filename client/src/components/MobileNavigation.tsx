import { useState } from "react";
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
  Menu,
  X
} from "lucide-react";
import type { TabType } from "@/types";

interface MobileNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navigationItems = [
  { id: 'sphere' as TabType, label: 'The Sphere', icon: ChartLine },
  { id: 'omnifi' as TabType, label: 'OmniFi', icon: Users },
  { id: 'omnitrade' as TabType, label: 'OmniTrade', icon: ArrowLeftRight },
  { id: 'omniyield' as TabType, label: 'OmniYield', icon: Coins },
  { id: 'aibot' as TabType, label: 'AI Bot', icon: Bot },
  { id: 'creator' as TabType, label: 'Creator Hub', icon: Star },
  { id: 'learn' as TabType, label: 'Learn', icon: GraduationCap },
];

export function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabChange = (tab: TabType) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 to-purple-900 border-b border-purple-500/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold font-orbitron bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            OmniSphere
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="fixed top-16 left-0 right-0 bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700 p-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-purple-600/20 text-white border border-purple-500/50"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-inter text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 to-purple-900 border-t border-purple-500/30">
        <div className="grid grid-cols-5 gap-1 p-2">
          {[
            { id: 'dashboard', icon: ChartLine, label: 'Home' },
            { id: 'trading', icon: ArrowLeftRight, label: 'Trade' },
            { id: 'wallet', icon: Wallet, label: 'Wallet' },
            { id: 'socialfi', icon: Users, label: 'Social' },
            { id: 'staking', icon: Coins, label: 'Stake' }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as TabType)}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-purple-600/20 text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-xs font-inter">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}