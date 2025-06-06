import { ChevronRight, Home } from "lucide-react";
import type { TabType } from "@/types";

interface BreadcrumbProps {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
}

const breadcrumbMap: Record<TabType, { label: string; parent?: TabType }> = {
  sphere: { label: "The Sphere" },
  omnifi: { label: "OmniFi", parent: "sphere" },
  omnitrade: { label: "OmniTrade", parent: "sphere" },
  omniyield: { label: "OmniYield", parent: "sphere" },
  aibot: { label: "AI Bot", parent: "sphere" },
  creator: { label: "Creator Hub", parent: "omnifi" },
  learn: { label: "DeFi Academy", parent: "sphere" },
};

export function Breadcrumb({ activeTab, onNavigate }: BreadcrumbProps) {
  const buildBreadcrumbs = (tab: TabType): Array<{ tab: TabType; label: string }> => {
    const current = breadcrumbMap[tab];
    const breadcrumbs: Array<{ tab: TabType; label: string }> = [];
    
    if (!current) {
      // Fallback for undefined tabs
      breadcrumbs.push({ tab, label: tab.charAt(0).toUpperCase() + tab.slice(1) });
      return breadcrumbs;
    }
    
    if (current.parent) {
      breadcrumbs.push(...buildBreadcrumbs(current.parent));
    }
    
    breadcrumbs.push({ tab, label: current.label });
    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs(activeTab);

  return (
    <nav className="flex items-center space-x-2 text-sm font-inter mb-4">
      <button
        onClick={() => onNavigate("sphere")}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
      
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.tab} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <button
            onClick={() => onNavigate(crumb.tab)}
            className={`transition-colors ${
              index === breadcrumbs.length - 1
                ? "text-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {crumb.label}
          </button>
        </div>
      ))}
    </nav>
  );
}