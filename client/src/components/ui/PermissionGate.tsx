import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserPermissions } from "@/lib/user-permissions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, UserPlus } from "lucide-react";
import AuthModal from "@/components/AuthModal";

interface PermissionGateProps {
  feature: keyof UserPermissions;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export default function PermissionGate({ 
  feature, 
  children, 
  fallback, 
  showUpgrade = true 
}: PermissionGateProps) {
  const { canAccess, userType, user } = useAuth();

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default permission denied UI
  const getUpgradeMessage = () => {
    if (!user) {
      return {
        title: "Account Required",
        description: "Create a free account to access this feature",
        action: "Create Account",
        icon: <UserPlus className="w-6 h-6" />
      };
    }
    
    if (userType === 'free') {
      return {
        title: "Premium Feature",
        description: "Upgrade to access advanced features and unlimited usage",
        action: "Upgrade to Premium",
        icon: <Crown className="w-6 h-6" />
      };
    }

    return {
      title: "Access Restricted",
      description: "This feature is not available for your account type",
      action: "Learn More",
      icon: <Lock className="w-6 h-6" />
    };
  };

  if (!showUpgrade) {
    return null;
  }

  const upgradeInfo = getUpgradeMessage();

  return (
    <Card className="bg-slate-800/30 border-slate-700/50">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-slate-700/50 rounded-full text-slate-400">
            {upgradeInfo.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">{upgradeInfo.title}</h3>
            <p className="text-sm text-slate-400 mb-4">{upgradeInfo.description}</p>
          </div>
          {!user ? (
            <AuthModal>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {upgradeInfo.action}
              </Button>
            </AuthModal>
          ) : (
            <Button 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {upgradeInfo.action}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Feature limit indicator component
interface FeatureLimitProps {
  feature: keyof UserPermissions;
  current: number;
  children: ReactNode;
}

export function FeatureLimit({ feature, current, children }: FeatureLimitProps) {
  const { getLimit, userType } = useAuth();
  const limit = getLimit(feature);

  if (limit === -1) {
    return <>{children}</>; // Unlimited
  }

  const isAtLimit = current >= limit;
  const percentage = limit > 0 ? (current / limit) * 100 : 0;

  return (
    <div>
      {children}
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Usage: {current} / {limit === -1 ? '∞' : limit}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all ${
              isAtLimit ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {isAtLimit && (
          <p className="text-xs text-red-400 mt-1">
            Limit reached. {userType === 'free' ? 'Upgrade to premium for unlimited access.' : 'Contact support for higher limits.'}
          </p>
        )}
      </div>
    </div>
  );
}